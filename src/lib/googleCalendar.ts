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

// カレンダークライアントを初期化する関数
function initializeCalendarClient(accessToken: string) {
  oauth2Client.setCredentials({ 
    access_token: accessToken,
    scope: 'https://www.googleapis.com/auth/calendar.events'
  });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function addEvent(event: CalendarEvent, accessToken: string) {
  try {
    const calendar = initializeCalendarClient(accessToken);
    
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

// 複数のイベントを一括で追加する関数
export async function addEvents(events: CalendarEvent[], accessToken: string) {
  const calendar = initializeCalendarClient(accessToken);
  
  const promises = events.map(event => 
    calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    }).then(response => ({
      success: true,
      data: response.data,
      summary: event.summary
    })).catch(error => ({
      success: false,
      error: error instanceof GaxiosError ? error.message : '不明なエラー',
      summary: event.summary
    }))
  );

  return Promise.all(promises);
} 