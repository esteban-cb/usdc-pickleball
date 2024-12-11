import { NextResponse } from 'next/server';

// Temporary in-memory storage until we set up the database
let events: any[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate a simple unique ID
    const newEvent = {
      ...data,
      id: `${Date.now()}`,
      currentParticipants: 0,
      createdAt: new Date().toISOString()
    };

    // Store the event (temporarily in memory)
    events.push(newEvent);

    // Log for debugging
    console.log('Created event:', newEvent);

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