# LINEBot Irukara

chatgpt, stable diffusionが使用できるLINEbot
※リポジトリを移動しました

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

### デプロイ
デプロイはCICDを設定していません。
serverless frameworkで手動デプロイになります。(のちのち修正予定)

### テスト

```
# postmanなど
http://localhost:6000/dev/linebot
or
curl http://localhost:6000/dev/linebot
```
