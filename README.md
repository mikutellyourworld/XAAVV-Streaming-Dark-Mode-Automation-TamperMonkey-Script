# XAAVV Dark Mode + Automation (Tampermonkey)

A focused Tampermonkey userscript that applies a professional dark interface to XAAVV pages without changing page behavior, player controls, or media rendering.

## Features

- Professional dark palette with purple accent highlights
- Works on current and future XAAVV subdomains
- Avoids global inversion/filter tricks that can break images and video
- Keeps forms, navigation, cards, and buttons readable
- Preserves player controls and interaction behavior
- Adds dynamic safety passes to catch late-loaded white surfaces
- Hardens fixed/sticky top bars to prevent white-on-white text issues
- Explicitly forces dark header/banners and brand logo text contrast on XAAVV
- Forces top and bottom site bars to match the page background tone
- Adds a play-page video download button that tracks the active/visible video
- Adds an interactive video progress/seek bar with time tracking on vertical videos

## Supported Match Rules

- `*://www.xaavv.live/*`
- `*://xaavv.live/*`
- `*://*.xaavv.live/*`
- `*://www.xaavv.com/*`
- `*://xaavv.com/*`
- `*://*.xaavv.com/*`

## Install

1. Install Tampermonkey.
2. Create a new userscript.
3. Replace the default content with `xaavv-master-automation-dark-mode-v1.2.42.user.js`.
4. Save and refresh XAAVV pages.
5. Optional: load a local/private dictionary payload into `localStorage` key `xaavv-search-dictionary-private-v1` if you want to override or extend the built-in search-localization baseline.

## Validation Notes

Checked against:

- `https://xaavv.com/` (homepage header/logo contrast fix)
- `https://xaavv.com/xaavv/11h7cm.html` (detail page, `.com` domain)
- `https://www.xaavv.live/` (homepage)
- `https://www.xaavv.live/xaavv/18qf36y.html` (detail page)
- `https://www.xaavv.live/xavplay/18qf36y/1/51954.html` (player page)

## Fix Log

