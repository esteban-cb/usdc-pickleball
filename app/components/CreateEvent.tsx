'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { EventFormat, EventType, SkillLevel } from '../types/dupr';
import { toast } from 'react-hot-toast';

export default function CreateEvent() {
  const router = useRouter();
  const { address } = useAccount();
  const [eventData, setEventData] = useState({
    name: '',
    type: 'roundRobin' as EventType,
    format: 'mixed' as EventFormat,
    skillLevel: '3.5-4.0' as SkillLevel,
    eventDate: '',
    startTime: '',
    endTime: '',
    registrationDeadline: '',
    minRating: 3.5,
    maxRating: 4.0,
    entryFeeUSDC: 40,
    maxParticipants: 24,
    location: '',
    description: '',
    imageUrl: '',
    createdBy: address || ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEventData({ ...eventData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...eventData,
          createdBy: address,
          currentParticipants: 0
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto 
          flex flex-col items-center p-6`}>
          <div className="text-4xl mb-4">🎉</div>
          <div className="text-xl font-medium mb-2 dark:text-white">Event Created!</div>
          <div className="text-gray-600 dark:text-gray-400 text-center">
            Your event has been successfully created
          </div>
        </div>
      ), {
        duration: 3000,
        position: 'top-center',
      });

      router.push('/');
      router.refresh();
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('eventCreated', { 
          detail: data.event 
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Event creation error:', error);
      toast.error('Failed to create event. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium">Event Name</label>
          <input
            type="text"
            value={eventData.name}
            onChange={(e) => setEventData({...eventData, name: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Event Type</label>
          <select
            value={eventData.type}
            onChange={(e) => setEventData({...eventData, type: e.target.value as EventType})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
          >
            <option value="roundRobin">Round Robin</option>
            <option value="bracket">Bracket</option>
            <option value="ladder">Ladder</option>
            <option value="social">Social</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Format</label>
          <select
            value={eventData.format}
            onChange={(e) => setEventData({...eventData, format: e.target.value as EventFormat})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
          >
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Event Date</label>
          <input
            type="date"
            value={eventData.eventDate}
            onChange={(e) => setEventData({...eventData, eventDate: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Registration Deadline</label>
          <input
            type="date"
            value={eventData.registrationDeadline}
            onChange={(e) => setEventData({...eventData, registrationDeadline: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            value={eventData.startTime}
            onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="time"
            value={eventData.endTime}
            onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Entry Fee (USDC)</label>
          <input
            type="number"
            value={eventData.entryFeeUSDC}
            onChange={(e) => setEventData({...eventData, entryFeeUSDC: parseInt(e.target.value)})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Max Participants</label>
          <input
            type="number"
            value={eventData.maxParticipants}
            onChange={(e) => setEventData({...eventData, maxParticipants: parseInt(e.target.value)})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            required
            min="2"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={eventData.location}
            onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
            placeholder="Enter venue name and address"
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) => setEventData({...eventData, description: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Event Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
          {imagePreview && (
            <div className="relative h-48 w-full">
              <Image
                src={imagePreview}
                alt="Event preview"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="md:col-span-2 w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 disabled:bg-gray-400"
          disabled={!address}
        >
          Create Event
        </button>
      </div>
    </form>
  );
}