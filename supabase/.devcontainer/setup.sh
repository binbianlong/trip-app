set -e

echo "Setting up devcontainer (functions tools only)..."

WORKDIR="/workspaces/trip-app"
FUNC_DIR="$WORKDIR/supabase/functions/api"

echo "1) Update package list"
sudo apt-get update

echo "2) Install tools"
# jq: JSON確認用
# postgresql-client: psql（DB接続確認用）
sudo apt-get install -y jq postgresql-client

echo "3) Check installed versions"
deno --version
psql --version
jq --version

echo "4) Optional: cache Deno dependencies (if function exists)"
if [ -f "$FUNC_DIR/index.ts" ]; then
  cd "$FUNC_DIR"

  # deno.json があるなら設定として使う（import mapではなくconfigとして扱う）
  if [ -f "deno.json" ]; then
    deno cache --config deno.json index.ts
  else
    deno cache index.ts
  fi
else
  echo "Skip: $FUNC_DIR/index.ts not found"
fi

echo ""
echo "Done."
echo ""
echo "How to run Supabase (on host Mac):"
echo "  cd trip-app/supabase"
echo "  supabase start"
echo "  supabase status"
echo ""
echo "How to work on functions (in this container):"
echo "  cd /workspaces/trip-app/supabase/functions/api"
echo "  deno lint"
echo "  deno check index.ts"
