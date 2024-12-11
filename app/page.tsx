'use client';

import { useState, useEffect } from 'react';
import WalletHeader from './components/WalletHeader';
import CreateEvent from './components/CreateEvent';
import EventRegistration from './components/EventRegistration';
import { useAccount } from 'wagmi';
import type { EventFormat, EventType, SkillLevel, PickleballEvent } from './types/dupr';
import EventDetails from './components/EventDetails';
import { MOCK_EVENTS } from './mock-data';

export default function Home() {
  const { isConnected } = useAccount();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<EventFormat | 'all'>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<PickleballEvent | null>(null);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchEventsAndRegistrations = async () => {
      try {
        // Seed mock events first
        await fetch('/api/events/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: MOCK_EVENTS })
        });

        // Then fetch all events
        const eventsResponse = await fetch('/api/events');
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events);

        // Fetch registration counts
        const counts: Record<string, number> = {};
        await Promise.all(
          eventsData.events.map(async (event) => {
            const response = await fetch(`/api/registrations?eventId=${event.id}`);
            const data = await response.json();
            counts[event.id] = data.registrations.length;
          })
        );
        setRegistrationCounts(counts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    const handleRegistrationUpdate = (e: CustomEvent) => {
      setRegistrationCounts(prev => ({
        ...prev,
        [e.detail.eventId]: e.detail.currentParticipants
      }));
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === e.detail.eventId 
            ? { ...event, currentParticipants: e.detail.currentParticipants }
            : event
        )
      );
    };

    const handleEventCreated = (e: CustomEvent) => {
      setSelectedEvent(e.detail);
      setShowCreateEvent(false);
      fetchEventsAndRegistrations(); // Refresh events when new event is created
    };

    window.addEventListener('registrationUpdated', handleRegistrationUpdate as EventListener);
    window.addEventListener('eventCreated', handleEventCreated as EventListener);
    
    fetchEventsAndRegistrations();

    return () => {
      window.removeEventListener('registrationUpdated', handleRegistrationUpdate as EventListener);
      window.removeEventListener('eventCreated', handleEventCreated as EventListener);
    };
  }, [showCreateEvent]);

  const getPriceRange = (price: number) => {
    if (price < 30) return 'low';
    if (price <= 60) return 'medium';
    return 'high';
  };

  const filteredEvents = events.filter(event => 
    (selectedFormat === 'all' || event.format === selectedFormat) &&
    (selectedSkillLevel === 'all' || event.skillLevel === selectedSkillLevel) &&
    (priceRange === 'all' || getPriceRange(event.entryFeeUSDC) === priceRange) &&
    (event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Rest of the component remains the same

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WalletHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl mb-8">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
            🚧 <span className="font-semibold">Beta Version:</span> This platform is currently in testing. 
            USDC payment integration coming soon. All registrations are free during the beta period.
          </p>
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            {showCreateEvent ? 'Create Event' : 'Pickleball Tournaments'}
          </h1>
          
          {isConnected && (
            <button
              onClick={() => setShowCreateEvent(!showCreateEvent)}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              {showCreateEvent ? '← Back to Events' : '+ Create Event'}
            </button>
          )}
        </div>
        
        {showCreateEvent ? (
          <CreateEvent />
        ) : selectedEvent ? (
          <EventDetails 
            event={selectedEvent} 
            onBack={() => setSelectedEvent(null)} 
          />
        ) : (
          <div className="space-y-8">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search events by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as EventFormat | 'all')}
                  className="w-full px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800"
                >
                  <option value="all">All Formats</option>
                  <option value="singles">Singles</option>
                  <option value="doubles">Doubles</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <select
                  value={selectedSkillLevel}
                  onChange={(e) => setSelectedSkillLevel(e.target.value as SkillLevel | 'all')}
                  className="w-full px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800"
                >
                  <option value="all">All Skill Levels</option>
                  <option value="2.5-3.0">2.5-3.0</option>
                  <option value="3.0-3.5">3.0-3.5</option>
                  <option value="3.5-4.0">3.5-4.0</option>
                  <option value="4.0-4.5">4.0-4.5</option>
                  <option value="4.5+">4.5+</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under $30</option>
                  <option value="medium">$30-$60</option>
                  <option value="high">Over $60</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                    <div className="flex items-center justify-between mb-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{event.eventDate}</span>
                      <span>{event.format}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Available Slots</span>
                        <span className="font-medium">
                          {event.maxParticipants - (registrationCounts[event.id] || 0)}/{event.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${((registrationCounts[event.id] || 0) / event.maxParticipants) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                    <button
                      onClick={() => setSelectedEvent({
                        ...event,
                        createdBy: 'SYSTEM',
                        createdAt: new Date()
                      } as PickleballEvent)}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      View Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}