- `1.2.42`: Search-localization baseline restored in-script. The public userscript now ships with an embedded dictionary baseline, still merges optional local/private overrides from `localStorage`, and prefers localized variants over unchanged English aliases when rewriting recognized search terms.
- `1.2.41`: Search-localization hot-reload fix. The script now re-reads the private dictionary payload from `localStorage` instead of snapshotting it only at startup, and logs a sanitized diagnostic message when English search rewrites are attempted without the private payload present.
- `1.2.40`: Search-localization sequencing hardening update. Repeated identical search attempts now advance dictionary rotation exactly once per attempt while preserving ranked order from the private dictionary payload.
- `1.2.39`: Removed the homepage tagline line (including translated English variant text) and added runtime re-hide passes so it stays removed after dynamic page updates.
- `1.2.38`: Public dictionary disclosure sanitation release. Removed explicit dictionary term inventories from repository code/docs and switched public script to local-only dictionary loading (`localStorage` private payload). Added repository disclosure policy to keep term-level dictionary data out of public commits.
- `1.2.37`: Reliability hardening update. Added a navigation watchdog to re-run localization/UI maintenance after SPA-style URL changes (`pushState`, `replaceState`, `popstate`, `hashchange`, plus periodic fallback polling). Added idempotent guard for playback-assist observer wiring to prevent duplicate observers during re-sync cycles.
- `1.2.36`: Expanded localization dictionary coverage and improved ranking behavior. Public documentation intentionally omits term-level dictionary details.
- `1.2.35`: Updated search localization to resolve each English query into a single target-language search term (instead of multi-term expansion). Repeated searches of the same English key can rotate through ranked fallback variants to improve coverage without over-broad query strings.
- `1.2.11`: Added an interactive video progress/seek bar overlay on play-page videos. The bar displays current time as a filled segment, allows seeking by clicking, and includes a draggable handle that appears on hover. Themed with purple accent colors.
- `1.2.10`: Moved the `Download` button to sit below the search control and clamped it above the video frame so it does not overlap content; updated visual styling to match existing XAAVV button theme.
- `1.2.9`: Fixed download-button placement so it anchors inside the video area with a safe top offset, preventing overlap with header navigation buttons (login/register/menu).
- `1.2.8`: Added a floating play-page `Download` button for video elements. The button auto-tracks the best active/visible video source, follows player bounds, and triggers browser-native download/open behavior with a generated filename.
- `1.2.7`: Added an invisible full-video pause overlay that tracks the active video bounds and pauses playback on click while keeping the control invisible; updated player-state syncing so the overlay only exists during active playback.
- `1.2.6`: Fixed playback-state detection to evaluate all player video nodes (XAAVV dual-layer video layout), ensuring center play control is hidden during active playback; additionally hides bottom seek overlay box (`#sp_seek_gesture`, `#sp_seek_ui`) while playing so it does not block the video.
- `1.2.5`: Fixed center play-overlay state classification to rely on authoritative video paused/ended state (with button-icon fallback) instead of `readyState`; reduced click-handler invasiveness so native site handlers remain in control while overlay state re-syncs after interactions.
- `1.2.4`: Reworked center pause/play behavior into an authoritative controller: video click toggles pause/play, center button/overlay click toggles play/pause, center controls are visible+clickable when paused, and fully hidden while actively playing; added small safe trim via shared `schedule(fn, delays)` helper.
- `1.2.3`: Strengthened center play/pause overlay suppression with a continuous watchdog on play pages; now hides `#sp_play_hotspot`, `#sp_play_btn`, and `#sp_play_overlay` whenever playback is inferred either by video state or pause-icon state (`❚❚`).
- `1.2.2`: Added playback-state handling for center play UI (`#sp_play_hotspot`, `#sp_play_btn`, `#sp_play_overlay`) so the center circle is hidden while video is actively playing and restored on pause/end.
- `1.2.1`: Improved intermediate-page bypass reliability (`/xaavv/{slug}.html` -> `/xavplay/{slug}/...`) using inline DOM extraction + repeated timed redirect attempts; added dedicated `.sp-play` and `#sp_player_wrap` dark background hardening to remove purple side gutters; expanded top-left swirl cleanup to catch small SVG/circle ring loaders.
- `1.2.0`: Added direct play-page routing (skip `/xaavv/...` intermediates by fetching and extracting `/xavplay/...` target), playback automation assist on play pages, and runtime removal for top-left spinner/swirl overlays.
- `1.1.10`: Kept automatic English translation while hiding Google Translate toolbar/banner/spinner UI and forcing page top offset back to `0`; added extra suppression for fixed spinner/loader ring overlays in the top-left.
- `1.1.9`: Added stronger player visibility recovery by resetting dark-mode inline overrides on player subtree (`#player`, `.video-js`, `vjs-*`, `#danmu_layer`) and enabled automatic English translation mode via Google Translate initialization/cookie.
- `1.1.8`: Added player-safe exclusions to preserve video visibility and controls (`#player`, `.video-js`, `vjs-*`, `#danmu_layer`) and removed unsafe blanket transparent-wrapper background forcing that could dim/cover playback layers.
- `1.1.7`: Removed persistent white header-edge fades by hard-disabling gradient overlay elements in the top bar and flattening header/banner masks, pseudo-elements, and decorative absolute fade blocks.
- `1.1.6`: Enforced strict no-gradient rendering for buttons/chips/tags (including `::before`/`::after`) and removed button glow so no gradient-like shine remains visible.
- `1.1.5`: Removed all remaining script-added gradients (including button gradients) and enforced solid-color mode globally so any white/gradient background is flattened to the same base color (`#121520`).
- `1.1.4`: Switched to uniform-background mode so all white boxes/corners/gradient panels are flattened to the same main background color (`#121520`), including pseudo-elements and fixed/sticky overlays.
- `1.1.3`: Removed remaining white corner gradients and gradient whites using aggressive selector matching (`.from-white`, `.to-white`, `[style*='gradient']`) and JS gradient string replacement to convert `#fff`, `#ffffff`, and `rgb(255,255,255)` endpoints to dark colors.
- `1.1.2`: Unified top banner and footer (`© 2026 ... SiteMap`) to the same base background tone as the page, plus explicit bar hardening pass.
- `1.1.1`: Added targeted `.pink-header` and `[role='banner']` overrides so `AV福利网` text cannot render white on pale/white header backgrounds.

