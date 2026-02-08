# Deno ベースイメージ
FROM denoland/deno:latest

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    unzip \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# vscode ユーザーを作成（devcontainer で使用）
RUN useradd -m -s /bin/bash vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# vscode ユーザーに切り替えて Supabase CLI をインストール
USER vscode
WORKDIR /home/vscode

# Deno のキャッシュディレクトリを設定
ENV DENO_DIR=/home/vscode/.deno_cache
RUN mkdir -p $DENO_DIR && chmod -R 755 $DENO_DIR

# Supabase CLI をインストール（vscode ユーザーで実行）
RUN curl -fsSL https://supabase.com/install.sh | sh

# vscode ユーザーの PATH に Supabase CLI を追加
ENV PATH="/home/vscode/.supabase/bin:${PATH}"
