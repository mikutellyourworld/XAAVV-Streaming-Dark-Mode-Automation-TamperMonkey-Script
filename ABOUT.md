# About

XAAVV Master Automation and Dark Mode is a Tampermonkey userscript that upgrades XAAVV with a stable dark UI and player automation focused on real-world reliability across both horizontal and vertical videos.

## Current Script

- **Name:** XAAVV Master Automation and Dark Mode
- **File:** `xaavv-master-automation-dark-mode-v1.2.20.user.js`
- **Current Version:** 1.2.20

## What This Script Does

### Interface
- Applies an end-to-end dark theme on XAAVV pages
- Removes bright gradient leaks and white-surface flashes
- Preserves readability and avoids media-breaking CSS filters

### Video Controls
- Adds a floating **Download** button on play pages
  - Handles delayed source initialization with loading state
  - Supports blob and direct media URLs
  - Adapts placement for vertical and horizontal layouts
- Adds an interactive **progress/seek bar**
  - Click-to-seek and pointer-friendly hover behavior
  - Syncs to active playback layer in stacked video layouts
- Adds a click-to-pause invisible overlay while preserving seek usability

### Playback Automation
- Attempts autoplay immediately on load with retry logic
- Uses muted-start autoplay flow with delayed audio restoration
- Works around late-loading media states (`loadedmetadata`, `loadeddata`, `canplay`, `canplaythrough`)

### Routing & Sync
- Converts intermediate detail clicks into direct play-route navigation
- Keeps center controls and overlays synchronized with real playback state
- Handles dual-layer/stacked XAAVV video rendering safely

### QoL
- Optional unobtrusive translation bootstrap for English-first reading
- Removes persistent top-left spinner artifacts

## Supported Domains

- `*.xaavv.com`
- `*.xaavv.live`

## Design Principles

1. **Player-safe first**: never break native playback behavior.
2. **Resilient timing**: tolerate delayed DOM/media initialization.
3. **Minimal intrusion**: overlays and controls do not block key interactions.
4. **Layout-aware behavior**: adapt controls for vertical and horizontal videos.
5. **Operational clarity**: versioned script header and file-level version marker.

## Key Documentation

- [README.md](README.md) - changelog and project overview
- [INSTALLATION_AND_UPDATE_GUIDE.md](INSTALLATION_AND_UPDATE_GUIDE.md) - install/update flow
- [TROUBLESHOOTING_v1.2.13.md](TROUBLESHOOTING_v1.2.13.md) - diagnostics and fixes

### v1.2.21 (UI Polish)
- Download button never overlaps or covers the search link; always below and right-aligned to search bar on play pages.
- Top bar (header, search, login, register) is now fully transparent and non-blocking on play pages.
- All changes are documented in the userscript source code and this file.