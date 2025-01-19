import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GaxiosError } from 'gaxios';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export interface CalendarEvent {
  summary: string;
  description?: string;
  start: {
    date?: string;
    dateTime?: string;
    timeZone: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone: string;
  };
  location?: string;
}

export async function addEvent(event: CalendarEvent, accessToken: string) {
  try {
    console.log('Debug: Setting credentials with access token:', accessToken.substring(0, 10) + '...');
    oauth2Client.setCredentials({ access_token: accessToken });
    
    console.log('Debug: Creating calendar client...');
    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });

    console.log('Debug: Attempting to insert event:', JSON.stringify(event, null, 2));
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    
    console.log('イベントが正常に追加されました:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('イベントの追加に失敗しました:', error);
    if (error instanceof GaxiosError && error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    throw error;
  }
} 