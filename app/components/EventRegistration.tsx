'use client';

import React, { useState } from 'react';
import { IdentityCard } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { toast } from 'react-hot-toast';
import { base } from 'wagmi/chains';
import type { LifecycleStatus } from '@coinbase/onchainkit/checkout';

interface EventRegistrationProps {
  event: {
    id: string;
    name: string;
    entryFeeUSDC: number;
    format: 'singles' | 'doubles' | 'mixed';
    minRating: number;
    maxRating: number;
  };
}

interface RegistrationData {
  nameInput: string;
  resolvedAddress: string;
  duprId: string;
  duprRating: string;
}

const resolveEnsName = async (name: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.ensideas.com/ens/resolve/${name}`);
    const data = await response.json();
    console.log('ENS Resolution:', data);
    return data?.address || null;
  } catch (error) {
    console.error('ENS resolution error:', error);
    return null;
  }
};

const resolveBaseName = async (name: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.web3.bio/profile/${name}`);
    const data = await response.json();
    console.log('Base Resolution:', data);
    return data?.address || null;
  } catch (error) {
    console.error('Base resolution error:', error);
    return null;
  }
};

export default function EventRegistration({ event }: EventRegistrationProps) {
  const { isConnected } = useAccount();
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    nameInput: '',
    resolvedAddress: '',
    duprId: '',
    duprRating: ''
  });
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = async (input: string) => {
    console.log('Input changed:', input);
    setRegistrationData(prev => ({ ...prev, nameInput: input, resolvedAddress: '' }));
    setIsResolving(true);
    
    try {
      if (!input) return;

      if (isAddress(input)) {
        setRegistrationData(prev => ({ ...prev, resolvedAddress: input }));
        return;
      }

      if (input.endsWith('.base.eth')) {
        const address = await resolveBaseName(input);
        if (address && isAddress(address)) {
          setRegistrationData(prev => ({ ...prev, resolvedAddress: address }));
          return;
        }
      }

      if (input.endsWith('.eth')) {
        const address = await resolveEnsName(input);
        if (address && isAddress(address)) {
          setRegistrationData(prev => ({ ...prev, resolvedAddress: address }));
          return;
        }
      }
    } catch (error) {
      console.error('Resolution error:', error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleDuprRatingChange = (value: string) => {
    const rating = parseFloat(value);
    setRegistrationData(prev => ({ ...prev, duprRating: value }));
    
    if (rating < event.minRating || rating > event.maxRating) {
      setError(`Rating must be between ${event.minRating} and ${event.maxRating}`);
    } else {
      setError('');
    }
  };

  const handleStatus = (status: LifecycleStatus) => {
    if (status.statusName === 'success') {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto 
          flex flex-col items-center p-6`}>
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-medium mb-2 dark:text-white">Registration Successful!</div>
          <div className="text-gray-600 dark:text-gray-400 text-center">
            You have successfully registered for the event
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });
      window.location.reload();
    } else if (status.statusName === 'error') {
      toast.error('Registration failed. Please try again.');
    }
  };

  const createChargeHandler = () => async () => {
    try {
      const response = await fetch('/api/createCharge', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          amount: event.entryFeeUSDC,
          recipientAddress: registrationData.resolvedAddress,
          recipientName: registrationData.nameInput,
          eventId: event.id,
          duprId: registrationData.duprId,
          duprRating: registrationData.duprRating
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create charge');
      }
  
      const data = await response.json();
      return data.data.id;
    } catch (error) {
      console.error('Error creating charge:', error);
      toast.error('Failed to create registration. Please try again.');
      throw error;
    }
  };

  const handleTestRegistration = async () => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          playerAddress: registrationData.resolvedAddress,
          playerName: registrationData.nameInput,
          duprId: registrationData.duprId,
          duprRating: registrationData.duprRating
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register');
      }

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto 
          flex flex-col items-center p-6`}>
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-medium mb-2 dark:text-white">Registration Successful!</div>
          <div className="text-gray-600 dark:text-gray-400 text-center">
            You have successfully registered for {event.name}
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-center',
      });

      const registrationsResponse = await fetch(`/api/registrations?eventId=${event.id}`);
      const registrationsData = await registrationsResponse.json();
      if (typeof window !== 'undefined') {
        const registrationEvent = new CustomEvent('registrationUpdated', { 
          detail: {
            eventId: event.id,
            registrations: registrationsData.registrations,
            currentParticipants: registrationsData.registrations.length
          }
        });
        window.dispatchEvent(registrationEvent);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <p className="text-sm text-purple-600 dark:text-purple-300">
          Please connect your wallet to register
        </p>
      </div>
    );
  }

  const isValidRegistration = 
    registrationData.resolvedAddress && 
    registrationData.duprId && 
    registrationData.duprRating && 
    !error;

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your ENS, Base Name, or Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              value={registrationData.nameInput}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="name.eth, name.base.eth, or 0x..."
              className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
            />
            {isResolving && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {registrationData.resolvedAddress && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <IdentityCard 
              address={registrationData.resolvedAddress as `0x${string}`}
              chain={base}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">DUPR ID</label>
            <input 
              type="text"
              value={registrationData.duprId}
              onChange={(e) => setRegistrationData(prev => ({ ...prev, duprId: e.target.value }))}
              placeholder="Enter your DUPR ID"
              className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">DUPR Rating</label>
            <input 
              type="number"
              step="0.1"
              value={registrationData.duprRating}
              onChange={(e) => handleDuprRatingChange(e.target.value)}
              placeholder={`${event.minRating} - ${event.maxRating}`}
              className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
            />
            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">⚠️ Beta Notice:</span> Registration is currently free. USDC payment integration coming soon.
              Entry fee will be {event.entryFeeUSDC} USDC.
            </p>
          </div>
          <button
            onClick={handleTestRegistration}
            disabled={!isValidRegistration}
            className={`w-full px-4 py-2 rounded-xl ${
              isValidRegistration 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            Register for Event
          </button>
        </div>
      </div>
    </div>
  );
}

