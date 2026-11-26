#!/bin/sh
set -eu

if [ -f package-lock.json ] && [ ! -d node_modules ] && command -v npm >/dev/null 2>&1; then
  npm ci --prefer-offline || true
fi
