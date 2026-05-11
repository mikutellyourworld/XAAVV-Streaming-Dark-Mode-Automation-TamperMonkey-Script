# RELEASE SUMMARY v1.2.29

Date: 2026-05-10
Repository: <REPO_OWNER>/XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script

## Request Addressed

1. Improve visual alignment between search and download on play pages.
2. Make login/register/hamburger backgrounds transparent.
3. Make download button dark background transparent.
4. Document all changes.

## Code Changes

### 1) Version increment and synchronized file naming

- Updated userscript metadata:
  - @version: 1.2.29
  - SCRIPT_VERSION: 1.2.29
- Renamed file:
  - xaavv-master-automation-dark-mode-v1.2.28.user.js
  - -> xaavv-master-automation-dark-mode-v1.2.29.user.js

### 2) Download transparency

In CSS and runtime sync logic, the download button now uses a transparent background on play pages while keeping border/text visible.

- Added play-page CSS rule for #xaavv-video-download-btn with transparent background.
- Added runtime inline style reinforcement in syncVideoDownloadButton() to ensure late UI updates cannot restore dark fill.

### 3) Search/download alignment refinement

- Added findSearchLabel() to detect the visible search text element in the top band.
- Updated syncVideoDownloadButton() to prefer findSearchLabel() over generic search button detection.
- Download horizontal position now aligns using the detected search label's trailing edge model.

### 4) Top-right control transparency hardening

- Existing play-page CSS selectors for top-right auth/menu controls were retained.
- Added runtime hardening in hardenKnownBars() to force transparent backgrounds for top-right interactive elements on play pages.
- This prevents dark chip backgrounds from reappearing after late DOM/style updates.

## Documentation Changes

Updated:

1. README.md
- Added Fix Log entry for v1.2.29.
- Updated documentation snapshot reference to RELEASE_SUMMARY_v1.2.29.md.

2. ABOUT.md
- Updated release section to v1.2.29 with exact transparency/alignment scope.

3. INSTALLATION_AND_UPDATE_GUIDE.md
- Updated "What's New in v1.2.29" section with clear issue/now/technical-change details.

Added:

4. RELEASE_SUMMARY_v1.2.29.md (this file)

## Verification Checklist

1. Play-page top controls
- Login background is transparent.
- Register background is transparent.
- Hamburger background is transparent.

2. Download visual style
- Download background is transparent.
- Download remains readable and clickable.

3. Alignment
- Download is positioned directly under top search area.
- Download trailing text edge appears better aligned with search trailing edge.

4. Version integrity
- Script filename and internal version are both 1.2.29.

## Notes

- No dependency changes were introduced.
- Playback behavior and control wiring remain intact.
- This release targets visual layout/appearance refinements only.

