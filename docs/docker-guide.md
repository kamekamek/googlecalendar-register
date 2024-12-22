# Dockerについての基本ガイド

## Dockerとは？

Dockerは、アプリケーションを「コンテナ」と呼ばれる独立した環境で実行するためのツールです。
コンテナを使うことで、開発環境と本番環境の差異を減らし、「自分のPCでは動くのに本番環境で動かない」といった問題を防ぐことができます。

## なぜDockerを使うの？

1. 環境の統一
   - 全ての開発者が同じ環境で開発できる
   - 本番環境と開発環境の差異を減らせる

2. 簡単なセットアップ
   - `docker compose up`コマンド1つで環境構築が完了
   - Node.jsのバージョンやその他の設定を気にする必要がない

3. クリーンな環境
   - コンテナは独立した環境なので、PCの環境を汚さない
   - 不要になったら簡単に削除できる

## 必要なもの

1. Docker Desktop
   - [Dockerの公式サイト](https://www.docker.com/products/docker-desktop/)からダウンロード
   - インストール後、アプリケーションを起動

2. ターミナル
   - MacならTerminal.app
   - WindowsならPowerShellやコマンドプロンプト

## 主要なファイルの説明

### 1. Dockerfile
アプリケーションを実行するための「コンテナ」の設計図です。

```dockerfile
# 基本となるイメージを指定（Node.js v20の軽量版）
FROM node:20-slim

# 作業ディレクトリを設定
WORKDIR /app

# パッケージ情報をコピー
COPY package*.json ./

# 必要なパッケージをインストール
RUN npm install

# アプリケーションのファイルをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 使用するポートを指定
EXPOSE 3000

# アプリケーションの起動コマンド
CMD ["npm", "start"]
```

### 2. docker-compose.yml
複数のコンテナの設定や起動方法をまとめて管理するファイルです。

```yaml
version: '3.8'

services:
  # アプリケーションの設定
  app:
    # Dockerfileからイメージをビルド
    build: .
    # ポートの設定（ホスト:コンテナ）
    ports:
      - "3000:3000"
    # 環境変数の設定
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=http://localhost:3000
    # ファイルの共有設定
    volumes:
      - .env.local:/app/.env.local
    # コンテナの再起動設定
    restart: unless-stopped
```

## 基本的な使い方

### 1. アプリケーションの起動
```bash
# イメージのビルドとコンテナの起動を一度に行う
docker compose up -d

# ログを確認したい場合
docker compose logs -f
```

### 2. アプリケーションの停止
```bash
# コンテナを停止
docker compose down
```

### 3. コードを変更した場合
```bash
# イメージを再ビルドしてコンテナを起動
docker compose build
docker compose up -d
```

## よくあるエラーと解決方法

### 1. 「ポートが既に使用されています」というエラー
- 原因：他のアプリケーションが3000番ポートを使用している
- 解決方法：`docker-compose.yml`の`ports`を変更
  ```yaml
  ports:
    - "3001:3000"  # ホスト側のポートを3001に変更
  ```

### 2. 環境変数が読み込まれない
- 原因：`.env.local`ファイルが正しく配置されていない
- 確認方法：
  1. `.env.local`ファイルがプロジェクトのルートディレクトリにあるか確認
  2. ファイルの中身が正しいか確認
  3. `docker compose down`してから`docker compose up -d`で再起動

### 3. ビルドが失敗する
- 原因：キャッシュの問題や依存関係の不整合
- 解決方法：
  ```bash
  # キャッシュを使わずに完全な再ビルド
  docker compose build --no-cache
  docker compose up -d
  ```

## 便利なDockerコマンド

```bash
# 実行中のコンテナを確認
docker ps

# コンテナのログを確認
docker compose logs -f

# コンテナ内でコマンドを実行（例：npm install）
docker compose exec app npm install

# 全てのコンテナとイメージを削除（注意：全ての Docker データが削除されます）
docker system prune -a
```

## 学習リソース

1. [Docker公式ドキュメント（日本語）](https://docs.docker.jp/)
2. [Docker入門（基礎編）](https://docs.docker.jp/get-started/index.html)
3. [Play with Docker](https://labs.play-with-docker.com/)（ブラウザで Docker を試せるサイト）