# Googleカレンダー一括登録アプリケーション

テキストからイベントを解析し、Googleカレンダーに一括登録するWebアプリケーションです。

## 機能

- Googleアカウントでのログイン認証
- テキストからのイベント情報の解析
- Googleカレンダーへの一括登録
- 登録結果の表示とエラーハンドリング

## 技術スタック

- Next.js 14
- TypeScript
- NextAuth.js
- Google Calendar API
- Tailwind CSS

## セットアップ

1. 依存関係のインストール：
```bash
npm install
```

2. Google Cloud Consoleでの設定：
- [セットアップガイド](docs/setup-guide.md)を参照してください。

3. 環境変数の設定：
- `.env.local`ファイルを作成し、必要な環境変数を設定
- 詳細は[セットアップガイド](docs/setup-guide.md)を参照

4. 開発サーバーの起動：
```bash
npm run dev
```

## 使用方法

1. アプリケーションにアクセス（デフォルト：http://localhost:3000）
2. Googleアカウントでログイン
3. テキストエリアにイベント情報を入力
   ```
   会議: 2024/01/08 13:00-14:00 [会議室A]
   打ち合わせ: 2024/01/09 15:00-16:30 [オンライン]
   ```
4. 「登録する」ボタンをクリック
5. Googleカレンダーで登録されたイベントを確認

## Vercelへのデプロイ手順

1. Vercelアカウントの作成：
   - [Vercel](https://vercel.com)にアクセスし、アカウントを作成（GitHubアカウントでの登録推奨）

2. プロジェクトのデプロイ：
   - Vercelダッシュボードから「New Project」をクリック
   - GitHubリポジトリを連携し、対象のリポジトリを選択
   - 「Import」をクリック

3. 環境変数の設定：
   - デプロイ設定画面で「Environment Variables」セクションを開く
   - `.env.local`と同じ環境変数を設定
   - 以下の変数を必ず設定：
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`（デプロイ後のドメインを設定）

4. デプロイの実行：
   - 「Deploy」ボタンをクリック
   - デプロイ完了後、割り当てられたドメインでアプリケーションにアクセス可能

5. Google Cloud Consoleの設定更新：
   - OAuth 2.0クライアントIDの承認済みリダイレクトURIに
   - `https://あなたのドメイン/api/auth/callback/google`を追加

## 本番環境での注意事項

1. Google Cloud Console設定：
   - デフォルトでは「テストモード」となっており、テストユーザー数が100人に制限されています
   - 一般公開する場合は「本番環境」に設定する必要があります
   - 本番環境への移行には、Googleによる審査が必要となる場合があります

2. APIスコープと利用規約：
   - 本アプリケーションは Calendar API のスコープ（https://www.googleapis.com/auth/calendar.events）を使用しています
   - 本番環境では、このスコープの使用目的と利用規約を明示的にユーザーに提示する必要があります
   - プライバシーポリシーやデータの使用目的を明確に記載することが推奨されます

## ライセンス

MIT License
