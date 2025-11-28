#!/bin/bash

msg="Auto Update: $(date '+%Y-%m-%d %H:%M:%S')"

git add .
git commit -m "$msg"
git push

echo "-----------------------------------------"
echo "🚀 Auto Deploy Complete!"
echo "✔ All changes pushed to GitHub."
echo "✔ Vercel will auto-build now."
echo "-----------------------------------------"
