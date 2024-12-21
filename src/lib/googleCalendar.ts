import { google } from 'googleapis';
import { CalendarEvent } from './eventParser';

export async function addEventsToCalendar(
  accessToken: string,
  events: CalendarEvent[]
) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const results = await Promise.all(
    events.map(async (event) => {
      try {
        const response = await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
        return {
          success: true,
          eventId: response.data.id,
          summary: event.summary,
        };
      } catch (error) {
        console.error('Error adding event:', error);
        return {
          success: false,
          summary: event.summary,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    })
  );

  return results;
} 