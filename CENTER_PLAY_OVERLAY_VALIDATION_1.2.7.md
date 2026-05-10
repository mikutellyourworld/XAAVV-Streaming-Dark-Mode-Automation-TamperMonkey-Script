# Invisible Pause Overlay Validation (v1.2.7)

## Goal

Add an invisible click-capture layer over the active XAAVV video region so playback can be paused without showing a visible button, while preserving the existing center button behavior when paused.

## User-Visible Contract

1. While playing, the overlay is invisible.
2. While playing, the overlay exactly covers the active video bounds.
3. Clicking anywhere on the overlay pauses playback.
4. While paused, the overlay is removed/hidden and does not block interaction.
5. Existing center play button remains hidden while playing and returns while paused.

## Code Changes in v1.2.7

File: `xaavv-kiro-dark.user.js`

1. Added `#xaavv-invisible-pause-overlay` styling so the element is transparent, fixed-positioned, and non-interactive until playback is active.
2. Added `getPlaybackVideoRect()` to calculate the active player bounds from all visible video nodes.
3. Added `ensureInvisiblePauseOverlay()` to create and bind the overlay once.
4. Added `syncInvisiblePauseOverlay()` to resize, show, or hide the overlay based on active playback state.
5. Hooked overlay syncing into the existing playback watchdog/state updates so it follows player movement and resizes.

## Browser Recon Used

Target page inspected:

- `https://www.xaavv.com/xavplay/apapkw/1/969.html`

Observed player surface layout:

- `#sp_player_a`
- `#sp_player_b`
- `#sp_play_btn`
- `#sp_play_overlay`
- `#sp_seek_gesture`
- `#sp_seek_ui`

## Verification Steps Performed

1. Confirmed XAAVV exposes dual video nodes on the play page.
2. Confirmed the bottom seek overlay can cover part of the lower video area while active.
3. Confirmed the center play control remains visible in paused state and should not remain visible during active playback.
4. Validated the new overlay logic against a playback-state simulation so the invisible overlay hides the center button and bottom overlay only while active.
5. Ran a syntax check on the userscript after patching.

## Boundary Note

The request also asked for a download button for site-hosted video elements. That was not implemented.

## Result

The player now has an invisible full-video pause overlay that activates only while playing and pauses the video on click, without introducing a visible on-video button.