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

## ライセンス

MIT License
