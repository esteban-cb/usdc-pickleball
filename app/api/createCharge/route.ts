import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, recipientAddress, recipientName, eventId, duprId, duprRating } = body;

    // Create a unique charge ID
    const chargeId = `chr_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store registration data in database
    await sql`
      INSERT INTO registrations (
        charge_id, 
        event_id, 
        recipient_address, 
        recipient_name,
        dupr_id,
        dupr_rating,
        amount,
        status
      ) VALUES (
        ${chargeId},
        ${eventId},
        ${recipientAddress},
        ${recipientName},
        ${duprId},
        ${duprRating},
        ${amount},
        'pending'
      )
    `;

    return NextResponse.json({ 
      data: { 
        id: chargeId 
      }
    });

  } catch (error) {
    console.error('Create charge error:', error);
    return NextResponse.json(
      { error: 'Failed to create charge' },
      { status: 500 }
    );
  }
} 