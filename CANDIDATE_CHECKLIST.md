# ✅ Candidate Task Checklist

Complete this checklist as you work through the interview assignment.

## Phase 1: Understanding & Setup

- [ ] Read the README.md
- [ ] Examine `backend/src/index.ts` - understand all API endpoints
- [ ] Read `frontend/src/redux/slices/playerSlice.ts` - study the Redux pattern
- [ ] Look at `frontend/src/pages/PlayersPage.tsx` - see how components connect to Redux
- [ ] Look at `frontend/src/pages/PlayerDetailPage.tsx` - understand edit form pattern
- [ ] Review reusable components in `frontend/src/components/common/`
- [ ] Check `frontend/src/services/api.ts` - see playerService as reference
- [ ] Run `npm run dev` and verify both backend and frontend start
- [ ] Open http://localhost:3000 in browser
- [ ] Verify Players page loads data and you can click to detail page

## Phase 2: API Service Implementation

- [ ] Open `frontend/src/services/api.ts`
- [ ] Complete `teamService` object following `playerService` pattern:
  - [ ] `getAll()` method
  - [ ] `getById(id)` method  
  - [ ] `update(id, data)` method
- [ ] Complete `matchService` object following `playerService` pattern:
  - [ ] `getAll()` method
  - [ ] `getById(id)` method
  - [ ] `update(id, data)` method
- [ ] Test API methods in browser console:
  ```javascript
  import { teamService } from './services/api';
  teamService.getAll().then(t => console.log(t));
  ```

## Phase 3: Redux Team Slice

- [ ] Open `frontend/src/redux/slices/teamSlice.ts`
- [ ] Create async thunks (following playerSlice pattern):
  - [ ] `fetchTeams`
  - [ ] `fetchTeamById`
  - [ ] `updateTeam`
- [ ] Implement reducers:
  - [ ] `clearSelectedTeam`
  - [ ] `clearError`
- [ ] Implement extraReducers for all three thunks:
  - [ ] Handle `.pending`, `.fulfilled`, `.rejected` states
  - [ ] **IMPORTANT**: When updating a team, update BOTH `state.selectedTeam` AND `state.list[index]`
- [ ] Create selectors:
  - [ ] `selectTeams`
  - [ ] `selectSelectedTeam`
  - [ ] `selectTeamsLoading`
  - [ ] `selectTeamsError`
  - [ ] (Optional) `selectTeamsByCountry` for filtering
- [ ] TypeScript: No compilation errors (`npm run typecheck -w frontend`)

## Phase 4: Build Teams Pages

### TeamsPage.tsx
- [ ] Open `frontend/src/pages/TeamsPage.tsx`
- [ ] Import Redux hooks and selectors
- [ ] Call `dispatch(fetchTeams())` on mount with useEffect
- [ ] Display loading spinner while fetching
- [ ] Map through teams and create Card components
- [ ] Each team card should:
  - [ ] Show team name
  - [ ] Show team logo (if available)
  - [ ] Show basic stats (wins, losses, draws)
  - [ ] Be clickable to navigate to detail page
- [ ] Handle empty state (no teams found)

### TeamDetailPage.tsx
- [ ] Open `frontend/src/pages/TeamDetailPage.tsx`
- [ ] Import Redux hooks and selectors
- [ ] Get team ID from URL params with `useParams`
- [ ] Fetch team on mount with `useEffect`
- [ ] Display loading spinner
- [ ] Show team details when loaded
- [ ] Implement edit mode:
  - [ ] Toggle between view and edit modes
  - [ ] Create form with team fields (wins, losses, draws, etc.)
  - [ ] On save, call `dispatch(updateTeam({ id, data }))`
  - [ ] On cancel, revert form to original values
  - [ ] **KEY TEST**: Edit a team, go back to list, see the change reflected
- [ ] Navigate back to teams list button

## Phase 5: Wire React Router

- [ ] Open `frontend/src/App.tsx`
- [ ] Uncomment the Teams routes (currently commented out):
  ```typescript
  <Route path="/teams" element={<TeamsPage />} />
  <Route path="/teams/:id" element={<TeamDetailPage />} />
  ```
- [ ] Test navigation:
  - [ ] Click "Teams" in navbar
  - [ ] Click a team card
  - [ ] Edit team info and save
  - [ ] Go back to teams list
  - [ ] Verify change is still there

## Phase 6: Testing & Verification

### Functionality Tests
- [ ] ✅ Click "Players" → see list of players
- [ ] ✅ Click player card → see detail page
- [ ] ✅ Edit player → save → changes appear in detail AND list
- [ ] ✅ Click "Teams" → see list of teams
- [ ] ✅ Click team card → see detail page  
- [ ] ✅ Edit team → save → changes appear in detail AND list
- [ ] ✅ Navigate between pages without breaking anything
- [ ] ✅ No console errors or TypeScript warnings

### Redux Testing
- [ ] Open Redux DevTools extension (if installed)
- [ ] Dispatch `fetchTeams` action - see it in DevTools
- [ ] Edit a team - watch state update in real-time
- [ ] Verify `unreadCount` badge updates if you trigger notifications

### Performance Testing
- [ ] Edit a team and verify:
  - [ ] Only the affected components re-render
  - [ ] Not every component in the app re-renders
  - [ ] Use React DevTools Profiler to check

## Bonus: Match Implementation (If Time)

- [ ] Create `frontend/src/redux/slices/matchSlice.ts` from scratch
- [ ] Implement `matchService` methods in `api.ts`
- [ ] Create `frontend/src/pages/MatchesPage.tsx`
- [ ] Create `frontend/src/pages/MatchDetailPage.tsx` (optional)
- [ ] Wire matches routes in `App.tsx`
- [ ] Test match CRUD

## Bonus: Other Improvements

- [ ] Add form validation (no negative numbers, required fields)
- [ ] Add sorting/filtering on lists
- [ ] Add pagination
- [ ] Style improvements with Bootstrap
- [ ] Better error messages

## Final Checklist

Before submitting:
- [ ] All pages load without errors
- [ ] All API calls work
- [ ] Redux state is consistent (list reflects detail changes)
- [ ] No TypeScript errors: `npm run typecheck -w frontend`
- [ ] Can navigate through entire app
- [ ] Code is readable and follows playerSlice pattern
- [ ] No console errors

---

## Stuck? Try This

### "My redux actions aren't dispatching"
1. Check store.ts has the reducer registered
2. Verify useDispatch is typed with AppDispatch
3. Check browser console for thunk errors

### "My form data is stale"
1. Add `console.log(team)` in component
2. Check useEffect updates formData when team changes
3. Verify selectedTeam is being updated in Redux

### "Edits don't appear in list"
1. Check updateTeam reducer - does it update state.list[index]?
2. Verify selectTeams selector returns the updated list
3. Check list component re-renders (React DevTools)

### "Components re-render too much"
1. Make sure you're using selectors, not direct state access
2. Don't create new objects in selectors
3. Check if parent component is passing new props

### "TypeScript types are wrong"
1. Import types from `@types/index`
2. Check API response matches the type
3. Use `type SomeName = ...` for custom types

---

## Time Estimates

- Phase 1 (Understanding): 30-45 mins
- Phase 2 (API Service): 20-30 mins
- Phase 3 (Redux): 45-60 mins
- Phase 4 (Pages): 45-60 mins
- Phase 5 (Routing): 10-15 mins
- Phase 6 (Testing): 20-30 mins

**Total: 3-4 hours for competent dev**

Good luck! 🏆⚽
