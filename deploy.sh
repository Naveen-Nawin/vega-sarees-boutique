#!/bin/bash

msg=${1:-"Auto Update: $(date '+%Y-%m-%d %H:%M:%S')"}

git add .
git commit -m "$msg"
git push

echo "-------------------------------------------"
echo "🚀 DEPLOY COMPLETE"
echo "✔ Changes pushed to GitHub"
echo "✔ Vercel is building new version"
echo "-------------------------------------------"
