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