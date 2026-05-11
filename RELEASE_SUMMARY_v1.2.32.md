# RELEASE SUMMARY v1.2.32

Date: 2026-05-11
Repository: <REPO_OWNER>/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script

## Request Addressed

- Move the Selections panel (label `\u9009\u96c6` / `Selections`) below the video.
- Make the video panel consume full horizontal width.
- Keep behavior stable across rerenders.

## Implementation

### 1) Version synchronization

- `@version` bumped to 1.2.32.
- `SCRIPT_VERSION` bumped to 1.2.32.
- File renamed to:
  - xaavv-master-automation-dark-mode-v1.2.32.user.js

### 2) New play-layout enforcer

Added function:

- `enforcePlayVideoFirstLayout()`

What it does:

- Runs only on play pages.
- Finds the Selections label node by text match (`\u9009\u96c6` or `Selections`).
- Resolves the containing selection card/panel.
- Identifies sibling video panel by media presence (`video`, `#player`, `.video-js`) and fallback text cues.
- Moves the selection card directly after the video panel.
- Forces layout container to a single-column full-width structure.
- Forces video panel/media wrappers to `width: 100%` and removes max-width clamping.

### 3) Recurring enforcement wiring

The new enforcer is called in:

1. `startOverlayWatchdog()` interval loop.
2. `delayedPass()` immediate + scheduled follow-ups.
3. `MutationObserver` callback.

This keeps layout stable when the site rehydrates or reapplies styles.

## Documentation Updated

1. INSTALLATION_AND_UPDATE_GUIDE.md
- Updated `What's New in v1.2.32` with play-layout reflow and full-width video behavior.

2. README.md
- Added `1.2.32` Fix Log entry.
- Updated release summary pointer to `RELEASE_SUMMARY_v1.2.32.md`.

3. ABOUT.md
- Updated release section to v1.2.32 play-layout scope.

4. RELEASE_SUMMARY_v1.2.32.md
- Added full implementation notes (this file).

## Validation Checklist

1. Open a play page with side-by-side player + selection layout.
2. Confirm Selections card appears below the video panel.
3. Confirm video panel spans full available horizontal width.
4. Wait for late DOM/style rerenders.
5. Confirm layout remains in video-first stacked order.

## Notes

- Existing transparency hardening remains active.
- Existing download alignment behavior remains active.
- No dependency changes.