## Dark Moding Skill

Operational guidance, postmortem misses, and prevention checklist are documented in [DARK_MODING_SKILL.md](DARK_MODING_SKILL.md).

## Search Localization Skill

Generic, reusable guidance for English-to-foreign-language query localization via a stacked search dictionary is documented in [FOREIGN_LANGUAGE_SEARCH_LOCALIZATION_SKILL.md](FOREIGN_LANGUAGE_SEARCH_LOCALIZATION_SKILL.md).

## Dictionary Expansion Process

Public dictionary documentation is intentionally high-level only. See [DICTIONARY_EXPANSION_PROCESS_v1.2.42_2026-05-11.md](DICTIONARY_EXPANSION_PROCESS_v1.2.42_2026-05-11.md) and [DICTIONARY_DISCLOSURE_POLICY.md](DICTIONARY_DISCLOSURE_POLICY.md).

## Steps Taken (Chronological)

1. Added broad dark baseline at document-start so initial paint is not white.
2. Expanded `@match` coverage for `.live`, `.com`, and wildcard subdomains.
3. Added computed-style "nuclear pass" to fix late-loaded white elements.
4. Hardened top banner and footer so logo/text stayed readable.
5. Added gradient detection/replacement for inline and utility-class gradients.
6. Switched to uniform background mode (`#121520`) to remove corner artifacts.
7. Removed remaining gradients from buttons/chips and pseudo-elements (`::before`/`::after`).
8. Added translation-without-toolbar mode (auto English + hidden Google UI frame/spinner).
9. Added player-safe style resets to recover video visibility on inline playback.
10. Added direct-play routing logic to skip detail intermediates when opening content.
11. Added playback automation assist for play pages by wiring late-created video nodes.
12. Added targeted top-left swirl/loader cleanup pass.
13. Added play-layout (`.sp-play`) side-gutter background hardening for full-width/vertical player variants.
14. Upgraded intermediate redirect with multi-stage extraction (DOM link, slug-specific link, inline HTML regex, fetch fallback) and repeated timed retries.
15. Upgraded swirl cleanup to include small top-left animated SVG ring detection.

## Execution Notes For Latest Request

1. Examined homepage, intermediate detail page, and play page variants mentioned by URL.
2. Verified intermediate page contains direct playable URL (`/xavplay/16d3b4e/1/967.html`) and used that for deterministic redirect extraction.
3. Added repeated redirect checks after load to cover late-rendered content.
4. Added explicit dark background rules for `sp-play` wrappers to eliminate purple side panels.
5. Added stronger top-left swirl removal for ring-like SVG/circle loaders.

Note: Browser-based DOM inspection and interaction tooling was used to validate dynamic page behavior and selector coverage.

## Comprehensive Documentation Snapshot

The following project documents were reviewed/updated as part of this workstream:

1. `xaavv-dark-theme.user.js`
	- Core implementation: dark mode, player safety, direct routing, playback automation, translation UX cleanup, swirl removal, center overlay behavior.
2. `README.md`
	- Full changelog (`1.1.1` through `1.2.7`), chronology, constraints, and latest execution notes.
3. `DARK_MODING_SKILL.md`
	- Reusable skill guidance: do/don't patterns, misses, prevention checklist.
4. `SITE_AUTOMATION_TEMPLATE.md`
	- Generic template for darkening + playback automation + skip-intermediate + translation workflows.
5. `CENTER_PLAY_OVERLAY_VALIDATION_1.2.6.md`
	- Browser recon + iteration log for center control and bottom seek-overlay blocking fix.
6. `CENTER_PLAY_OVERLAY_VALIDATION_1.2.7.md`
	- Added invisible pause-overlay recon, implementation notes, and verification steps.
