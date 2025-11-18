import { NextResponse } from 'next/server';
import { createDailyRoom } from '@/lib/daily';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, maxParticipants = 10 } = body;

    const room = await createDailyRoom({
      name: sessionId || `session-${Date.now()}`,
      privacy: 'private',
      properties: {
        max_participants: maxParticipants,
        enable_chat: true,
        enable_screenshare: true,
        enable_recording: true,
        start_video_off: false,
        start_audio_off: false,
      },
    });

    return NextResponse.json({ room });
  } catch (error: any) {
    console.error('Error creating Daily room:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create room' },
      { status: 500 }
    );
  }
}
