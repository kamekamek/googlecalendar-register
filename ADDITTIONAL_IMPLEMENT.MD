あなたはTypeScriptプログラミングの専門家です。OpenAI APIとGoogle Calendar APIを使用して、ユーザーのテキスト入力から予定を作成するTypeScriptスクリプトを作成してください。

**機能要件:**

1. **ユーザー入力の例:**

    ```
    12/31 usutakuと一緒に年越ししよう会　@広尾バー
    https://lu.ma/2nxlavae

    1/9 バーまだ来たことない方向け！木曜会限定でバー集まる会
    https://lu.ma/jkpwszj1

    1/12(日) 18:00〜20:00 河瀬会←更新New!!!
    https://lu.ma/xc3p2mog

    1/25(土) モルック会
    https://fincs.jp/plan/6883693537748780257?tab=talk&room=3679&talk=181943
    ※詳細は部活チャット参照

    1/26(日) 18:00〜20:00 河瀬会←更新New!!!
    https://lu.ma/k5q77tnm
    ※31日平日で来れない人向けに少し勉強会要素足します

    1/31(金) 20:00〜22:00 今月のAIニュース振り返り会
    https://lu.ma/1sn3u146
    ```

2. **OpenAI APIによる情報抽出:**
    *   OpenAI API (例えば `gpt-3.5-turbo-1106` モデル) を使用して、ユーザーの入力から以下の情報をJSON形式で抽出してください。
    *   `response_format={ "type": "json_object" }`を使い、JSON形式で出力させてください。

    ```json
    {
      "summary": "予定のタイトル",
      "description": "予定の説明（URLを含む）",
      "start_datetime": "開始日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
      "end_datetime": "終了日時（YYYY-MM-DDTHH:MM:SS+09:00形式）",
      "all_day": false,
      "timezone": "Asia/Tokyo"
    }
    ```

    *   時間指定がない場合は、`all_day` を `true` に設定してください。
    *   終了時刻が指定されていない場合は、開始時刻の1時間後を終了時刻としてください。
    *   `start_datetime` と `end_datetime` は、RFC3339形式 (例: `2023-12-31T18:00:00+09:00`) で指定してください。
    *   タイムゾーンが明示的に指定されていない限り、タイムゾーンオフセット `+09:00` を使用してください。

3. **Google Calendar APIによる予定作成:**
    *   抽出した情報を使用して、Google Calendar APIに予定を作成するリクエストを送信してください。
    *   Google Calendar APIの認証情報の設定と認証処理を含めてください。
    *   認証情報の設定方法は、Google Calendar APIのドキュメントを参照するように指示してください。
    *   `google-api-nodejs-client` ライブラリを使用してください。
    *   `calendarId='primary'` を使用して、プライマリカレンダーに予定を作成してください。
    *   終日の予定の場合は、`start` と `end` のキーを `date` に変更し、日付のみを指定してください（例：`"start": {"date": "2024-01-25"}`）。

4. **必要なライブラリ:**
   *   `openai` (OpenAI公式のNode.jsライブラリ `@openai/api` ではないため、[参考ドキュメント](https://www.npmjs.com/package/openai)を確認し、バージョン等を確認すること)
    *   `googleapis`
    *   `date-fns` (日付操作用)
    *   `date-fns-tz` (タイムゾーン操作用)

    これらのライブラリは、`npm` または `yarn` を使ってインストールするように指示してください。

5. **エラーハンドリング:**
    *   例外処理を行い、エラーが発生した場合は適切なメッセージをコンソールに出力してください。

6. **コードの構成:**
    *   `extractCalendarInfo(userInput: string): Promise<object>` 関数: ユーザー入力から情報を抽出する。
    *   `createCalendarEvent(eventData: any): Promise<void>` 関数: Google Calendar APIに予定を作成する。
    *   `main(): Promise<void>` 関数: ユーザー入力を受け取り、予定を作成するメイン関数。

7. **その他:**
    *   コードは簡潔で読みやすく、コメントを適切に記述してください。
    *   APIキーや認証情報は、コード内にハードコーディングしないでください。環境変数などを使用することを検討してください。
    *  型定義を適切に行ってください。

**最後に、以下のTypeScriptコードの骨格を参考（ベース）に使うように指示してください。**

```typescript
import { google } from 'googleapis';
import { format, addHours, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { OpenAI } from 'openai';

// TODO: OpenAI APIキーを設定
const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY"
});

// TODO: Google Calendar APIの認証情報を設定
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'YOUR_REDIRECT_URL'
);

// TODO: 事前に認証を行い、取得したトークンをセット
// oauth2Client.setCredentials({
//   access_token: 'YOUR_ACCESS_TOKEN',
//   refresh_token: 'YOUR_REFRESH_TOKEN'
// });

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

async function extractCalendarInfo(userInput: string): Promise<object> {
  /**
   * OpenAI APIを使用して、ユーザー入力からカレンダー情報を抽出する関数。
   */
  // TODO: OpenAI APIを使用して情報を抽出する処理を実装
  return {};
}

async function createCalendarEvent(eventData: any): Promise<void> {
  /**
   * Google Calendar APIを使用して予定を作成する関数。
   */
  // TODO: Google Calendar APIに予定を作成する処理を実装
}

async function main(): Promise<void> {
  /**
   * メイン関数。ユーザー入力を受け取り、予定を作成する。
   */
  const userInputs = [
    "12/31 usutakuと一緒に年越ししよう会　@広尾バー\nhttps://lu.ma/2nxlavae",
    "1/9 バーまだ来たことない方向け！木曜会限定でバー集まる会\nhttps://lu.ma/jkpwszj1",
    "1/12(日) 18:00〜20:00 河瀬会←更新New!!!\nhttps://lu.ma/xc3p2mog",
    "1/25(土) モルック会\nhttps://fincs.jp/plan/6883693537748780257?tab=talk&room=3679&talk=181943\n※詳細は部活チャット参照",
    "1/26(日) 18:00〜20:00 河瀬会←更新New!!!\nhttps://lu.ma/k5q77tnm\n※31日平日で来れない人向けに少し勉強会要素足します",
    "1/31(金) 20:00〜22:00 今月のAIニュース振り返り会\nhttps://lu.ma/1sn3u146"
  ];

  for (const userInput of userInputs) {
    // TODO: 予定を作成する処理を実装
  }
}

main();