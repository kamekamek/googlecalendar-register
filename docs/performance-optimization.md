# パフォーマンス最適化ガイド

## 概要
このドキュメントでは、Google Calendar APIとOpenAI APIを使用したイベント登録システムのパフォーマンス最適化について説明します。

## 課題
1. Vercelのサーバーレス関数の制限
   - 実行時間が10秒に制限されている
   - 処理時間が約20秒かかっていた
   - HTTP 504（Gateway Timeout）エラーが発生

2. 処理のボトルネック
   - OpenAI APIの呼び出し時間
   - 複数イベントの逐次処理
   - Google Calendar APIへの登録処理

## 最適化戦略

### 1. OpenAI APIの並列処理
```typescript
// テキストを複数の塊に分割
function splitTextIntoChunks(text: string): string[] {
  const chunks = [];
  // 4イベントごと、または空行で分割
  // 日付パターン（例：2/1）を含む行をイベントとしてカウント
}

// 並列処理の実装
const chunkPromises = chunks.map(chunk => extractEventsFromChunk(chunk));
const chunkResults = await Promise.all(chunkPromises);
```

**効果**:
- 12個のイベントの場合：
  - 最適化前：1回のAPI呼び出しで約20秒
  - 最適化後：3回の並行API呼び出し（4イベントずつ）で約7-8秒

### 2. Google Calendar APIの最適化
```typescript
// カレンダークライアントの初期化を1回に
function initializeCalendarClient(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// 複数イベントの一括登録
export async function addEvents(events: CalendarEvent[], accessToken: string) {
  const calendar = initializeCalendarClient(accessToken);
  const promises = events.map(event => 
    calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    })
  );
  return Promise.all(promises);
}
```

**効果**:
- クライアント初期化のオーバーヘッド削減
- イベント登録の並列処理化

## 実装のポイント

1. **チャンクサイズの最適化**
   - 4イベントごとに分割
   - 空行による自然な区切りも考慮
   - バランスの取れた並列処理を実現

2. **エラーハンドリング**
   - 各チャンクの処理は独立して実行
   - エラーが発生しても他のチャンクの処理は継続
   - 結果は成功・失敗を含めて適切に集約

3. **デバッグとモニタリング**
   ```typescript
   console.log(`Debug: Split text into ${chunks.length} chunks`);
   console.log(`Debug: Extracted ${allEvents.length} events in total`);
   ```

## 追加の最適化オプション

1. **バッチ処理の導入**
   - イベント数が多い場合は、さらに小さなバッチに分割
   - 各バッチを順次処理

2. **Vercelの設定調整**
   ```json
   {
     "functions": {
       "api/calendar/*.js": {
         "maxDuration": 30
       }
     }
   }
   ```

3. **キャッシュの導入**
   - 頻繁に使用されるクライアントインスタンスのキャッシュ
   - トークン情報の適切なキャッシュ

## パフォーマンスモニタリング

1. **実行時間の計測**
   - OpenAI APIの処理時間
   - Google Calendar APIの処理時間
   - 全体の処理時間

2. **エラーレートの監視**
   - タイムアウトの発生頻度
   - API呼び出しの失敗率

## 注意点

1. **APIレート制限**
   - OpenAI APIの利用制限
   - Google Calendar APIの制限
   - 適切なエラーハンドリングの実装

2. **コスト考慮**
   - 並列処理による API 呼び出し回数の増加
   - 適切なバランスの検討

## 今後の改善案

1. **アダプティブチャンクサイズ**
   - イベント数に応じて動的にチャンクサイズを調整
   - 処理時間の最適化

2. **キューイングシステム**
   - 大量のイベントを処理する場合のキュー導入
   - バックグラウンド処理の実装 