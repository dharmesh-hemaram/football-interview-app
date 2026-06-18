# ⚽ Football Interview App

A **React + Redux + TypeScript** boilerplate project with a **Node.js backend** for interviewing frontend developers.

## Project Overview

This is a **half-cooked** interview project where the backend is fully functional and the frontend has skeleton code for candidates to complete. Candidates should focus on **functionality over UI**, implementing Redux patterns, React Router, and API integration.

### What's Included ✅

**Backend (100% Complete):**
- Express.js REST API
- WebSocket for real-time notifications
- Mock database with Players, Teams, and Matches
- CORS configured for frontend

**Frontend (50% Complete):**
- React + Redux + TypeScript setup
- Bootstrap UI components (pre-built for reuse)
- **Notification Redux slice** (complete reference)
- **Player Redux slice** (complete reference)
- **Player pages** (List + Detail with edit form)
- Reusable components (Card, Button, Badge, Spinner)
- WebSocket integration

### What Candidate Needs to Complete ❌

1. **Team Redux Slice** - Implement following Players pattern
2. **Match Redux slice** - Implement following Players pattern
3. **Team API service methods** - Complete the skeleton
4. **Match API service methods** - Complete the skeleton
5. **Wire React Router** - Connect Teams and Matches routes
6. **Team & Match pages** - Build list and detail views
7. **Understand component optimization** - Proper Redux selectors to avoid unnecessary re-renders

---

## Setup Instructions

### Option 1: DevPod / Codespaces (Recommended)

The project is configured with `devcontainer.json` for DevPod/Codespaces:

```bash
# Everything installs automatically on first open
# Just run:
npm run dev
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Install both backend and frontend
npm run install:all

# Start both services (backend on 3001, frontend on 3000)
npm run dev

# Or start them separately:
npm run dev:backend   # Terminal 1
npm run dev:frontend  # Terminal 2
```

### Health Check

- **Backend**: http://localhost:3001/health
- **Frontend**: http://localhost:3000
- **WebSocket**: ws://localhost:3001

---

## Project Structure

```
football-interview-app/
├── backend/
│   ├── src/
│   │   ├── index.ts           (Express server + WebSocket)
│   │   ├── types.ts           (Shared types)
│   │   └── db.ts              (Mock database)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── pages/             (Complete: Players, Skeleton: Teams/Matches)
    │   ├── components/
    │   │   ├── common/        (Card, Button, Badge, Spinner)
    │   │   ├── Navbar.tsx
    │   │   └── NotificationContainer.tsx
    │   ├── redux/
    │   │   ├── slices/
    │   │   │   ├── notificationSlice.ts  (✅ COMPLETE)
    │   │   │   ├── playerSlice.ts        (✅ COMPLETE)
    │   │   │   └── teamSlice.ts          (❌ INCOMPLETE)
    │   │   └── store.ts
    │   ├── services/
    │   │   ├── api.ts         (Partial - Players done, Teams/Matches skeleton)
    │   │   └── socket.ts      (✅ COMPLETE)
    │   ├── types/
    │   │   └── index.ts       (Shared types)
    │   ├── App.tsx            (Routing - partial)
    │   └── main.tsx
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

---

## What The Candidate Should Do

### Phase 1: Understanding (Read First)
1. Read `backend/src/index.ts` - understand API endpoints
2. Read `frontend/src/redux/slices/playerSlice.ts` - understand Redux pattern
3. Read `frontend/src/pages/PlayersPage.tsx` - see how components are connected

### Phase 2: Implementation
1. **Complete API Service** (`frontend/src/services/api.ts`)
   - Implement `teamService` methods (getAll, getById, update)
   - Implement `matchService` methods (getAll, getById, update)

2. **Complete Redux Slices** 
   - `frontend/src/redux/slices/teamSlice.ts` - Follow playerSlice pattern
   - Create `frontend/src/redux/slices/matchSlice.ts` - New slice

3. **Build Pages**
   - `frontend/src/pages/TeamsPage.tsx` - List view
   - `frontend/src/pages/TeamDetailPage.tsx` - Detail view with edit
   - `frontend/src/pages/MatchesPage.tsx` - List view
   
4. **Wire Routing** (`frontend/src/App.tsx`)
   - Uncomment Teams routes
   - Add Matches routes

### Phase 3: Testing
- Verify CRUD operations work
- Check Redux DevTools for state management
- Test WebSocket notifications on player update
- Verify component re-renders only when needed

---

## Key Concepts to Test

### ✅ Redux Patterns
- Async thunks for API calls
- Selectors for data retrieval
- Proper state normalization
- Avoiding unnecessary re-renders with `useSelector`

### ✅ React Router
- Route matching and nested routes
- Navigation with `useNavigate`
- URL parameters with `useParams`

### ✅ TypeScript
- Strong typing for Props, State, and API responses
- Creating and extending types

### ✅ Component Optimization
- Understanding when components re-render
- Using React.memo where appropriate
- Proper Redux selector usage

---

## API Endpoints (Backend)

### Players
- `GET /api/players` - List all players
- `GET /api/players/:id` - Get player by ID
- `PUT /api/players/:id` - Update player

### Teams
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team

### Matches
- `GET /api/matches` - List all matches
- `GET /api/matches/:id` - Get match by ID
- `PUT /api/matches/:id` - Update match

### WebSocket Events
- `subscribe:liveUpdates` - Subscribe to match updates
- `notification` - Receive live updates

---

## Available Components (Reusable)

```typescript
import { Card, CardBody, CardHeader } from '@components/common';
import { Button } from '@components/common';
import { Badge } from '@components/common';
import { Spinner } from '@components/common';
```

Use these instead of creating new ones. This tests if the candidate checks existing components!

---

## Redux Hooks (Use These)

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@redux/store';

const dispatch = useDispatch<AppDispatch>();
const data = useSelector((state: RootState) => selectPlayers(state));
```

