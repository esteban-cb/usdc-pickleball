import { NextResponse } from 'next/server';
import { MOCK_EVENTS } from '../../mock-data';

// Initialize in-memory storage with mock events
let events = [...MOCK_EVENTS];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newEvent = {
      ...data,
      id: `${Date.now()}`,
      currentParticipants: 0
    };
    events.push(newEvent);
    
    return NextResponse.json({
      success: true,
      event: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ events });
} 