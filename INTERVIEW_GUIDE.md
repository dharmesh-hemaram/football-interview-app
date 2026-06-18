# 🎯 Interview Guide - Football App

This document helps evaluate a candidate's frontend development skills using the Football Interview App.

---

## Interview Structure

### Phase 1: Code Reading (15-20 mins)
**Goal**: See if candidate reads existing code before diving in

**Ask:**
- "Walk me through how the Player list and detail pages work"
- "Explain the Redux flow for fetching and updating players"
- "How does WebSocket notification get displayed?"

**What to look for:**
- ✅ Reads playerSlice to understand patterns
- ✅ Understands thunks, selectors, and extraReducers
- ✅ Sees the connection between Redux and UI
- ❌ Jumps to coding without understanding existing patterns

### Phase 2: Planning (10-15 mins)
**Goal**: See if candidate plans before coding

**Ask:**
- "What do you need to implement to make Teams work?"
- "What files will you modify/create?"
- "How is Team different from Player? What's trickier?"

**What to look for:**
- ✅ Lists API service methods, Redux slice, pages, routes
- ✅ Identifies async thunks and selectors needed
- ✅ Sees the pattern and can apply it
- ❌ Unsure or disorganized approach

### Phase 3: Implementation (2-3 hours)
**Goal**: See real coding skills

**Focus Areas:**

#### 1. API Service (30 mins)
- Complete `teamService` methods
- Complete `matchService` methods
- Verify types are correct

**Evaluation:**
- ✅ Uses existing axios instance
- ✅ Follows playerService pattern exactly
- ✅ Proper error handling
- ❌ Creates redundant code
- ❌ Wrong return types

#### 2. Redux Team Slice (45-60 mins)
- Create thunks: `fetchTeams`, `fetchTeamById`, `updateTeam`
- Create reducers in `extraReducers`
- Create selectors: `selectTeams`, `selectSelectedTeam`, etc.

**Evaluation:**
- ✅ Follows playerSlice structure precisely
- ✅ Handles loading/error states
- ✅ Properly updates both list and selected team on update
- ✅ Selectors use memoization patterns
- ❌ Missing error handling
- ❌ Doesn't update list when single team updates
- ❌ Selectors are inefficient

**Key Test**: After updating a team, both the list view AND detail view should update simultaneously. Check:
```typescript
// In TeamDetailPage or TeamsPage
const teams = useSelector(selectTeams);
console.log(teams); // Should reflect the update
```

#### 3. Team Pages (45-60 mins)
- Implement TeamsPage (list view)
- Implement TeamDetailPage (detail + edit form)
- Follow PlayerDetailPage pattern

**Evaluation:**
- ✅ Uses existing Card, Button components
- ✅ Proper Redux connections
- ✅ Edit form with state management
- ✅ Navigation works smoothly
- ❌ Creates duplicate components instead of reusing
- ❌ Component re-renders too much
- ❌ Form loses data on cancel

**Key Test**: 
- Load teams, click one, edit a field, save, see update
- Edit detail page, click back, return to same team, form still has old data? (Lazy loading issue)
- Change team wins from 15 → 20, check list view shows 20 too

#### 4. Routing (15-20 mins)
- Uncomment Team routes in App.tsx
- Add Match routes (if time permits)

**Evaluation:**
- ✅ Routes properly wired
- ✅ No broken links
- ✅ URL parameters work
- ❌ Doesn't implement Match routing
- ❌ Route path typos

#### 5. Bonus: Match Implementation (1-2 hours)
If candidate finishes teams early:

- Create `matchSlice.ts` from scratch
- Implement `matchService` methods
- Create MatchesPage and MatchDetailPage
- Test live notifications on match update

**Evaluation:**
- ✅ Can independently apply the pattern
- ✅ Doesn't need reference anymore
- ✅ Handles more complex data (team name display)
- ✅ Proper state normalization

---

## Common Issues to Watch For

### 1. Component Re-rendering Problems
**Issue**: Every player update causes entire Teams page to re-render

**Why**: Using `useSelector(state => state.teams)` instead of `selectTeams`

**Fix**: Always use selectors, teach about memoization

```typescript
// BAD
const teams = useSelector(state => state.teams.list);

// GOOD
const teams = useSelector(selectTeams);
```

### 2. Not Updating List When Single Item Updates
**Issue**: Edit team in detail page, goes back to list, old data shown

**Why**: Forgot to update `state.list[index]` in the thunk handler

