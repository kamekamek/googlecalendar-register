import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { parseEvents } from '@/lib/eventParser';
import { addEvent } from '@/lib/googleCalendar';

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token?.accessToken) {
      return NextResponse.json(
        { error: '認証が必要です。' },
        { status: 401 }
      );
    }

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'テキストが入力されていません。' },
        { status: 400 }
      );
    }

    const events = parseEvents(text);

    if (events.length === 0) {
      return NextResponse.json(
        { error: '有効なイベントが見つかりませんでした。' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      events.map(async (event) => {
        try {
          const result = await addEvent(event, token.accessToken as string);
          return { success: true, eventId: result.id };
        } catch (error) {
          console.error('Error adding event:', error);
          return { success: false, error: 'イベントの登録に失敗しました。' };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    if (failureCount > 0) {
      return NextResponse.json(
        {
          events: results,
          message: `${successCount}件のイベントを登録しました。${failureCount}件の登録に失敗しました。`,
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      events: results,
      message: `${successCount}件のイベントを登録しました。`,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
} 