import { createRegistration, getRegistrations } from '@/app/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { eventId, playerAddress, playerName, duprId, duprRating } = await request.json();
    
    const registration = await createRegistration({
      eventId,
      playerAddress,
      playerName,
      duprId,
      duprRating
    });
    
    return NextResponse.json({ success: true, registration });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const registrations = await getRegistrations(eventId);
    console.log('Fetched registrations:', registrations);
    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database error', details: error.message },
      { status: 500 }
    );
  }
} 