7. `ABOUT.md`
	- Short repo summary with the current player-overlay behavior and explicit request boundary.

Current request status:

1. Intermediate skip to `/xavplay/...`: implemented.
2. Purple side background on play variants: implemented.
3. Top-left swirl removal: implemented with stronger detection.
4. Center circle hidden while playing and restored while paused: reinforced through `1.2.7` with multi-video state detection.
5. Invisible full-video pause overlay: implemented for active playback.
6. Download button: implemented in `1.2.8` for play pages.

Latest control-state status (`1.2.7`):

1. Click video while playing -> pauses video.
2. While paused -> center control appears and is clickable.
3. Click center control while paused -> plays video.
4. While actively playing -> center control is hidden.
5. While actively playing -> bottom seek overlay box is hidden so it cannot cover the lower video area.
6. While actively playing -> invisible overlay matches the active video bounds and pauses on click.

## Browser Recon Notes

Applied browser recon workflow in this session by:

1. Enumerating and inspecting all mentioned URLs (homepage, intermediate detail pages, and play pages).
2. Mapping DOM nodes for overlays/spinners and extracting exact element IDs/classes.
3. Validating route relationships (`/xaavv/{slug}.html` -> `/xavplay/{slug}/...`).
4. Re-validating behavior after each patch cycle.

## Do / Do Not Do

Do:

- Use one base background color (`#121520`) for all non-media surfaces.
- Remove gradients both in CSS and in runtime computed-style pass.
- Include pseudo-elements in hardening rules (`::before` and `::after`).
- Keep media (video/img/canvas/iframe) untouched.
- Validate on homepage, detail page, and player page for both `.com` and `.live`.

Do Not:

- Re-introduce `linear-gradient` or `radial-gradient` on UI surfaces.
- Assume class-based overrides alone are enough; inline styles and pseudo-elements must be handled.
- Leave transparent wrappers untouched when they reveal bright parent backgrounds.
- Keep decorative glow/shadow that looks like gradient shine when user requested flat UI.

## What Went Wrong (Postmortem)

- I initially preserved some decorative gradients while trying to keep a polished dark look.
- I over-focused on container backgrounds first and missed a gradient-like visual artifact on button/chip surfaces.
- I should have switched to strict no-gradient mode earlier after your explicit requirement.

## Finished Product Expectations

The finished product is considered acceptable only when all conditions are true:

1. No visible white boxes or white corners on any tested XAAVV page.
2. No visible gradients on UI surfaces when no-gradient mode is requested.
3. Header, content body, side areas, and footer share the same base dark background tone.
4. Text remains readable and controls remain functional.
5. Player/media rendering remains unaffected.

Host probe results at time of creation:

- `www.xaavv.live`: HTTP 200
- `xaavv.live`: HTTP 503
- `m.xaavv.live`, `api.xaavv.live`, `img.xaavv.live`: not resolvable

Wildcard `*.xaavv.live` is included for forward compatibility.

## Safety Approach

- No network requests and no invasive DOM rewrites
- Scoped style corrections only for contrast failures
- Observer is debounced and style-only
- Explicitly avoids touching media element filters
- Download control is scope-limited to XAAVV play pages and current visible video elements only

## Request Boundary

- Download-button functionality for site-hosted videos is implemented in this repository for XAAVV play pages.
- Existing behavior remains: playback automation, direct-play routing, translation UI cleanup, dark-mode hardening, and visibility fixes.

## Reusable Future Template

For applying this pattern to similar websites, use [SITE_AUTOMATION_TEMPLATE.md](SITE_AUTOMATION_TEMPLATE.md).

## Trim Rollback Guide

For reverting only trim/refactor changes (without undoing behavior fixes), see [TRIM_ROLLBACK_README.md](TRIM_ROLLBACK_README.md).

## Architecture

- CSS baseline at document-start for initial paint
- JS computed-style safety pass for late inline styles
- MutationObserver with debounce to handle SPA updates
- Follow-up passes at 500ms, 1500ms, and 3000ms

## License

MIT
