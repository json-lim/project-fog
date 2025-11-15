#!/bin/bash
set -e

# Go to app directory
cd $PROJECT_DIR

# Pull latest code
git reset --hard
git pull origin main

# Install dependencies
npm install
npm run build

# Start app using PM2
pm2 kill
pm2 start npm --name "myapp" -- start; pm2 save; pm2 startup
