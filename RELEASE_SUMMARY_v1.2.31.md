# RELEASE SUMMARY v1.2.31

Date: 2026-05-10
Repository: mikutellyourworld/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script

## Request Addressed

- Some conditions still produced dark chip backgrounds behind `AV Welfare Website` and `search`.
- Required behavior: force those backgrounds transparent.

## Implementation

### 1) Version synchronization

- @version bumped to 1.2.31.
- SCRIPT_VERSION bumped to 1.2.31.
- File renamed to:
  - xaavv-master-automation-dark-mode-v1.2.31.user.js

### 2) New top-band transparency enforcer

Added function:

- enforceTopLeftBrandAndSearchTransparency()

What it does:

- Runs only on play pages.
- Scans header roots (`.pink-header`, `[role="banner"]`, `header`).
- Detects nodes by:
  - text (`AV Welfare Website`, Chinese welfare text, `search`, Chinese search text),
  - top-band position,
  - wrapper/control proximity.
- Forces transparent background/border/shadow/backdrop for matched nodes and nearest relevant wrappers.

### 3) Recurring enforcement wiring

The new enforcer is called in:

1. startOverlayWatchdog() interval loop.
2. delayedPass() immediate + scheduled follow-ups.
3. MutationObserver callback.

This prevents dark background reappearance after late site rerenders.

## Documentation Updated

1. INSTALLATION_AND_UPDATE_GUIDE.md
- Updated `What's New in v1.2.31` to explicitly cover AV Welfare Website/search transparency control.

2. README.md
- Added v1.2.31 Fix Log entry.
- Updated release summary pointer to v1.2.31.

3. ABOUT.md
- Updated release section to v1.2.31 scope.

4. RELEASE_SUMMARY_v1.2.31.md
- Added full implementation notes (this file).

## Validation Checklist

1. Open play page.
2. Verify `AV Welfare Website` background is transparent.
3. Verify `search` chip/label background is transparent.
4. Wait for late rerenders or interact with page.
5. Confirm those backgrounds stay transparent.

## Notes

- Existing login/register/hamburger transparency hardening remains active.
- Existing download alignment and transparent download background behavior remains unchanged.
- No dependency changes.
