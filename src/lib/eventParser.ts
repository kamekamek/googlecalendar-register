import { CalendarEvent } from './googleCalendar';

export function parseEvents(text: string): CalendarEvent[] {
  // テキストを行ごとに分割
  const lines = text.split('\n').filter(line => line.trim());
  const events: CalendarEvent[] = [];
  const currentYear = new Date().getFullYear();

  let currentEvent: Partial<CalendarEvent> | null = null;

  for (const line of lines) {
    try {
      const trimmedLine = line.trim();

      // URLの行を処理
      if (trimmedLine.startsWith('http://') || trimmedLine.startsWith('https://')) {
        if (currentEvent) {
          currentEvent.description = trimmedLine;
          events.push(currentEvent as CalendarEvent);
          currentEvent = null;
        }
        continue;
      }

      // イベント行のパターン
      // 1. "MM/DD HH:mm- タイトル"
      // 2. "タイトル: YYYY/MM/DD HH:mm-HH:mm [場所]"
      const simpleMatch = trimmedLine.match(/^(\d{1,2})\/(\d{1,2})\s+(\d{1,2}:\d{2})-\s*(.+)$/);
      const detailedMatch = trimmedLine.match(/^(.+?):\s*(?:(\d{4})?\/)?(\d{1,2})\/(\d{1,2})\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})(?:\s*\[(.+?)\])?$/);

      if (simpleMatch) {
        // 簡易形式: "MM/DD HH:mm- タイトル"
        const [, monthStr, dayStr, startTime, summary] = simpleMatch;
        const month = parseInt(monthStr);
        const day = parseInt(dayStr);

        // 日付の妥当性チェック
        if (month < 1 || month > 12 || day < 1 || day > 31) {
          console.error('Invalid date:', line);
          continue;
        }

        // 終了時刻を開始時刻の1時間後に設定
        const startDateTime = new Date(`${currentYear}/${month}/${day} ${startTime}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1時間後

        if (isNaN(startDateTime.getTime())) {
          console.error('Invalid time:', line);
          continue;
        }

        currentEvent = {
          summary: summary.trim(),
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          }
        };

        // URLが続かない場合はここでイベントを追加
        if (lines.indexOf(line) === lines.length - 1 || 
            !lines[lines.indexOf(line) + 1].trim().startsWith('http')) {
          events.push(currentEvent as CalendarEvent);
          currentEvent = null;
        }
      } else if (detailedMatch) {
        // 詳細形式: "タイトル: YYYY/MM/DD HH:mm-HH:mm [場所]"
        const [, summary, yearStr, monthStr, dayStr, startTime, endTime, location] = detailedMatch;
        const year = yearStr ? parseInt(yearStr) : currentYear;
        const month = parseInt(monthStr);
        const day = parseInt(dayStr);

        if (month < 1 || month > 12 || day < 1 || day > 31) {
          console.error('Invalid date:', line);
          continue;
        }

        const startDateTime = new Date(`${year}/${month}/${day} ${startTime}`);
        const endDateTime = new Date(`${year}/${month}/${day} ${endTime}`);

        if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
          console.error('Invalid time:', line);
          continue;
        }

        if (endDateTime < startDateTime) {
          endDateTime.setDate(endDateTime.getDate() + 1);
        }

        events.push({
          summary: summary.trim(),
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: 'Asia/Tokyo',
          },
          ...(location && { location: location.trim() }),
        });
      } else if (trimmedLine && !currentEvent) {
        console.warn('Line does not match any format:', line);
      }
    } catch (error) {
      console.error('Error parsing line:', line, error);
    }
  }

  return events;
} 