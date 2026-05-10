# Center Overlay + Bottom Box Validation (v1.2.6)

## Scope

Address two regressions reported on XAAVV play pages:

1. Center play/pause button visible while video is actively playing.
2. Bottom seek/gesture box covering part of the video frame.

## Browser Recon Steps Performed

1. Opened and inspected target playback URLs:
- `https://www.xaavv.com/xavplay/16d3b4e/1/967.html`
- `https://www.xaavv.com/xavplay/hn21pq/1/968.html`

2. Enumerated player DOM and overlay layers, including ID-level mapping:
- `#sp_play_btn`
- `#sp_play_overlay`
- `#sp_play_hotspot`
- `#sp_seek_gesture`
- `#sp_seek_ui`
- `#sp_player_wrap`
- `#danmu_layer`

3. Confirmed bottom blocking element source:
- Bottom covering box comes from seek overlay layers (`#sp_seek_gesture` and `#sp_seek_ui`) in active playback layout.

4. Confirmed state mismatch risk:
- XAAVV uses multiple video nodes (`#sp_player_a`, `#sp_player_b`), so relying on a single `querySelector('video')` can misclassify active playback state.

## Source Changes Applied (v1.2.6)

File: `xaavv-kiro-dark.user.js`

1. Playback classifier hardened for dual video layers:
- Collect all video nodes.
- `isPlayingByVideo = any(video !paused && !ended)`.
- `isPausedByVideo = all(video paused || ended)`.
- Keep button-icon fallback for delayed UI updates.

2. Center play overlay enforcement kept strict:
- Playing => hide `#sp_play_hotspot`, `#sp_play_btn`, `#sp_play_overlay`.
- Paused/ended => restore center controls visible and clickable.

3. Bottom blocking overlay suppression added:
- Playing => hide `#sp_seek_gesture`, `#sp_seek_ui` (display/visibility/opacity/pointer-events).
- Paused/ended => remove forced styles so native behavior can return.

4. Event wiring expanded to all video nodes:
- Click re-sync listeners now bind across all `video` elements, not only the first one.

## Iteration and Verification Log

1. Baseline check:
- Reproduced visible center pause button while play-state UI showed active playback.
- Reproduced bottom overlay layer covering lower video area.

2. Patch iteration 1:
- Introduced multi-video classifier and bottom-overlay handling in `syncCenterPlayOverlay`.

3. Patch iteration 2:
- Extended click sync binding from first video to all videos.

4. Post-patch checks:
- Re-ran browser DOM inspection for target pages and validated selectors remain present and controllable.
- Re-ran script syntax check (`node --check`) with no errors.

## Environment Caveat

Browser-tool environment may reject actual media decoding (`NotSupportedError`) for some sources, so runtime playback progression can be limited in automation. Validation therefore includes deterministic DOM/state checks plus selector-level overlay suppression verification.

## Expected Runtime Contract (Manual Browser)

1. Start playback on `/xavplay/...` page.
2. Confirm center play control is not visible.
3. Confirm bottom seek box does not block video while playing.
4. Pause playback.
5. Confirm center play control appears and remains clickable.
6. Resume playback via center control.
7. Confirm center control and bottom box are hidden again during active playback.
