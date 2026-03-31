#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB_DIR="$ROOT_DIR/dist/web"
BUILD_DIR="$ROOT_DIR/dist/build"
SITE_DIR="$ROOT_DIR/site"
PUBLIC_DIR="$ROOT_DIR/public"

rm -rf "$WEB_DIR"
mkdir -p "$WEB_DIR/app"

cp -R "$SITE_DIR/." "$WEB_DIR/"
cp -R "$BUILD_DIR/desktop" "$WEB_DIR/app/desktop"
cp -R "$BUILD_DIR/mobile" "$WEB_DIR/app/mobile"
cp -R "$PUBLIC_DIR/." "$WEB_DIR/"

cat > "$WEB_DIR/_redirects" <<'EOF'
/app/desktop/* /app/desktop/index.html 200
/app/mobile/* /app/mobile/index.html 200
EOF
