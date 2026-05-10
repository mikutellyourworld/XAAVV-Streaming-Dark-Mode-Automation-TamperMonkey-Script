# RELEASE SUMMARY v1.2.30

Date: 2026-05-10
Repository: mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script

## User Request

- Make dark backgrounds behind login/register/hamburger fully transparent on play pages.
- Keep behavior stable if the site re-renders those controls after script load.

## Implementation Summary

### 1) Version synchronization

- Userscript @version bumped to 1.2.30.
- SCRIPT_VERSION constant bumped to 1.2.30.
- Script file renamed to:
  - xaavv-master-automation-dark-mode-v1.2.30.user.js

### 2) CSS selector hardening

Expanded play-page transparency selectors to include chip-class variants often used by top auth controls:

- .pink-btn
- .pink-btn-primary

This ensures class-driven chip backgrounds are forced transparent on play pages.

### 3) Runtime transparency hardening

Added a dedicated function:

- enforceTopRightControlTransparency()

What it does:

- Scans header roots on play pages (.pink-header, [role="banner"], header).
- Finds top-right chip-like containers and controls (a/button/role=button/div/nav/ul).
- Forces background, border, shadow, and backdrop filters to transparent/none.

Why this was needed:

- Site-side late style updates can reapply dark backgrounds after initial CSS and one-time passes.
- Recurring runtime enforcement keeps controls transparent reliably.

### 4) Integration points

enforceTopRightControlTransparency() is now called in:

1. startOverlayWatchdog() interval loop.
2. delayedPass() immediate and scheduled follow-up passes.
3. MutationObserver callback.

This gives persistent enforcement across load, rerender, and mutation cycles.

## Documentation Updated

1. README.md
- Added v1.2.30 fix-log entry.
- Updated release-summary pointer to v1.2.30.

2. ABOUT.md
- Updated release section to v1.2.30 and described transparency hardening.

3. INSTALLATION_AND_UPDATE_GUIDE.md
- Corrected version synchronization note to 1.2.30.

4. RELEASE_SUMMARY_v1.2.30.md
- Added detailed implementation + validation notes (this file).

## Validation Checklist

1. Open a play page.
2. Confirm login, register, and hamburger have transparent backgrounds.
3. Trigger UI rerender actions (pause/play, resize, wait for dynamic updates).
4. Confirm backgrounds remain transparent afterward.
5. Confirm download control and playback features still function.

## Notes

- This release focuses only on persistent visual transparency hardening for top-right play-page controls.
- No dependency changes.
- No sensitive data added.
