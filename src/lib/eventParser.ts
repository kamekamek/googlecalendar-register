import { parseISO, addHours, format } from 'date-fns';
import { ja } from 'date-fns/locale';

export interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
}

export function parseEvents(text: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 日付と時刻のパターン: "1/8 20:00-" または "1/8 20:00-21:00"
    const dateTimePattern = /(\d+)\/(\d+)\s+(\d+):(\d+)(?:-(\d+):(\d+))?/;
    const match = line.match(dateTimePattern);
    
    if (match) {
      const [_, month, day, startHour, startMinute, endHour, endMinute] = match;
      const currentYear = new Date().getFullYear();
      
      // 開始時刻の作成
      const startDateTime = new Date(currentYear, parseInt(month) - 1, parseInt(day), parseInt(startHour), parseInt(startMinute));
      
      // 終了時刻の作成（指定がない場合は1時間後）
      let endDateTime;
      if (endHour && endMinute) {
        endDateTime = new Date(currentYear, parseInt(month) - 1, parseInt(day), parseInt(endHour), parseInt(endMinute));
      } else {
        endDateTime = addHours(startDateTime, 1);
      }
      
      // タイトルの抽出（時刻の後ろの部分）
      const titlePart = line.replace(dateTimePattern, '').trim();
      
      // URLの取得（次の行がURLの場合）
      let description = '';
      if (i + 1 < lines.length && lines[i + 1].startsWith('http')) {
        description = lines[i + 1];
        i++; // URLの行をスキップ
      }
      
      events.push({
        summary: titlePart,
        description,
        start: {
          dateTime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ssxxx", { locale: ja })
        },
        end: {
          dateTime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ssxxx", { locale: ja })
        }
      });
    }
  }
  
  return events;
} 