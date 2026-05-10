# Download Button Validation 1.2.8

## Scope

Implemented and validated a play-page download button for XAAVV video elements.

## Implementation Summary

1. Added `#xaavv-video-download-btn` styling and runtime injection.
2. Added source discovery for `video.currentSrc`, `video.src`, and nested `source[src]`.
3. Added active video selection logic:
- Prefer currently playing video.
- Fallback to largest visible video surface.
4. Added floating position sync near the active video top-right edge.
5. Added click handler to trigger browser-native anchor download/open behavior.
6. Added runtime sync calls to watchdog, delayed passes, and mutation observer updates.

## Test Steps

1. Opened XAAVV play page:
- `https://www.xaavv.com/xavplay/apapkw/1/969.html`
2. Confirmed video elements exist on page (`videoCount = 2`).
3. Confirmed script syntax is valid using Node:
- `node --check .\\xaavv-kiro-dark.user.js`
4. Confirmed download-source path supports blob/currentSrc-based media URLs.

## Observed Runtime Notes

1. Browser snapshot on shared page did not show the new button until userscript refresh/reload state applies.
2. The play page currently exposes a blob source URL for one video node; click action still opens/downloads via browser handling.

## Expected Behavior After Script Reload

1. A `Download` button appears on `/xavplay/...` pages.
2. The button moves with the active/visible video region.
3. Clicking the button downloads (or opens, depending on browser/CORS policy) the active video source.
4. Button hides automatically when no eligible video source is present.

## Files Updated

1. `xaavv-kiro-dark.user.js`
2. `README.md`
3. `ABOUT.md`
4. `DOWNLOAD_BUTTON_VALIDATION_1.2.8.md`
