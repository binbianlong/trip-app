# クイックスタートガイド

## 🎯 このガイドの目的

Supabase + Edge Functions (Hono) +
モバイルアプリを使った開発の基本的な流れを学びます。

## 📝 ステップ

### 1. 環境のセットアップ

```bash
# 依存関係をインストール
pnpm install

# Supabaseローカル環境を起動
pnpm supabase:start
```

起動後に表示される情報をメモしてください：

- API URL: `http://127.0.0.1:54321`
- Studio URL: `http://127.0.0.1:54323`
- anon key: （表示される長いトークン）

### 2. データベースの準備

マイグレーションが自動的に適用されます。Supabase Studioで確認：

```bash
# ブラウザでStudioを開く
open http://127.0.0.1:54323
```

### 3. テストユーザーの作成

Supabase Studioから：

1. Authentication → Users をクリック
2. "Add user" → "Create new user" を選択
3. メールとパスワードを入力して作成

または、モバイルアプリから直接サインアップすることもできます。

### 4. Edge Functionsの起動

```bash
# 別のターミナルで
pnpm dev:api
```

APIが起動したら、テスト：

```bash
# ヘルスチェック
curl http://127.0.0.1:54321/functions/v1/api/health
```

### 5. モバイルアプリの起動

```bash
# さらに別のターミナルで
pnpm dev:mobile
```

Expoの開発サーバーが起動します。QRコードをスキャンしてアプリを開きます。

## 💻 開発ワークフロー

### データベーススキーマの変更

1. 新しいマイグレーションを作成：

```bash
pnpm migration:new add_field_to_trips
```

2. `supabase/migrations/` に生成されたファイルを編集：

```sql
-- Example: Add a new field
ALTER TABLE public.trips ADD COLUMN budget integer;
```

3. マイグレーションを適用：

```bash
pnpm db:reset  # ローカル環境をリセット
```

### Edge Functionの開発

1. `supabase/functions/api/index.ts` を編集

2. 自動的にホットリロードされます（`pnpm dev:api`実行中）

3. curlでテスト：

```bash
# 認証トークンを取得（Supabase Studioから、またはログイン後）
TOKEN="your-access-token"

# APIをテスト
curl http://127.0.0.1:54321/functions/v1/api/api/trips \
  -H "Authorization: Bearer $TOKEN"
```

### モバイルアプリの開発

1. `apps/mobile/` 配下のファイルを編集

2. Expoが自動的にリロード

3. APIクライアントの使用例：

```typescript
import { tripApi } from "@/lib/api";
import { supabase } from "@/lib/supabase";

// 認証
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// APIを呼び出し
const { trips } = await tripApi.getTrips();
console.log(trips);
```

## 🧪 テストシナリオ

### シナリオ1: 旅行を作成

1. モバイルアプリでログイン
2. 新しい旅行を作成
3. Supabase Studioでデータベースを確認

```typescript
const { trip } = await tripApi.createTrip({
  title: "週末旅行",
  description: "温泉でリラックス",
  startDate: "2026-03-15",
  endDate: "2026-03-17",
  destination: "箱根",
});
```

### シナリオ2: 旅行を一覧表示

```typescript
const { trips } = await tripApi.getTrips();
// 自分の旅行のみが返される（RLS適用）
```

### シナリオ3: 旅行を更新

```typescript
await tripApi.updateTrip(tripId, {
  title: "更新されたタイトル",
  description: "新しい説明",
});
```

### シナリオ4: 旅行を削除

```typescript
await tripApi.deleteTrip(tripId);
```

## 🔍 デバッグ

### Edge Functionsのログ

```bash
# 詳細なログで起動
pnpm supabase functions serve api --debug
```

### モバイルアプリのログ

Expo開発サーバーのコンソールに表示されます。

### データベースクエリ

Supabase Studio → SQL Editor で直接SQLを実行できます。

## 🚀 次のステップ

1. **認証画面の実装**: ログイン/サインアップUIを作成
2. **リアルタイム機能**: Supabase Realtimeで変更を購読
3. **ストレージ**: 画像アップロード機能を追加
4. **プッシュ通知**: Expo Notificationsを統合
5. **本番環境へのデプロイ**: Supabaseプロジェクトを作成してデプロイ

## 📚 追加リソース

- [Supabase Documentation](https://supabase.com/docs)
- [Hono Documentation](https://hono.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ トラブルシューティング

### Supabaseが起動しない

```bash
pnpm supabase stop
pnpm supabase start
```

### モバイルアプリがAPIに接続できない

1. `.env`ファイルを確認
2. Supabaseが起動しているか確認
3. ネットワーク設定を確認（特にAndroidエミュレーター）

### マイグレーションエラー

```bash
# データベースを完全にリセット
pnpm supabase db reset
```