**Check**: The `updateTeam` reducer should update BOTH:
- `state.selectedTeam` (if it's the one being edited)
- `state.list[index]` (to keep list in sync)

### 3. Form State Not Synchronizing
**Issue**: Edit form has stale data from previous view

**Why**: Form state initialized once, not updated when selectedTeam changes

**Fix**: `useEffect` should update form when selectedTeam changes

```typescript
useEffect(() => {
  if (team && !formData) {
    setFormData(team);  // Initialize or update
  }
}, [team]);
```

### 4. Missing TypeScript Types
**Issue**: Compiler errors about missing interfaces

**Why**: Didn't extend Match interface or created incomplete types

**Fix**: Check `frontend/src/types/index.ts`, types are defined there

### 5. API Calls in Components Instead of Redux
**Issue**: useEffect in component calls API directly

**Why**: Doesn't understand where business logic belongs

**Fix**: All API calls go in thunks, components dispatch thunks

---

## Red Flags 🚩

| Issue | Severity | What It Means |
|-------|----------|---------------|
| Creates new Button instead of importing Button | 🔴 High | Doesn't check existing code |
| Manual API calls in component | 🔴 High | Doesn't understand Redux pattern |
| Doesn't understand why selectTeams is needed | 🔴 High | Weak Redux knowledge |
| Duplicate code from playerSlice instead of adapting | 🟡 Medium | Copy-paste without understanding |
| Form loses data on page navigation | 🟡 Medium | State management issues |
| Every update re-renders entire app | 🟡 Medium | Doesn't understand optimization |
| No error handling | 🟡 Medium | Incomplete implementation |
| Doesn't use loading/spinner | 🟡 Medium | UX awareness lacking |
| Type errors in TypeScript | 🟠 Low | IDE setup or quick mistakes |

---

## Green Flags 🟢

| Behavior | What It Means |
|----------|---------------|
| Reads playerSlice first before coding | ✅ Careful, professional approach |
| Reuses existing components without modification | ✅ Understands DRY principle |
| Uses selectors properly everywhere | ✅ Strong Redux knowledge |
| Updates both list and detail state on edit | ✅ Understands state normalization |
| Handles loading and error states | ✅ Production-ready thinking |
| Asks about edge cases (what if team is deleted?) | ✅ Thinks deeply |
| Implements memoization for selectors | ✅ Advanced knowledge |
| Tests components independently | ✅ Good testing mindset |

---

## Scoring Rubric

### API Service (20 points)
- [ ] 20: Perfect, follows pattern, error handling
- [ ] 15: Mostly correct, minor issues
- [ ] 10: Works but has issues or not fully following pattern
- [ ] 5: Partially implemented
- [ ] 0: Not attempted

### Redux Team Slice (30 points)
- [ ] 30: Perfect, thunks, reducers, selectors all correct
- [ ] 25: Minor bugs in reducer logic
- [ ] 20: Works but list/detail not synced properly
- [ ] 15: Significant issues but shows understanding
- [ ] 10: Partially implemented
- [ ] 0: Not attempted

### Team Pages UI (20 points)
- [ ] 20: Both list and detail, edit form works, reuses components
- [ ] 15: Both pages work, minor UI/UX issues
- [ ] 10: Pages exist but incomplete or buggy
- [ ] 5: Only one page or very incomplete
- [ ] 0: Not attempted

### Routing (10 points)
- [ ] 10: All routes properly wired, navigation works
- [ ] 7: Routes work with minor issues
- [ ] 5: Routes exist but incomplete
- [ ] 0: Not attempted

### Code Quality (20 points)
- [ ] 20: Clean, follows patterns, good practices
- [ ] 15: Generally clean with minor issues
- [ ] 10: Works but not clean or has some issues
- [ ] 5: Messy but functional
- [ ] 0: Very poor quality

### **Total: 100 points**

**Interpretation:**
- **85-100**: Strong hire - ready for mid-level role
- **70-85**: Good hire - needs some mentoring
- **55-70**: Questionable - has gaps, needs training
- **40-55**: Weak - significant gaps in understanding
- **Below 40**: Not ready for this level

---

## Interview Questions to Ask

### During Code Reading
- "How does the notification get from the backend to the Redux store?"
- "If we updated 100 players, would all components re-render? Why/why not?"
- "What would happen if someone edits a player while viewing the list?"

### During Implementation
- "Why do we need selectors?"
- "What's the difference between `playerSlice.ts` and `playerService.ts`?"
- "How does the Redux store know a player was updated?"

### After Implementation
- "How would you add a new Team field (e.g., stadiumName)?"
- "What if we wanted to filter teams by country on the frontend?"
- "How would you handle an API error when updating a team?"
- "How would you add a "loading..." state to the edit form?"

---

## Bonus Tasks (If Time)

### Easy (30 mins)
- Add a player search/filter on PlayersPage
- Add team standings sort (by wins, goals, etc.)

### Medium (1 hour)
- Implement full Match CRUD
- Add validation to forms

### Hard (2+ hours)
- Implement pagination on lists
- Add optimistic updates (update UI before API confirms)
- Create a composition feature (pick players for a team)

---

## Post-Interview

### Ask Candidate
1. "What was hardest about this task?"
2. "What would you do differently if you could restart?"
3. "What do you think you did well?"

### Areas to Discuss
1. State management philosophy
2. Approach to learning new patterns
3. How they handle unfamiliar code
4. Testing strategies

Good luck with your interviews! 🏆
