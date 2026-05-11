# XAAVV Script Reliability Diagnosis and Fix (v1.2.37)

## Goal

Diagnose intermittent reliability behavior and ship a robust fix with clear verification and maintenance guidance.

---

## Symptoms Reported

1. Script behavior was intermittent across navigation states.
2. Search/localization and UI hardening were not always consistently applied after route transitions.
3. Tampermonkey status could show script not yet active in some tab states until a reload.

---

## Diagnosis Summary

Primary reliability gap identified in runtime lifecycle handling:

1. The script had strong initial-load and mutation-based maintenance.
2. Some route transitions can occur through SPA-style URL changes (`history.pushState`, `history.replaceState`) where timing and mutation patterns are not always consistent.
3. Recovery passes were not explicitly tied to URL-change events.
4. Repeated recovery cycles risked duplicate observer wiring for playback-assist logic.

Result:

- Features could appear unreliable after in-app navigation transitions unless a hard reload occurred.

---

## Root Cause

The script lacked a dedicated navigation-state reliability layer that:

1. Detects URL changes in all navigation paths.
2. Re-runs feature maintenance passes deterministically after route changes.
3. Guards observer setup against duplicate registration.

---

## Fix Implemented in v1.2.37

### 1) Navigation watchdog added

Implemented `startNavigationReliabilityWatchdog()` to detect and react to URL changes via:

1. `history.pushState` patch hook.
2. `history.replaceState` patch hook.
3. `popstate` event.
4. `hashchange` event.
5. Fallback URL polling interval.

On detected URL change, it now runs a short stabilization burst:

1. Immediate maintenance pass.
2. Follow-up scheduled passes at 120ms, 420ms, and 1000ms.
3. Redirect re-checks for intermediate detail pages on the same timing burst.

### 2) Idempotent playback observer guard

Added `PLAYBACK_ASSIST_BOUND_ATTR` guard in `setupPlaybackAutomationAssist()` so observer wiring occurs once and does not duplicate under repeated recovery cycles.

### 3) Unified maintenance execution

Introduced `runMaintenancePass()` and reused it in mutation observer and route recovery logic to keep behavior consistent across initialization paths.

---

## Files Updated

1. `xaavv-master-automation-dark-mode-v1.2.37.user.js`
- Version bump and runtime reliability hardening.

2. `README.md`
- Added v1.2.37 reliability release note and new script filename.

3. `INSTALLATION_AND_UPDATE_GUIDE.md`
- Updated to v1.2.37 and documented reliability-specific behavior.

---

## Verification Procedure

Use this test sequence after installing v1.2.37:

1. Open XAAVV home page and confirm script initializes.
2. Navigate using in-site links (not manual full reload) to:
- Detail page (`/xaavv/<slug>.html`)
- Play page (`/xavplay/<slug>/...`)
- Search page (`/search/<english-query>`)
3. Confirm search localization still rewrites English queries to one ranked localized term.
4. Confirm top-bar and play-page UI hardening is applied after each route transition.
5. Repeat in-app navigations rapidly and verify features remain active without needing reload.

---

## Operational Notes

1. This fix improves reliability after route transitions but does not override Tampermonkey extension-level state (for example, disabled script, delayed extension startup, or extension permissions).
2. If Tampermonkey indicates script has not run in a tab, a hard refresh remains a valid recovery step for extension startup timing.

---

## Next Improvements (Optional)

1. Add optional debug mode flag to log URL-change detections and maintenance pass reasons.
2. Add lightweight health marker in DOM showing last maintenance timestamp for quick diagnostics.
3. Add a minimal local regression checklist script for route-transition reliability.

---

## Status

- Diagnosis completed.
- Fix implemented and versioned in v1.2.37.
- Documentation completed for handover and future maintenance.
