# Download Button Search-Anchor Update 1.2.10

## Goal

Keep the `Download` button from intersecting either header controls or the video surface.

## Changes

1. Anchored button position relative to the page search control.
2. Positioned button directly below search.
3. Added clamp to keep button above the video rectangle (`videoTop - 10px`).
4. Updated button style to match existing XAAVV themed controls:
- Purple background (`#7d71db`)
- Light border (`#c3b7ff`)
- Dark text (`#120f22`)
- Pill radius and compact spacing

## Result

The button appears below search, outside the video area, and visually consistent with the site's button style.

## Files

1. `xaavv-kiro-dark.user.js`
2. `README.md`
3. `DOWNLOAD_BUTTON_SEARCH_ANCHOR_1.2.10.md`
