# Dark Moding Skill (XAAVV Case)

## Goal

Deliver a true dark UI where all non-media surfaces are dark, readable, and behavior-safe.

## Definition of Done

1. No visible white boxes or white corner artifacts.
2. No visible gradients when user requests flat/solid mode.
3. Header, body, side gutters, and footer share a consistent base tone.
4. Controls remain usable and readable.
5. Media rendering is unaffected.

## Workflow

1. Start with document-start CSS baseline (`html`, `body`, root app wrappers).
2. Add targeted hardening for known bars (`header`, banner, footer).
3. Add gradient removal selectors (`bg-gradient`, `from-*`, `to-*`, inline gradient styles).
4. Add pseudo-element hardening (`::before`, `::after`) for wrappers and nav strips.
5. Add runtime computed-style pass for late-loaded/inline styles.
6. Add MutationObserver with debounce for SPA updates.
7. Validate on homepage, detail, and player pages across supported domains.
8. If requested, add direct-play routing to skip detail intermediates.
9. If requested, add playback automation assist with muted handoff + retry windows.
10. If requested, hide center play overlay only during active playback state.

## What To Do

- Force one base background color for non-media surfaces.
- Remove both class-based and inline gradients.
- Handle pseudo-elements explicitly.
- Handle absolute-positioned decorative overlays near edges.
- Keep `img`, `video`, `canvas`, `svg`, `picture`, `iframe` protected from destructive filters.
- Re-test after each patch with screenshot-level checks for corners and chips.
- For playback automation, wire both existing and late-mounted `video` elements.
- For skip-intermediate behavior, intercept clicks and resolve play URL safely.
- For center play controls, bind to `play/playing/pause/ended` events and toggle visibility by playback state (not permanently).

## What Not To Do

- Do not preserve decorative gradients after explicit no-gradient requirement.
- Do not rely on only class selectors; runtime and pseudo-elements also matter.
- Do not leave transparent wrappers that reveal bright parent backgrounds.
- Do not assume one page type validates all states.
- Do not mutate player subtree with blanket styling rules.

## Misses In This Iteration

1. Kept some gradient-like effects too long (buttons/chips and glow-like visuals).
2. Focused on container backgrounds first and under-targeted header edge-fade overlays.
3. Needed an earlier strict-mode switch once no-gradient was clearly requested.

## How To Prevent Future Misses

1. Add a "strict no-gradient mode" flag and default to it when requested.
2. Include a mandatory checklist before declaring complete:
   - Header edge scan (left/right fades)
   - Chip/button surface scan
   - Pseudo-element scan
   - Footer/gutter scan
3. Run one targeted query for top-of-page elements with non-`none` `background-image` and remove them unless media.
4. Keep a regression list of previously missed selectors and validate them first on each update.
5. Keep a player safety list (`#player`, `.video-js`, `vjs-*`, danmu overlays) and exempt it from blanket flattening.
6. Add a top-left artifact check (small fixed/absolute spinner rings) during QA.
7. Add a center-overlay check: verify overlays disappear during active playback and reappear on pause.

## Quick CSS/JS Patterns

- CSS flattening:
  - `background-image: none !important;`
  - `background-color: var(--kiro-bg) !important;`
- Pseudo hardening:
  - `*::before, *::after { background-image: none !important; }`
- Runtime flattening:
  - If `getComputedStyle(el).backgroundImage !== 'none'`, set it to `none` and set solid base background.

## Acceptance Expectation

A finished dark-mode delivery is accepted only when user screenshots show no remaining white/gradient artifacts in the requested strict mode.
