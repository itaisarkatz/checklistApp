#!/bin/bash
set -e

# Install dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..

# Remove SQLite DB
rm -f backend/src/db/dev.sqlite3 backend/dev.sqlite3

# Run migrations
cd backend && npx knex migrate:latest --knexfile src/db/knexfile.ts && cd ..


# Start backend in a subshell
(cd backend && npm run dev) &
BACKEND_PID=$!
# Start frontend in a subshell
(cd frontend && npm run dev) &
FRONTEND_PID=$!

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
