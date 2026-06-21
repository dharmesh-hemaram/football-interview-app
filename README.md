# Football Interview App

A React + Redux + TypeScript application built for frontend interviews. The app is fully functional — your task is to find and fix **9 intentional bugs** hidden across the codebase.

---

## Getting Started

### Option 1: CodeSandbox (Recommended — no setup needed)

Open directly in the browser:

[https://codesandbox.io/p/github/dharmesh-hemaram/football-interview-app/interview/main](https://codesandbox.io/p/github/dharmesh-hemaram/football-interview-app/interview/main)

Both the backend and frontend start automatically. No installation required.

### Option 2: Local Development

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

---

## The Task

There are **9 React bugs** in this codebase, each targeting a distinct anti-pattern. Read [INTERVIEW_GUIDE.md](./INTERVIEW_GUIDE.md) for a description of what each bug causes in the running app.

Find each bug, fix it, and be ready to explain:
- What the root cause is
- Why it causes the observed behaviour
- What the correct pattern should be

---

## Tech Stack

- **Frontend**: React 18, Redux Toolkit, TypeScript, React Router, Vite
- **Backend**: Node.js, Express, Socket.IO
- **UI**: Bootstrap 5

---

## Project Structure

```
football-interview-app/
├── backend/
│   └── src/
│       ├── app.ts        Express server + WebSocket
│       ├── db.ts         Mock data
│       └── index.ts      Entry point
└── frontend/
    └── src/
        ├── components/   Shared UI components
        ├── pages/        Route-level page components
        ├── redux/        Store, slices, selectors
        ├── services/     API and WebSocket clients
        └── types/        Shared TypeScript types
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players` | List all players |
| GET | `/api/players/:id` | Get player by ID |
| PUT | `/api/players/:id` | Update player |
| GET | `/api/teams` | List all teams |
| GET | `/api/teams/:id` | Get team by ID |
| PUT | `/api/teams/:id` | Update team |
| GET | `/api/matches` | List all matches |
| GET | `/api/matches/:id` | Get match by ID |
| PUT | `/api/matches/:id` | Update match |

**WebSocket events:**
- `subscribe:liveUpdates` — subscribe to a match room
- `notification` — receive live update notifications
