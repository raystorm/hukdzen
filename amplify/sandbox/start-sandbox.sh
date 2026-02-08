#!/bin/bash
# Wrapper script to start sandbox and auto-seed test data
# Usage: ./amplify/sandbox/start-sandbox.sh [--profile dev]

set -e

echo "🚀 Starting Amplify Sandbox..."

# Start sandbox in background, capture output
npx ampx sandbox "$@" &
SANDBOX_PID=$!

# Wait for amplify_outputs.json to be created
echo "⏳ Waiting for sandbox to deploy..."
while [ ! -f amplify_outputs.json ]; do
  sleep 2
done

echo "✅ Sandbox deployed!"

# Auto-seed if seed scripts exist
if [ -f amplify/sandbox/seed-users.sh ]; then
  echo "🌱 Seeding users..."
  bash amplify/sandbox/seed-users.sh
fi

if [ -f amplify/sandbox/seed-documents.sh ]; then
  echo "🌱 Seeding documents..."
  bash amplify/sandbox/seed-documents.sh
fi

if [ -f amplify/sandbox/seed-test-data.sh ]; then
  echo "🌱 Seeding test data..."
  bash amplify/sandbox/seed-test-data.sh
fi

echo "✨ Sandbox ready with test data!"
echo "Press Ctrl+C to stop sandbox"

# Wait for sandbox process
wait $SANDBOX_PID
