import { extractEventInfo } from './openaiEventParser';
import { addEvent, CalendarEvent } from './googleCalendar';

export async function processEvents(eventTexts: string[], accessToken: string): Promise<void> {
  const results: { success: boolean; event: string; error?: string }[] = [];

  for (const eventText of eventTexts) {
    try {
      console.log('処理中のイベント:', eventText);
      
      // OpenAI APIを使用してイベント情報を抽出
      const eventInfo = await extractEventInfo(eventText);
      
      // Google Calendarにイベントを追加
      await addEvent(eventInfo, accessToken);
      
      results.push({
        success: true,
        event: eventText
      });
    } catch (error) {
      console.error('イベントの処理中にエラーが発生しました:', error);
      results.push({
        success: false,
        event: eventText,
        error: error instanceof Error ? error.message : '不明なエラー'
      });
    }
  }

  // 結果のサマリーを表示
  console.log('\n処理結果サマリー:');
  console.log(`成功: ${results.filter(r => r.success).length}件`);
  console.log(`失敗: ${results.filter(r => !r.success).length}件\n`);

  // エラーがあった場合は詳細を表示
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('失敗したイベント:');
    failures.forEach(f => {
      console.log(`- ${f.event}`);
      console.log(`  エラー: ${f.error}\n`);
    });
  }
} 