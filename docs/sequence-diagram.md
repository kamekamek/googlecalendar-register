
## 処理の説明

1. **イベントテキスト入力**
   - クライアントから複数イベントを含むテキストを受け取る
   - 例：複数の予定が空行で区切られたテキスト

2. **OpenAI APIによる情報抽出**
   - `OpenAIParser`が一度のAPIコールで全てのイベントを解析
   - 結果は`events`配列として返却される
   - 各イベントは日時、タイトル、説明などの情報を含む

3. **並列処理による登録**
   - `Promise.all`を使用して各イベントを並列で処理
   - 各イベントは個別にGoogle Calendar APIにリクエスト
   - エラーが発生しても他のイベントの処理は継続

4. **結果の集計**
   - 成功・失敗の件数をカウント
   - エラーが発生したイベントの詳細を記録
   - 最終的な処理結果をクライアントに返却

## コードの対応関係

1. **イベントの抽出（openaiEventParser.ts）**
```typescript
export async function extractEventInfo(userInput: string): Promise<CalendarEvent[]>
```
- 一度のAPIコールで複数イベントを抽出
- 結果を配列として返却

2. **並列処理（eventManager.ts）**
```typescript
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
```
- 各イベントを並列で処理
- エラーハンドリングを個別に実施

3. **Google Calendar API呼び出し（googleCalendar.ts）**
```typescript
export async function addEvent(event: CalendarEvent, accessToken: string)
```
- 個別のイベントをGoogle Calendarに登録
- アクセストークンを使用して認証 