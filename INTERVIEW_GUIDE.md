# React Bugs Interview Guide

This branch contains **9 intentional React bugs** spread across the codebase.
Each one targets a distinct anti-pattern. The candidate should find and fix them.

---

## Bug 1 — Incorrect Key Props in Lists

**File:** `frontend/src/pages/PlayersPage.tsx`

**Concept:** React uses `key` to identify which list items changed between renders.
Using an array index as `key` breaks reconciliation when items are reordered or removed,
causing incorrect DOM updates and lost component state.

**Symptom:** Filtering or sorting players may show the wrong player cards or lose local state.

**What to look for:** A `.map()` call using the second `index` argument as `key` instead of a stable unique ID.

---

## Bug 2 — Mutating State Directly

**File:** `frontend/src/pages/TeamDetailPage.tsx`

**Concept:** React state must be treated as immutable. When you mutate an object in place and
call `setState` with the same reference, React sees no change and skips the re-render.

**Symptom:** Editing a team's stats in the form — typing into fields appears to do nothing because
the UI doesn't re-render.

**What to look for:** `handleInputChange` directly assigns to a property on `formData` before
calling `setFormData`.

---

## Bug 3 — useEffect Dependency Array Issues

**File:** `frontend/src/pages/PlayerDetailPage.tsx`

**Concept:** An empty `[]` dependency array means the effect only runs once on mount. If the
effect captures values like `id` from props/params, it won't re-run when those values change.

**Symptom:** Navigating from one player detail page to another shows stale data from the first player.

**What to look for:** The first `useEffect` has `[]` instead of `[id, dispatch]`.

---

## Bug 4 — Creating New Functions/Objects on Every Render

**File:** `frontend/src/pages/MatchesPage.tsx`

**Concept:** Values defined inside a component body are re-created on every render. When an
object or function is used as a `useEffect` dependency, its new reference triggers the effect
on every render — creating an infinite fetch loop.

**Symptom:** The matches page hammers the API in an infinite loop (check the Network tab).

**What to look for:** `fetchOptions = { force: false }` is declared inside the component and
listed as a dependency in the `useEffect`. The object is a new reference every render.

---

## Bug 5 — Not Handling Loading and Error States

**File:** `frontend/src/pages/TeamsPage.tsx`

**Concept:** Components that fetch async data must handle the loading period. Without a loading
guard, the component tries to render with an empty or undefined data set immediately on mount,
which can cause blank screens, crashes, or flash-of-empty-content.

**Symptom:** The Teams page briefly shows "No teams found" before data arrives instead of a spinner.

**What to look for:** The `loading` state is never read. The `if (loading) return <Spinner />`
block is missing entirely, and the `Spinner` import was removed.

---

## Bug 6 — Missing Cleanup in useEffect

**File:** `frontend/src/pages/MatchDetailPage.tsx`

**Concept:** Side effects that produce ongoing work (timers, subscriptions, event listeners) must
be cleaned up when the component unmounts or the effect re-runs. Without cleanup, the work
continues in the background and can cause state updates on unmounted components.

**Symptom:** Navigating away from a match detail page still triggers API calls every 5 seconds
in the background (visible in the Network tab). Can also cause "state update on unmounted
component" warnings.

**What to look for:** A `setInterval` is created but `clearInterval` is never called. There is
no `return () => clearInterval(interval)` cleanup function.

---

## Bug 7 — Calling Hooks Conditionally

**File:** `frontend/src/pages/PlayerDetailPage.tsx`

**Concept:** React's Rules of Hooks require that hooks are always called in the same order on
every render. Placing a hook after an early `return` means it is only called when the component
doesn't exit early — violating the rules and causing a React runtime error.

**Symptom:** The Player Detail page throws: *"React has detected a change in the order of Hooks
called"* when navigating to it after a loading state, crashing the page.

**What to look for:** A `useEffect` call that appears **after** the `if (loading) return ...`
and `if (!player) return ...` early returns.

---

## Bug 8 — Over-Fetching Data

**File:** `frontend/src/pages/PlayersPage.tsx`

**Concept:** Fetching data unconditionally in a `useEffect` that runs every mount means every
navigation to the page triggers a network request, even when the data is already in the store.
The guard `if (data.length === 0)` prevents redundant requests.

**Symptom:** Every time the user visits the Players page, two API requests fire even if the data
is already cached in Redux.

**What to look for:** `dispatch(fetchPlayers())` and `dispatch(fetchTeams())` called without the
`if (players.length === 0)` / `if (teams.length === 0)` guards.

---

## Bug 9 — Mutating Props

**File:** `frontend/src/components/common/Card.tsx`

**Concept:** Props are read-only in React. Reassigning a destructured prop variable (e.g.
`className = className + '...'`) mutates local state in a way that is confusing and error-prone,
and breaks the contract that props flow one-way from parent to child.

**Symptom:** The mutation itself doesn't cause a visible bug here, but it creates a pattern that
can cause subtle issues — especially when the parent relies on the original value being unchanged,
or when the component is memoised.

**What to look for:** Inside the `Card` component, `className` (a prop) is reassigned with `=`
rather than using a new local variable.

---

## Scoring Guide

| # | Bug | Difficulty |
|---|-----|------------|
| 1 | Incorrect Key Props | Easy |
| 5 | No Loading State | Easy |
| 8 | Over-Fetching | Easy |
| 9 | Mutating Props | Easy |
| 2 | Mutating State Directly | Medium |
| 3 | useEffect Dependency Array | Medium |
| 4 | New Objects on Every Render | Medium |
| 6 | Missing Cleanup | Hard |
| 7 | Hooks Called Conditionally | Hard |

**Junior (0–3 years):** Expected to find bugs 1, 5, 8, 9.
**Mid-level (3–6 years):** Expected to find all of the above + 2, 3, 4.
**Senior (6+ years):** Expected to find all 9 and explain the root cause and impact of each.
