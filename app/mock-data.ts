import type { EventFormat, EventType, SkillLevel } from './types/dupr';

export const MOCK_EVENTS = [
  // Copy all mock eveconst MOCK_EVENTS = [
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