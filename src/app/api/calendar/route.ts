import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { extractEventInfo } from '@/lib/openaiEventParser';
import { addEvents } from '@/lib/googleCalendar';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Debug: Getting token from request...');
    const token = await getToken({ req: request });
    
    console.log('Debug: Token received:', token ? 'Token exists' : 'No token');
    if (!token?.accessToken) {
      console.log('Debug: No access token found in token object');
      return NextResponse.json(
        { error: '認証が必要です。' },
        { status: 401 }
      );
    }
    
    if (token.error === 'RefreshAccessTokenError') {
      console.log('Debug: Refresh token error detected');
      return NextResponse.json(
        { error: '認証の有効期限が切れました。再度ログインしてください。' },
        { status: 401 }
      );
    }
    
    console.log('Debug: Access token found:', token.accessToken.substring(0, 10) + '...');

    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'テキストが入力されていません。' },
        { status: 400 }
      );
    }

    console.log('Debug: Extracting event info from text...');
    const events = await extractEventInfo(text);

    if (events.length === 0) {
      return NextResponse.json(
        { error: '有効なイベントが見つかりませんでした。' },
        { status: 400 }
      );
    }

    console.log(`Debug: Found ${events.length} events, attempting to add them...`);
    const results = await addEvents(events, token.accessToken as string);

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    console.log(`Debug: Added ${successCount} out of ${events.length} events successfully`);

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
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '不明なエラー' },
      { status: 500 }
    );
  }
}  