
# Document Checklist App

This project is a full-stack document checklist application for public tender documents.

## Project Structure

- `backend/` — Node.js/Express API, SQLite DB, Knex migrations
- `frontend/` — React + Vite frontend
- `uploads/` — Uploaded files
- `data/` — (optional) Data files

## Prerequisites

- Node.js (v18+ recommended)
- npm

## Setup & Development

1. **Install dependencies and run both servers:**

	```sh
	npm run dev
	```
	This will:
	- Install backend and frontend dependencies
	- Remove and recreate the SQLite database
	- Run all migrations
	- Start both backend (http://localhost:3001) and frontend (http://localhost:5173) in parallel

2. **Access the app:**
	- Frontend: [http://localhost:5173](http://localhost:5173)
	- Backend API: [http://localhost:3001](http://localhost:3001)

## Useful Scripts

- `npm run dev` — Start both backend and frontend with auto-reload
- `cd backend && npx knex migrate:latest` — Run DB migrations manually
- `cd backend && npx knex migrate:unlock` — Unlock migration table if locked

## Troubleshooting

- **Database locked or readonly:**
  - Stop all servers, delete `backend/dev.sqlite3`, and rerun `npm run dev`.
  - If migrations are locked, run the unlock command above.

## License

MIT
