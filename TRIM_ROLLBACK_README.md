# Trim Rollback README

## Purpose

This document records the code-trim/refactor actions and how to reverse them safely if needed.

## Trimmed/Refactored Items

## v1.2.4

1. Added helper `schedule(fn, delays)` to replace repeated `setTimeout(...)` blocks in `delayedPass`.
2. Kept behavior-equivalent delay windows:
   - `runNuclearPass`: 500, 1500, 3000 ms
   - `tryRedirectFromIntermediatePage`: 200, 800, 1800 ms
   - `killTopLeftSwirl`: 300, 1200, 2600 ms
   - `syncCenterPlayOverlay`: 300, 1200, 2600 ms

## Why This Is Safe

- No logic removed from the scheduling matrix.
- Delay values are unchanged.
- This is a readability/maintainability trim, not a behavioral rewrite.

## How To Reverse The Trim Only

Option A (recommended):

1. Reopen `xaavv-kiro-dark.user.js`.
2. Remove helper function:
   - `const schedule = (fn, delays) => { ... }`
3. Replace each `schedule(...)` call in `delayedPass` with explicit `setTimeout(...)` lines matching the same delays.

Option B (git rollback):

1. Find commit that introduced trim helper.
2. Revert only that commit:
   - `git revert <commit_sha>`
3. Resolve conflicts if any, then push.

## Validation After Rollback

1. Confirm no syntax errors (`node --check ./xaavv-kiro-dark.user.js`).
2. Verify these behaviors still work:
   - intermediate-page skip
   - playback automation assist
   - top-left swirl removal
   - center play overlay state

## Notes

- This rollback document concerns trim/refactor changes only.
- Functional patches for playback/overlay state can remain even if trim helper is rolled back.
