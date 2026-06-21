# React Bugs Interview Guide

This branch contains **9 intentional React bugs** spread across the codebase.
Each one targets a distinct anti-pattern. The candidate should find and fix them.

---

## Bug 1

When filtering players by position, the cards jump around and display incorrect data — a card that was showing one player suddenly shows a different player's stats after the filter changes.

---

## Bug 2

When editing a team's details, typing into the form fields has no visible effect — the inputs appear frozen and do not update as the user types.

---

## Bug 3

Navigating from one player's detail page to another shows the previous player's data. The page does not refresh when the URL changes.

---

## Bug 4

The Matches page triggers continuous API requests in an infinite loop. The Network tab shows the same requests firing repeatedly without stopping.

---

## Bug 5

When first loading the Teams page, it briefly flashes "No teams found" before the data appears. There is no loading indicator while the data is being fetched.

---

## Bug 6

After navigating away from a match detail page, API requests for that match continue firing in the background every few seconds. This also produces console warnings about state updates on unmounted components.

---

## Bug 7

The Player Detail page crashes with a React error when navigating to it. The error message mentions a change in the order of Hooks between renders.

---

## Bug 8

Every time the user navigates to the Players page, the app fires API requests to fetch players and teams — even when the data is already loaded and nothing has changed.

---

## Bug 9

A prop is reassigned directly inside a component instead of deriving a new local value. This violates React's one-way data flow and can cause subtle rendering issues when the component is memoised or the parent depends on the original value.

---
