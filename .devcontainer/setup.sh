#!/bin/bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Setting up Trip App Dev Container..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

WORKDIR="/workspaces/trip-app"
FUNC_DIR="$WORKDIR/supabase/functions/api"

echo ""
echo "1) Update package list"
sudo apt-get update

echo ""
echo "2) Install additional tools"
# jq: JSON確認用
# postgresql-client: psql（DB接続確認用）
sudo apt-get install -y jq postgresql-client

echo ""
echo "3) Setup Deno cache directory"
export DENO_DIR=$HOME/.deno_cache
mkdir -p $DENO_DIR
echo 'export DENO_DIR=$HOME/.deno_cache' >> ~/.bashrc

echo ""
echo "4) Setup Supabase CLI PATH"
echo 'export PATH="$HOME/.supabase/bin:$PATH"' >> ~/.bashrc

echo ""
echo "5) Check installed versions"
deno --version
echo ""
node --version
pnpm --version
echo ""
which supabase && supabase --version || echo "Supabase CLI: manual installation needed"
echo ""
psql --version
jq --version

echo ""
echo "6) Cache Deno dependencies"
if [ -f "$FUNC_DIR/index.ts" ]; then
  cd "$FUNC_DIR"
  if [ -f "deno.json" ]; then
    deno cache --config deno.json index.ts
  else
    deno cache index.ts
  fi
  echo "✓ Deno dependencies cached"
else
  echo "Skip: $FUNC_DIR/index.ts not found"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Dev Container setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Supabase: Cloud（ローカル起動なし）"
echo "🦕 Deno Backend: このコンテナ内で起動"
echo "📱 Frontend: ホスト側で起動"
echo ""
echo "🚀 バックエンド起動（コンテナ内）:"
echo "  cd supabase/functions/api"
echo "  deno run --allow-net --allow-env --allow-read index.ts"
echo ""
echo "📱 フロント起動（ホスト側の PowerShell で）:"
echo "  cd C:\\Users\\binbi\\trip-app"
echo "  pnpm dev:mobile"
echo ""
echo "📝 Note: Supabase CLI が見つからない場合は以下を実行:"
echo "  curl -L https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz -o supabase.tar.gz"
echo "  tar -xzf supabase.tar.gz && mkdir -p ~/.supabase/bin"
echo "  mv supabase ~/.supabase/bin/ && chmod +x ~/.supabase/bin/supabase"
echo "  rm supabase.tar.gz"
echo ""
