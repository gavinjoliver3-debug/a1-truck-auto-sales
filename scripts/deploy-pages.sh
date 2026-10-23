#!/usr/bin/env bash
# Builds the static copy and force-pushes it to the gh-pages branch (GitHub Pages serves that branch).
set -euo pipefail
cd "$(dirname "$0")/.."
GITHUB_PAGES=true npm run build
touch out/.nojekyll  # keep the _next/ folder (Jekyll would drop it)
cd out
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(git -C .. rev-parse --short HEAD)"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
