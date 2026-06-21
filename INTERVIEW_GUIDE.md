# React Bugs Interview Guide

This branch contains **9 intentional React bugs** spread across the codebase.
Each one targets a distinct anti-pattern. The candidate should find and fix them.

---

## Bug 1 — Incorrect Key Props in Lists

When sorting or filtering the players list, some cards display the wrong player's data, or UI state (e.g. expanded cards) shifts to the wrong item unexpectedly.

---

## Bug 2 — Mutating State Directly

When editing a team's details, typing into the form fields has no visible effect — the inputs appear frozen and do not update as the user types.

---

## Bug 3 — useEffect Dependency Array Issues

Navigating from one player's detail page to another shows the previous player's data. The page does not refresh when the URL changes.

---

## Bug 4 — Creating New Functions/Objects on Every Render

The Matches page triggers continuous API requests in an infinite loop. The Network tab shows the same requests firing repeatedly without stopping.

---

## Bug 5 — Not Handling Loading and Error States

When first loading the Teams page, it briefly flashes "No teams found" before the data appears. There is no loading indicator while the data is being fetched.

---

## Bug 6 — Missing Cleanup in useEffect

After navigating away from a match detail page, API requests for that match continue firing in the background every few seconds. This also produces console warnings about state updates on unmounted components.

---

## Bug 7 — Calling Hooks Conditionally

The Player Detail page crashes with a React error when navigating to it. The error message mentions a change in the order of Hooks between renders.

---

## Bug 8 — Over-Fetching Data

Every time the user navigates to the Players page, the app fires API requests to fetch players and teams — even when the data is already loaded and nothing has changed.

---

## Bug 9 — Mutating Props

A prop is reassigned directly inside a component instead of deriving a new local value. This violates React's one-way data flow and can cause subtle rendering issues when the component is memoised or the parent depends on the original value.

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
