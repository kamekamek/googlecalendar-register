# Docker設定ガイド

## 前提条件

- Docker Desktop がインストールされていること
- Docker Compose がインストールされていること

## ファイル構成

### Dockerfile

```dockerfile
FROM node:20-slim

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# ポートを公開
EXPOSE 3000

# 起動コマンド
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=http://localhost:3000
    volumes:
      - .env.local:/app/.env.local
    restart: unless-stopped
```

### .dockerignore

```plaintext
# バージョン管理
.git
.gitignore

# 依存関係
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# ビルド
.next
out
build

# 環境変数
.env*
!.env.example

# その他
.DS_Store
README.md
*.pem
.vscode
.idea
```

## 使用方法

1. イメージのビルドとコンテナの起動：
```bash
# イメージをビルドしてコンテナを起動（バックグラウンド実行）
docker compose up -d

# ログの確認
docker compose logs -f
```

2. コンテナの停止：
```bash
docker compose down
```

3. イメージの再ビルド（ソースコードを変更した場合）：
```bash
docker compose build
docker compose up -d
```

## 環境変数の設定

1. `.env.local`ファイルをプロジェクトルートに作成
2. 必要な環境変数を設定（[セットアップガイド](setup-guide.md)を参照）
3. `docker-compose.yml`のvolumesセクションで`.env.local`がマウントされていることを確認

## トラブルシューティング

1. ポートの競合が発生する場合：
   - `docker-compose.yml`の`ports`セクションで別のポートを指定
   - 例：`"3001:3000"`（ホストの3001番ポートをコンテナの3000番ポートにマッピング）

2. 環境変数が読み込まれない場合：
   - `.env.local`ファイルが正しい場所にあることを確認
   - ファイルのパーミッションを確認
   - `docker compose down`してから`docker compose up -d`で再起動

3. ビルドエラーが発生する場合：
   - `docker compose build --no-cache`で完全な再ビルドを試す
   - `node_modules`を削除して再ビルド 