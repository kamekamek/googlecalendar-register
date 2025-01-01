import { extractEventInfo } from './openaiEventParser';
import { addEvent, CalendarEvent } from './googleCalendar';

export async function processEvents(eventText: string, accessToken: string): Promise<void> {
  try {
    console.log('イベントテキストの処理を開始します');
    
    // OpenAI APIを使用してイベント情報を抽出（複数イベントに対応）
    const events = await extractEventInfo(eventText);
    
    console.log(`${events.length}件のイベントを検出しました`);

    // 各イベントを順次処理
    const results = await Promise.all(
      events.map(async (event) => {
        try {
          await addEvent(event, accessToken);
          return { success: true, event: event.summary };
        } catch (error) {
          return {
            success: false,
            event: event.summary,
            error: error instanceof Error ? error.message : '不明なエラー'
          };
        }
      })
    );

    // 処理結果のサマリーを表示
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log('\n処理結果サマリー:');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${failureCount}件\n`);

    // エラーがあった場合は詳細を表示
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.log('失敗したイベント:');
      failures.forEach(f => {
        console.log(`- ${f.event}`);
        console.log(`  エラー: ${f.error}\n`);
      });
    }
  } catch (error) {
    console.error('イベント処理中にエラーが発生しました:', error);
    throw error;
  }
} 