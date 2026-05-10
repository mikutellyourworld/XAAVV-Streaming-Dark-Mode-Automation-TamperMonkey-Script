# Center Play Overlay Validation (v1.2.5)

## Objective

Validate strict behavior contract on XAAVV play pages:

1. While video is actively playing: no center play button/overlay shown.
2. While video is paused or ended: center play button/overlay visible and clickable.

## Code Changes Introduced In 1.2.5

File updated: `xaavv-kiro-dark.user.js`

1. `syncCenterPlayOverlay` state classifier updated:
- Removed `readyState >= 2` requirement from "playing" detection.
- Primary source of truth: `video.paused` and `video.ended`.
- Fallback source (if site state lags): center button icon text (`❚❚` / `||` vs `▶` / `►` / `play`).

2. `wirePlayPauseBehavior` interaction policy updated:
- Removed forced `preventDefault` / `stopPropagation` playback hijack.
- Kept native site behavior in control.
- Added multi-delay re-sync after click events (`30ms`, `140ms`, `360ms`) for video/button/overlay taps.

## Verification Steps Executed

## URLs

1. `https://www.xaavv.com/xavplay/16d3b4e/1/967.html`
2. `https://www.xaavv.com/xavplay/hn21pq/1/968.html`

## Observations from browser instrumentation

1. Initial paused state shows center play icon and overlay visible/clickable.
2. After click to start playback, the center UI is hidden (visibility hidden and pointer disabled).
3. Hidden state persists after delayed checks (post-click wait windows).

## Environment caveat

In this automated browser environment, media playback reports `NotSupportedError` for source decode, so real decode progression cannot be fully observed. State checks are still validated against DOM/video flags available in-page.

## Manual QA Checklist (Expected in normal browser playback)

1. Open a `/xavplay/...` URL.
2. Start playback.
3. Confirm center play circle is absent while video is active.
4. Pause playback (tap video or pause control).
5. Confirm center play circle appears and is tappable.
6. Tap center play circle.
7. Confirm playback resumes and center circle disappears again.

## Result

Patch 1.2.5 addresses the previous state-misclassification path and hardens re-sync behavior without overriding native site controls.
