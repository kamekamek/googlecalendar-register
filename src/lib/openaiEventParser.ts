import { OpenAI } from 'openai';
import { CalendarEvent } from './googleCalendar';
import { format, addHours, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIEventResponse {
  summary: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  all_day: boolean;
  timezone: string;
}

export async function extractEventInfo(userInput: string): Promise<CalendarEvent> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `あなたはイベントの日時情報を抽出するアシスタントです。
以下の形式でJSONを出力してください：
{
  "summary": "イベントのタイトル",
  "description": "イベントの説明（URLを含む）",
  "start_datetime": "開始日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
  "end_datetime": "終了日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
  "all_day": false,
  "timezone": "Asia/Tokyo"
}
- 時間指定がない場合は all_day を true にし、start_datetime と end_datetime は日付のみを指定
- 終了時刻が指定されていない場合は、開始時刻の1時間後を設定
- 年が指定されていない場合は、現在の年を使用
- タイムゾーンは特に指定がない限り Asia/Tokyo を使用`
        },
        {
          role: "user",
          content: userInput
        }
      ]
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('OpenAI APIからの応答が空です');
    }

    const eventInfo = JSON.parse(response) as OpenAIEventResponse;
    
    // CalendarEventフォーマットに変換
    const calendarEvent: CalendarEvent = {
      summary: eventInfo.summary,
      description: eventInfo.description,
      start: eventInfo.all_day
        ? {
            date: eventInfo.start_datetime.split('T')[0],
            timeZone: eventInfo.timezone
          }
        : {
            dateTime: eventInfo.start_datetime,
            timeZone: eventInfo.timezone
          },
      end: eventInfo.all_day
        ? {
            date: eventInfo.end_datetime.split('T')[0],
            timeZone: eventInfo.timezone
          }
        : {
            dateTime: eventInfo.end_datetime,
            timeZone: eventInfo.timezone
          }
    };

    return calendarEvent;
  } catch (error) {
    console.error('イベント情報の抽出に失敗しました:', error);
    throw error;
  }
} 