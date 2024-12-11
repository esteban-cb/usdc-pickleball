'use client';

import { useEffect, useState } from 'react';
import { IdentityCard } from '@coinbase/onchainkit/identity';
import { base } from 'wagmi/chains';
import EventRegistration from './EventRegistration';

interface RegisteredPlayer {
  playerAddress: string;
  playerName: string;
  duprId: string;
  duprRating: number;
  registrationDate: string;
}

export default function EventDetails({ event, onBack }: { event: any, onBack: () => void }) {
  const [registeredPlayers, setRegisteredPlayers] = useState<RegisteredPlayer[]>([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`/api/registrations?eventId=${event.id}`);
        const data = await response.json();
        setRegisteredPlayers(data.registrations);
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
      }
    };

    const handleRegistrationUpdate = (e: CustomEvent) => {
      setRegisteredPlayers(e.detail);
    };

    window.addEventListener('registrationUpdated', handleRegistrationUpdate as EventListener);
    fetchRegistrations();

    return () => {
      window.removeEventListener('registrationUpdated', handleRegistrationUpdate as EventListener);
    };
  }, [event.id]);

  const registrationDeadline = new Date(event.registrationDeadline);
  const now = new Date();
  const timeLeft = registrationDeadline.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-purple-600 hover:text-purple-700"
      >
        ← Back to Events
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <img 
            src={event.imageUrl} 
            alt={event.name}
            className="w-full rounded-xl shadow-lg" 
          />
          <div className="prose dark:prose-invert">
            <p>{event.description}</p>
            <div className="mt-4">
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Date:</strong> {event.eventDate}</p>
              <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
              <p><strong>Format:</strong> {event.format}</p>
              <p><strong>Skill Level:</strong> {event.skillLevel}</p>
              {daysLeft > 0 ? (
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Registration closes in {daysLeft} days
                </p>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Registration closed
                </p>
              )}
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => navigator.share({
                  title: event.name,
                  text: event.description,
                  url: window.location.href
                })}
                className="text-purple-600 hover:text-purple-700"
              >
                Share Event
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <EventRegistration event={event} />
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Registered Players ({registeredPlayers.length}/{event.maxParticipants})
            </h2>
            <div className="space-y-4">
              {registeredPlayers.map((player) => (
                <div key={player.playerAddress} className="border dark:border-gray-700 rounded-lg p-4">
                  <IdentityCard 
                    address={player.playerAddress as `0x${string}`}
                    chain={base}
                  />
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>DUPR Rating: {player.duprRating}</p>
                    <p>DUPR ID: {player.duprId}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 