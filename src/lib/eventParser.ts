import { CalendarEvent } from './googleCalendar';

export function parseEvents(text: string): CalendarEvent[] {
  // テキストを行ごとに分割
  const lines = text.split('\n').filter(line => line.trim());
  const events: CalendarEvent[] = [];

  for (const line of lines) {
    try {
      // 基本的なフォーマット: "タイトル: YYYY/MM/DD HH:mm-HH:mm [場所]"
      const match = line.match(/^(.+?):\s*(\d{4}\/\d{1,2}\/\d{1,2})\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})(?:\s*\[(.+?)\])?$/);
      
      if (match) {
        const [, summary, date, startTime, endTime, location] = match;
        const startDateTime = new Date(`${date} ${startTime}`);
        const endDateTime = new Date(`${date} ${endTime}`);

        events.push({
          summary,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          },
          ...(location && { location }),
        });
      }
    } catch (error) {
      console.error('Error parsing line:', line, error);
    }
  }

  return events;
} 