# Google Calendar API設定ガイド

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 画面上部のプロジェクト選択メニューをクリック
3. 「新しいプロジェクト」をクリック
4. プロジェクト名を入力（例：`calendar-bulk-register`）
5. 「作成」をクリック

### 1.2 Google Calendar APIの有効化
1. 左側のメニューから「APIとサービス」→「ライブラリ」を選択
2. 検索バーで「Google Calendar API」を検索
3. Google Calendar APIを選択し、「有効にする」をクリック

### 1.3 OAuth同意画面の設定
1. 左側のメニューから「APIとサービス」→「OAuth同意画面」を選択
2. User Typeで「外部」を選択し、「作成」をクリック
3. アプリ情報を入力：
   - アプリ名：`カレンダー一括登録`
   - ユーザーサポートメール：自分のメールアドレス
   - デベロッパーの連絡先情報：自分のメールアドレス
4. 「保存して次へ」をクリック
5. スコープ���設定：
   - 「スコープを追加または削除」をクリック
   - `https://www.googleapis.com/auth/calendar.events`を追加
6. テストユーザーの追加：
   - 自分のGoogleアカウントのメールアドレスを追加

### 1.4 認証情報の作成
1. 左側のメニューから「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「OAuthクライアントID」をクリック
3. アプリケーションの種類：「ウェブアプリケーション」を選択
4. 名前を入力（例：`Calendar Bulk Register Web Client`）
5. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`
6. 「作成」をクリック
7. 表示されるクライアントIDとクライアントシークレットを保存

## 2. 環境変数の設定

1. NEXTAUTH_SECRETの生成：
   ```bash
   # ターミナルで以下のコマンドを実行し、出力された文字列をコピー
   openssl rand -base64 32
   ```

2. プロジェクトルートの`.env.local`ファイルを以下のように設定：
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=生成した文字列をここに貼り付け # opensslコマンドで生成した値

# Google OAuth credentials
GOOGLE_CLIENT_ID=your-client-id # 上記で取得した値に置き換え
GOOGLE_CLIENT_SECRET=your-client-secret # 上記で取得した値に置き換え
```

## 3. アプリケーションの起動と動作確認

1. 開発サーバーの起動：
```bash
npm run dev
```

2. ブラウザで動作確認：
   - `http://localhost:3000`にアクセス
   - 「Googleアカウントでログイン」をクリック
   - 認証を行い、アクセスを許可
   - テキストエリアにイベント情報を入力（例：`会議: 2024/01/08 13:00-14:00 [会議室A]`）
   - 「登録する」ボタンをクリック
   - Googleカレンダーで登録されたイベントを確認