# LINEBot Irukara

Lambda と APIGateway で Nest.js を動かしています。

有料プランは下記を参照
https://www.notion.so/369a88cf3862432291ed630b59c5755f

<br>

### 必要なもの

-   serverless framework
-   cfn-lint(https://qiita.com/5hintaro/items/40fd4d73d146aaaf4636)
-   nest-cli
-   volta

<br>

### 環境構築

先に npm install して、Node のバージョンを合わせてください

```
npm install
npm buildoff
```

npm buildoff でビルドと serverless offline が立ち上がります。

<br>

### テスト

```
# postmanなど
http://localhost:6000/dev/linebot
or
curl http://localhost:6000/dev/linebot
```

<br>

### serverless deploy

デプロイ前に Lint を走らせてください

```
npm run cfn-lint
```
