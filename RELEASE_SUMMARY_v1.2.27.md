# RELEASE SUMMARY v1.2.27

Date: 2026-05-10
Repository: <REPO_OWNER>/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script

## Release Goals

1. Keep play-page top controls visible.
2. Prevent top-bar background overlays from covering video content.
3. Keep script file version and in-file version metadata synchronized.
4. Update repository documentation to reflect this exact iteration.

## What Changed

### 1) Userscript version synchronization

- Old file: xaavv-master-automation-dark-mode-v1.2.24.user.js
- New file: xaavv-master-automation-dark-mode-v1.2.27.user.js
- Userscript header version updated to 1.2.27.
- SCRIPT_VERSION constant updated to 1.2.27.

### 2) Play-page top bar behavior fix

The play-page header handling was tightened so controls remain available while visual overlays are removed.

Before:
- Header/topbar/nav wrappers were being hidden/collapsed on play pages.
- Broad descendant transparency rules could over-apply.

After:
- Top wrappers are visible and interactive on play pages.
- Background flattening is constrained to top-level wrappers and their pseudo-elements.
- Runtime hardening now respects play-page transparency and does not re-darken top wrappers.

### 3) Documentation updates

Updated files:
- README.md
- ABOUT.md
- INSTALLATION_AND_UPDATE_GUIDE.md

Added files:
- RELEASE_SUMMARY_v1.2.27.md (this file)

## File-Level Change Map

1. xaavv-master-automation-dark-mode-v1.2.27.user.js
- Updated version metadata.
- Replaced play-page header hiding rules with top-wrapper transparency rules.
- Added play-page guards in hardenKnownBars to keep wrappers transparent.
- Added nuclear-pass guard for top-level play-page header wrappers.

2. INSTALLATION_AND_UPDATE_GUIDE.md
- Updated script URL and current version references to 1.2.27.
- Rewrote the What is New section so it accurately describes 1.2.27 behavior.

3. README.md
- Updated quick-start script filename to 1.2.27.
- Added fix-log entry for 1.2.27.

4. ABOUT.md
- Updated current file/version to 1.2.27.
- Added 1.2.27 summary notes.

## Verification Checklist

1. Version parity
- Confirm file name includes v1.2.27.
- Confirm userscript header includes @version 1.2.27.
- Confirm SCRIPT_VERSION constant is 1.2.27.

2. UI behavior on play page
- Open a play URL.
- Verify Search, Login, and Register are visible.
- Verify top bar background does not overlay or block video content.
- Verify top controls are clickable.

3. Regression checks
- Verify download button still appears and is usable.
- Verify progress bar behavior is unchanged.
- Verify center play/pause behavior is unchanged.

## Operational Notes

- This release keeps previous playback and overlay systems intact while narrowing header background logic.
- No external dependencies were added.
- No secrets or credentials are included in source or docs.

