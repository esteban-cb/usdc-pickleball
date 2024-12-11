import type { DUPRPlayer } from '../types/dupr';

const DUPR_API_BASE = 'https://backend.mydupr.com';

export async function getDUPRPlayer(duprId: string, token: string): Promise<DUPRPlayer> {
  const response = await fetch(`${DUPR_API_BASE}/players/v1.0/player/${duprId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch DUPR player');
  }
  
  return response.json();
}

export async function validateDUPRRating(
  duprId: string, 
  eventFormat: 'singles' | 'doubles' | 'mixed',
  minRating: number,
  maxRating: number,
  token: string
): Promise<boolean> {
  const player = await getDUPRPlayer(duprId, token);
  const rating = player.ratings[eventFormat];
  return rating >= minRating && rating <= maxRating;
} 