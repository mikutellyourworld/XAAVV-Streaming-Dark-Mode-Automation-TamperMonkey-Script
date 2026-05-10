# Site Automation Template (Darkening + Playback Automation + Direct Play + Translation)

## Purpose

Reusable template for applying the same outcomes delivered in this project:

1. Dark mode hardening without breaking media.
2. Optional direct-play routing to skip intermediate pages.
3. Optional playback automation assist on play pages.
4. Optional automatic translation with hidden translator chrome.

## Scope Checklist

- Target domains:
- Detail/intermediate path patterns:
- Final play path patterns:
- Video player signatures (`id`, classes, wrappers):
- Translation target language:
- UI constraints (no gradients, no bright corners, etc.):

## Module A: Dark Mode Hardening

1. Inject CSS at document-start.
2. Set root/base backgrounds and text colors.
3. Remove gradients from non-media surfaces.
4. Harden pseudo-elements (`::before`, `::after`).
5. Run computed-style pass for late-loaded inline styles.
6. Keep media elements exempt.

### Acceptance

- No white artifacts in header/content/footer/corners.
- Controls remain readable.
- Video visibility unaffected.

## Module B: Player Safety Layer

1. Define a player subtree matcher (`#player`, `.video-js`, etc.).
2. Exempt subtree from blanket color/gradient flattening.
3. Remove previously injected inline overrides on player subtree.
4. Keep danmu/overlay layers transparent and non-blocking where needed.

### Acceptance

- Inline and fullscreen playback both visible.
- Player controls remain usable.

## Module C: Direct-Play Routing (Skip Intermediate)

1. Detect intermediate page paths (e.g., `/xaavv/{id}.html`).
2. Try in-page play link extraction (`a[href*='/xavplay/']`).
2.1. Try slug-specific extraction (`/xavplay/{slug}/`) when slug is known from path.
3. Fallback: fetch intermediate HTML and regex extract `/xavplay/...` URL.
4. Intercept homepage/search result clicks to pre-resolve and route directly.
5. Add repeated delayed checks after load for late-mounted DOM links.

### Safety

- Respect modified clicks (`ctrl`, `cmd`, middle click).
- Fallback to original navigation if extraction fails.

## Module D: Playback Automation Assist

1. On play paths, find existing `video` nodes.
2. Attempt muted automated playback start with retries (`canplay`, timeout windows).
3. Observe DOM mutations and wire late-created video nodes.
4. Restore previous muted/volume state after successful start.

### Acceptance

- Playback starts automatically when browser policy allows.
- No user-visible breakage if automated playback start is blocked.

## Module D2: Center Overlay Behavior

1. Identify center play elements (hotspot/button/overlay IDs or classes).
2. On active playback (`play/playing`), hide center overlays.
3. On `pause/ended/waiting`, restore overlay visibility.
4. Re-wire after DOM mutations for SPA player rebuilds.

### Acceptance

- No obstructive center circle while video is actively playing.
- Overlay remains available when paused (if site expects that behavior).

## Module E: Translation Without Top Bar

1. Set translation cookie for desired language.
2. Load translation runtime once.
3. Hide translator banner/spinner/tooltips via CSS + runtime cleanup.
4. Force `body/html top` offset back to zero.

### Acceptance

- Page text translated.
- No visible translator top toolbar.

## Module F: Artifact Cleanup

1. Add targeted removal for top-left spinner/ring overlays.
2. Match by location + size + spinner animation/border-ring traits.
3. Include SVG/circle loader detection (small animated rings near top-left).
4. Re-run cleanup after dynamic mutations.

## Validation Matrix

1. Homepage: dark surfaces + click routing.
2. Intermediate page: auto redirect to play page.
3. Play page: video visibility + playback automation behavior.
4. Translation: language switched, no toolbar UI.
5. Header corners/left top: no gradient/fade/swirl artifacts.

## Do / Do Not

Do:

- Keep modules isolated and configurable.
- Exempt media/player layers from blanket style mutations.
- Use retry windows for late-initialized components.

Do Not:

- Apply universal CSS resets to every element in player subtree.
- Assume one selector catches all gradients/overlays.
- Add downloader features for protected/copyrighted media.

## Release Checklist

1. Update version and changelog.
2. Syntax-check userscript.
3. Validate matrix above.
4. Push commit and include rollback notes.
