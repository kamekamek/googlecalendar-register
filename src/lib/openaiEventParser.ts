import { OpenAI } from 'openai';
import { CalendarEvent } from './googleCalendar';
import { format, addHours, parseISO } from 'date-fns';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIEventResponse {
  events: {
    summary: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    all_day: boolean;
    timezone: string;
  }[];
}

export async function extractEventInfo(userInput: string): Promise<CalendarEvent[]> {
  try {
    const currentYear = new Date().getFullYear();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `あなたはイベントの日時情報を抽出する日本語特化型アシスタントです。
複数の予定が含まれる入力を解析し、JSONを出力してください。

入力例：
"""
12/25 私と一緒に年越ししよう会　@忘年会
https://example.com

1/12(日) 18:00〜20:00 飲み会←更新New!!!
https://example.com

1/25(土) 野球観戦
https://example.com
"""

出力形式：
{
  "events": [
    {
      "summary": "イベントのタイトル（場所の情報も含める）",
      "description": "イベントの説明（URLや補足情報を含む）",
      "start_datetime": "開始日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
      "end_datetime": "終了日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
      "all_day": false,
      "timezone": "Asia/Tokyo"
    }
  ]
}

ルール：
1. 時間指定がない場合：
   - all_day を true に設定
   - start_datetime は "YYYY-MM-DD" 形式で日付のみ指定
   - end_datetime も同じ日付を指定

2. 時間指定がある場合：
   - "HH:mm〜HH:mm" や "HH:mm-HH:mm" の形式を認識
   - 終了時刻が指定されていない場合は、開始時刻の2時間後を設定
   - 日時は "YYYY-MM-DDTHH:mm:00+09:00" 形式で出力

3. 年の処理：
   - 年が指定されていない場合は ${currentYear} を使用
   - 12月の予定で現在が1月の場合は前年を使用
   - 1月の予定で現在が12月の場合は翌年を使用

4. タイトルと説明：
   - summary には場所の情報（@xxx や 場所：xxx）も含める
   - description には URL や補足情報（※で始まる行など）を含める
   - "New!!!" や "更新" などの記号は description に移動
   - 予定の後に続くURLは、その予定のdescriptionに含める

5. タイムゾーン：
   - 特に指定がない限り "Asia/Tokyo" を使用

6. 複数予定の区切り：
   - 空行で区切られた予定を別々の予定として認識
   - URLや補足情報（※で始まる行）は、直前の予定に関連付ける`
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
    return eventInfo.events.map(event => ({
      summary: event.summary,
      description: event.description,
      start: event.all_day
        ? {
            date: event.start_datetime.split('T')[0],
            timeZone: event.timezone
          }
        : {
            dateTime: event.start_datetime,
            timeZone: event.timezone
          },
      end: event.all_day
        ? {
            date: event.end_datetime.split('T')[0],
            timeZone: event.timezone
          }
        : {
            dateTime: event.end_datetime,
            timeZone: event.timezone
          }
    }));
  } catch (error) {
    console.error('イベント情報の抽出に失敗しました:', error);
    throw error;
  }
} 