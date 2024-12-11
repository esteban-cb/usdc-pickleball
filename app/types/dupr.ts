export interface DUPRPlayer {
  id: number;
  fullName: string;
  duprId: string;
  ratings: {
    singles: number;
    doubles: number;
    mixed: number;
  };
  imageUrl?: string;
}

export type EventFormat = 'singles' | 'doubles' | 'mixed';
export type EventType = 'roundRobin' | 'bracket' | 'ladder' | 'social';
export type SkillLevel = '2.5-3.0' | '3.0-3.5' | '3.5-4.0' | '4.0-4.5' | '4.5+';

export interface PickleballEvent {
  id: string;
  name: string;
  type: EventType;
  format: EventFormat;
  skillLevel: SkillLevel;
  eventDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  minRating: number;
  maxRating: number;
  entryFeeUSDC: number;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  description?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  transactionHash?: string;
} 