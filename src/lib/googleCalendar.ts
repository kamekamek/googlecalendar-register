import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

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
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    
    console.log('イベントが正常に追加されました:', response.data);
    return response.data;
  } catch (error) {
    console.error('イベントの追加に失敗しました:', error);
    throw error;
  }
} 