---

## Example: Adding a Team

**What the candidate should do:**

1. Call `teamService.update(teamId, { wins: 20 })`
2. Redux thunk updates `state.teams.selectedTeam` AND `state.teams.list[index]`
3. Components using `selectTeams` or `selectSelectedTeam` re-render
4. Only relevant components re-render, not the entire app
5. WebSocket notification arrives and triggers in NotificationContainer

---

## How to Verify Candidate's Work

### Code Review Checklist
- [ ] Follows Redux pattern from playerSlice
- [ ] Uses async thunks correctly
- [ ] Properly normalizes state
- [ ] Components use `useSelector` efficiently
- [ ] No component imports business logic (keeps it in Redux)
- [ ] Forms handle state changes cleanly
- [ ] Router configuration is complete

### Functional Testing
- [ ] Can fetch and display Teams
- [ ] Can fetch and display Matches
- [ ] Can edit Team data and see updates
- [ ] Can navigate between pages
- [ ] WebSocket notifications appear
- [ ] Closing notification removes it from list
- [ ] No console errors

---

## Debugging Tips

### Check Redux State
```typescript
// In browser console
store.getState()
```

### Monitor API Calls
Open DevTools Network tab and check:
- `GET /api/players`
- `GET /api/teams`
- etc.

### WebSocket Debugging
```javascript
// In browser console
socket = io('http://localhost:3001');
socket.on('notification', (n) => console.log(n));
```

---

## Common Mistakes Candidates Make

1. **Not using selectors** - Accessing `state.players` directly instead of using `selectPlayers`
2. **Duplicating components** - Creating new Button instead of reusing Button component
3. **Logic in components** - Putting API calls in component instead of Redux thunks
4. **Over-normalizing** - Creating too many slices instead of organizing logically
5. **Not handling loading/error states** - Forgetting to display loading spinners

---

## Time Expectation

- **Phase 1 (Understanding)**: 30-45 mins
- **Phase 2 (Implementation)**: 2-3 hours
- **Phase 3 (Testing & Debugging)**: 30-45 mins

**Total**: 3-4 hours for a competent mid-level frontend dev

---

## Support

For issues with the boilerplate:
- Check backend logs: `npm run dev:backend`
- Check frontend logs: Open DevTools
- Verify API is running: `curl http://localhost:3001/health`

Good luck! 🏆⚽
