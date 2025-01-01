# Google Calendar 一括登録アプリケーション

## 技術スタック

### フロントエンド
- Next.js 14
- TypeScript 5.x
- TailwindCSS
- React Icons
- NextAuth.js（認証）

### バックエンド
- Next.js API Routes
- OpenAI API (GPT-3.5-turbo)
- Google Calendar API
- NextAuth.js（セッション管理）

### インフラ・開発環境
- Docker
- Docker Compose
- Vercel（デプロイ）
- ESLint（コード品質）
- Prettier（コードフォーマット）

### 主要なライブラリ
- date-fns（日付処理）
- axios（APIリクエスト）
- googleapis（Google API SDK）

## 概要
複数の予定をテキスト形式で入力し、Google Calendarに一括で登録できるアプリケーションです。
OpenAI APIを使用して柔軟なテキスト解析を行い、様々な形式の予定入力に対応しています。

## 機能
- 複数予定の一括登録
- 柔軟なテキスト形式の解析
- Google認証による安全な連携
- 並列処理による高速な登録
- エラーハンドリングとステータス表示

## 入力例

以下のような形式のテキストを入力できます：

```
1/15(月) 19:00〜21:00 新年会＠渋谷
https://example.com/event1
※会費：5000円

1/20 スキー旅行 @野沢温泉スキー場
https://example.com/event2
※集合：新宿駅8:00
※持ち物：防寒具、着替え

2/1(木) 13:00-15:00 四半期進捗報告会
https://example.com/event3
※資料は前日までに共有をお願いします

2/14 バレンタインパーティー @六本木
https://example.com/event4
※プレゼント交換あり（予算3000円）
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

### Dockerを使用したセットアップ

Dockerを使用してアプリケーションを実行する場合は、[Dockerガイド](docs/docker-guide.md)を参照してください。

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
