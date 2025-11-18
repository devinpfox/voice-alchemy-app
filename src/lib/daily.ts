// Daily.co Video Call Integration
// Documentation: https://docs.daily.co/reference/rest-api

const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_BASE_URL = 'https://api.daily.co/v1';

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config?: {
    max_participants?: number;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
  };
}

export interface CreateRoomOptions {
  name?: string;
  privacy?: 'public' | 'private';
  properties?: {
    max_participants?: number;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
    enable_recording?: boolean;
    start_video_off?: boolean;
    start_audio_off?: boolean;
  };
}

/**
 * Create a new Daily.co room for video calls
 */
export async function createDailyRoom(options: CreateRoomOptions = {}): Promise<DailyRoom> {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not configured');
  }

  const response = await fetch(`${DAILY_BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create Daily room: ${error.error || response.statusText}`);
  }

  return response.json();
}

/**
 * Get information about a Daily.co room
 */
export async function getDailyRoom(roomName: string): Promise<DailyRoom> {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not configured');
  }

  const response = await fetch(`${DAILY_BASE_URL}/rooms/${roomName}`, {
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get Daily room: ${error.error || response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a Daily.co room
 */
export async function deleteDailyRoom(roomName: string): Promise<void> {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not configured');
  }

  const response = await fetch(`${DAILY_BASE_URL}/rooms/${roomName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${DAILY_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to delete Daily room: ${error.error || response.statusText}`);
  }
}

/**
 * Create a meeting token for a specific room
 * This provides temporary access to a room with specific permissions
 */
export async function createMeetingToken(roomName: string, options: {
  user_name?: string;
  is_owner?: boolean;
  enable_recording?: boolean;
} = {}): Promise<string> {
  if (!DAILY_API_KEY) {
    throw new Error('DAILY_API_KEY is not configured');
  }

  const response = await fetch(`${DAILY_BASE_URL}/meeting-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        ...options,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create meeting token: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  return data.token;
}
