'use client';

import { useState, useEffect } from 'react';
import WalletHeader from './components/WalletHeader';
import CreateEvent from './components/CreateEvent';
import EventRegistration from './components/EventRegistration';
import { useAccount } from 'wagmi';
import type { EventFormat, EventType, SkillLevel } from './types/dupr';
import EventDetails from './components/EventDetails';


const MOCK_EVENTS = [
  {
    id: '1',
    name: 'Pro Mixed Doubles Round Robin',
    type: 'roundRobin' as EventType,
    format: 'mixed' as EventFormat,
    skillLevel: '4.5+' as SkillLevel,
    eventDate: '2024-03-15',
    startTime: '09:00',
    endTime: '14:00',
    registrationDeadline: '2024-03-10',
    minRating: 4.5,
    maxRating: 6.0,
    entryFeeUSDC: 75,
    maxParticipants: 24,
    currentParticipants: 16,
    location: 'Main Street Pickleball Club',
    description: 'Professional level mixed doubles tournament with guaranteed 6 games',
    imageUrl: '/images/mixed-doubles.jpg'
  },
  {
    id: '2',
    name: 'Intermediate Doubles Ladder',
    type: 'ladder' as EventType,
    format: 'doubles' as EventFormat,
    skillLevel: '3.5-4.0' as SkillLevel,
    eventDate: '2024-04-01',
    startTime: '18:00',
    endTime: '21:00',
    registrationDeadline: '2024-03-25',
    minRating: 3.5,
    maxRating: 4.0,
    entryFeeUSDC: 40,
    maxParticipants: 32,
    currentParticipants: 22,
    location: 'Indoor Pickleball Zone',
    description: 'Weekly doubles ladder for intermediate players. Play multiple matches and move up/down the ladder.',
    imageUrl: '/images/double-ladder.jpg'
  },
  {
    id: '3',
    name: 'Beginner Friendly Social',
    type: 'social' as EventType,
    format: 'mixed' as EventFormat,
    skillLevel: '2.5-3.0' as SkillLevel,
    eventDate: '2024-05-08',
    startTime: '10:00',
    endTime: '13:00',
    registrationDeadline: '2024-05-06',
    minRating: 2.5,
    maxRating: 3.0,
    entryFeeUSDC: 25,
    maxParticipants: 20,
    currentParticipants: 8,
    location: 'Community Center Courts',
    description: 'Fun social event for beginners. Includes basic instruction and organized play.',
    imageUrl: '/images/beginner-social.jpg'
  },
  {
    id: '4',
    name: 'Advanced Singles Championship',
    type: 'bracket' as EventType,
    format: 'singles' as EventFormat,
    skillLevel: '4.0-4.5' as SkillLevel,
    eventDate: '2024-06-01',
    startTime: '08:00',
    endTime: '17:00',
    registrationDeadline: '2024-05-25',
    minRating: 4.0,
    maxRating: 4.5,
    entryFeeUSDC: 60,
    maxParticipants: 32,
    currentParticipants: 12,
    location: 'Championship Courts',
    description: 'Single elimination tournament with consolation bracket. Medals for top 3 finishers.',
    imageUrl: '/images/singles-championship.jpg'
  },
  {
    id: '5',
    name: 'Mixed Skills Round Robin',
    type: 'roundRobin' as EventType,
    format: 'mixed' as EventFormat,
    skillLevel: '3.0-3.5' as SkillLevel,
    eventDate: '2024-03-22',
    startTime: '16:00',
    endTime: '20:00',
    registrationDeadline: '2024-03-18',
    minRating: 3.0,
    maxRating: 3.5,
    entryFeeUSDC: 35,
    maxParticipants: 24,
    currentParticipants: 18,
    location: 'Sunset Pickleball Complex',
    description: 'Evening round robin with rotating partners. Great for meeting new players!',
    imageUrl: '/images/mixed-skills.jpg'
  },
  {
    id: '6',
    name: 'Ladies Doubles Social',
    type: 'social' as EventType,
    format: 'doubles' as EventFormat,
    skillLevel: '3.0-3.5' as SkillLevel,
    eventDate: '2024-05-29',
    startTime: '09:00',
    endTime: '12:00',
    registrationDeadline: '2024-05-25',
    minRating: 3.0,
    maxRating: 3.5,
    entryFeeUSDC: 30,
    maxParticipants: 24,
    currentParticipants: 14,
    location: 'Riverside Recreation Center',
    description: 'Ladies-only doubles social event. All skill levels welcome within rating range.',
    imageUrl: '/images/ladies-doubles.jpg'
  },
  {
    id: '7',
    name: 'Pro Singles Shootout',
    type: 'bracket' as EventType,
    format: 'singles' as EventFormat,
    skillLevel: '4.5+' as SkillLevel,
    eventDate: '2024-06-15',
    startTime: '08:00',
    endTime: '18:00',
    registrationDeadline: '2024-06-10',
    minRating: 4.5,
    maxRating: 6.0,
    entryFeeUSDC: 100,
    maxParticipants: 32,
    currentParticipants: 8,
    location: 'Elite Pickleball Academy',
    description: 'High-stakes professional singles tournament with cash prizes.',
    imageUrl: '/images/pro-singles.jpg'
  },
  {
    id: '8',
    name: 'Youth Development Series',
    type: 'roundRobin' as EventType,
    format: 'mixed' as EventFormat,
    skillLevel: '2.5-3.0' as SkillLevel,
    eventDate: '2024-03-08',
    startTime: '14:00',
    endTime: '17:00',
    registrationDeadline: '2024-03-05',
    minRating: 2.5,
    maxRating: 3.0,
    entryFeeUSDC: 20,
    maxParticipants: 16,
    currentParticipants: 6,
    location: 'Community Youth Center',
    description: 'Youth-focused tournament with coaching and skill development.',
    imageUrl: '/images/youth-series.jpg'
  }
];

export default function Home() {
  const { isConnected } = useAccount();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<EventFormat | 'all'>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  useEffect(() => {
    const fetchEventsAndRegistrations = async () => {
      try {
        const eventsResponse = await fetch('/api/events');
        const eventsData = await eventsResponse.json();
        const allEvents = [...MOCK_EVENTS, ...eventsData.events];
        setEvents(allEvents);

        const counts: Record<string, number> = {};
        await Promise.all(
          allEvents.map(async (event) => {
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

    const handleRegistrationUpdate = () => {
      fetchEventsAndRegistrations();
    };

    const handleEventCreated = (e: CustomEvent) => {
      setSelectedEvent(e.detail);
      setShowCreateEvent(false);
    };

    window.addEventListener('registrationUpdated', handleRegistrationUpdate);
    window.addEventListener('eventCreated', handleEventCreated as EventListener);
    fetchEventsAndRegistrations();

    return () => {
      window.removeEventListener('registrationUpdated', handleRegistrationUpdate);
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
                      onClick={() => setSelectedEvent(event)}
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