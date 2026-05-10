# About

This repository contains a Tampermonkey userscript for XAAVV playback enhancement and dark-mode styling.

## Current Features (v1.2.11)

### Visual & Styling
- Professional dark-mode interface on all XAAVV pages
- No gradients or white-surface leaks
- Consistent dark palette applied to headers, footers, and content
- Automatic light/dark theme detection support

### Video Playback Controls
- **Interactive Progress Bar**: Visual seek bar overlay at the bottom of each video
  - Displays current playback time as a filled segment
  - Click anywhere to seek to that timestamp
  - Draggable handle appears on hover
  - Real-time updates during playback
- **Automatic Pause Overlay**: Invisible full-video overlay that pauses on click during active playback
- **Download Button**: Floating control below search that triggers browser download for active video source
- **Playback Automation**: Auto-plays video on play pages with volume restoration

### Navigation & Routing
- Direct play-page routing (skip intermediate detail pages)
- Automatic redirect from `/xaavv/{slug}.html` to `/xavplay/{slug}/...`
- Click-through route interception for seamless navigation

### Player State Synchronization
- Center play/pause control visibility tied to video playback state
- Hides on playback, shows on pause
- Multi-video layout support (handles dual-layer video scenarios)
- Seek overlay management

### User Experience
- Unobtrusive Google Translate integration (auto English, hidden toolbar)
- Top-left spinner/loader cleanup
- Translation text highlight artifact removal
- Player controls preservation (no filter tricks that break media)

## Supported Sites

- `*.xaavv.com`
- `*.xaavv.live`

## Installation

1. Install Tampermonkey browser extension
2. Create new userscript from `xaavv-dark-theme.user.js`
3. Save and refresh XAAVV pages

## Architecture

- **CSS Baseline** (document-start): Initial dark paint before JS
- **Nuclear Pass**: Computed-style overrides for late-loaded white elements
- **Mutation Observer**: Handles SPA updates and dynamic content
- **Watchdog Intervals**: Continuous state sync every 220ms on play pages
- **Scheduled Passes**: Additional updates at 300ms, 1200ms, 2600ms

## Documentation

- [README.md](README.md) - Full changelog and implementation details
- [DARK_MODING_SKILL.md](DARK_MODING_SKILL.md) - Reusable dark-mode patterns and best practices
- [VIDEO_PROGRESS_BAR_1.2.11.md](VIDEO_PROGRESS_BAR_1.2.11.md) - Progress bar implementation details

## Key Design Principles

1. **Non-invasive**: Preserves native player controls and interaction
2. **Player-safe**: Never touches media element filters or rendering
3. **Performant**: Debounced observers, scheduled passes, no continuous polling
4. **Responsive**: Updates dynamically as DOM changes
5. **Accessible**: Maintains keyboard and touch interactions

## Browser Compatibility

- Chrome/Edge (Tampermonkey)
- Firefox (Tampermonkey)
- Safari (Tampermonkey)
- Any browser with Tampermonkey support

## Safety Notes

- No network requests beyond page load
- No storage access or cookies written
- Local DOM manipulation only
- No invasive global overrides
- Video download uses browser-native download mechanism