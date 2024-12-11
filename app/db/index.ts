import { sql } from '@vercel/postgres';
import { PickleballEvent } from '../types/dupr';

export async function createEvent(event: Partial<PickleballEvent>) {
  const result = await sql`
    INSERT INTO events (
      name, type, format, skill_level, event_date, start_time, end_time,
      registration_deadline, min_rating, max_rating, entry_fee_usdc,
      max_participants, location, description, image_url, created_by
    ) VALUES (
      ${event.name}, ${event.type}, ${event.format}, ${event.skillLevel},
      ${event.eventDate}, ${event.startTime}, ${event.endTime},
      ${event.registrationDeadline}, ${event.minRating}, ${event.maxRating},
      ${event.entryFeeUSDC}, ${event.maxParticipants}, ${event.location},
      ${event.description}, ${event.imageUrl}, ${event.createdBy}
    )
    RETURNING *;
  `;
  return result.rows[0];
}

export async function createRegistration(registration: {
  eventId: string;
  playerAddress: string;
  playerName: string;
  duprId: string;
  duprRating: number;
}) {
  const result = await sql`
    INSERT INTO registrations (
      event_id, player_address, player_name, dupr_id, dupr_rating
    ) VALUES (
      ${registration.eventId}, ${registration.playerAddress}, 
      ${registration.playerName}, ${registration.duprId}, ${registration.duprRating}
    )
    RETURNING *;
  `;
  return result.rows[0];
}

export async function getRegistrations(eventId: string) {
  const result = await sql`
    SELECT * FROM registrations 
    WHERE event_id = ${eventId}
    ORDER BY registration_date DESC;
  `;
  return result.rows;
} 