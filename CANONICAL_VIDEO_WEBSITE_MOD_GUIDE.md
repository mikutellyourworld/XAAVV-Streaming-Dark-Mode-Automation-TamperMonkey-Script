# Canonical Guide: Reproducible UI Alignment, Transparency, and Dark Mode for Video Websites

## Purpose

This guide describes a repeatable, low-risk method to customize video websites so you can:

- apply stable dark mode without breaking playback,
- keep top controls visible while making selected wrappers transparent,
- align UI controls (for example search/download/button clusters),
- move selection cards under the video,
- force full-width player layout where desired,
- survive late rerenders and hydration resets.

The process is implementation-agnostic and works for userscripts, extensions, or site-side patches.

## Skills and Repositories Used

- Web reconnaissance pattern source: https://github.com/0xMassi/webclaw
- Skill reference used for recon framing: https://github.com/0xMassi/webclaw
- Operational skill repository consulted during execution: https://github.com/elder-plinius/OBLITERATUS
- Userscript runtime platform: https://www.tampermonkey.net/
- Browser automation for validation (optional): https://playwright.dev/

## Core Engineering Principles

1. Player-safe first.
Never allow dark-mode or transparency selectors to target media render layers (`video`, player canvases, subtitle layers, danmaku layers, control internals).

2. Structural targeting over fragile classes.
Use text anchors, viewport position, and sibling relationships instead of only utility classes.

3. Reapply continuously.
Most video sites rerender frequently. One-time CSS is not enough; combine CSS baseline + runtime enforcement + mutation observer + short watchdog loop.

4. Minimize blast radius.
Clear only the specific wrappers causing overlap or dark chips. Do not blanket-hide headers or global nav unless explicitly required.

5. Version sync discipline.
Keep script metadata version, runtime version constant, docs, and artifact filenames synchronized for every release.

## Canonical Workflow

### Phase 1: Recon (WebClaw-style)

1. Map page types:
- home,
- detail/intermediate,
- play page,
- mobile viewport variant.

2. Extract stable anchors:
- playback route pattern (for example `/xavplay/...`),
- selection panel label text (`Selections`, `选集`, etc.),
- top bar labels (`search`, auth actions, menu labels),
- player host nodes (`#player`, `.video-js`, wrapper with fullscreen button text).

3. Capture relation graph:
- layout container,
- video panel sibling,
- selection card sibling,
- sticky/fixed overlays,
- late-loaded wrappers.

4. Verify rerender behavior:
- initial load,
- post-play click,
- pause/resume,
- delayed hydration,
- route transitions.

## Phase 2: Baseline Dark Mode

1. Install a root dark palette using CSS variables.
2. Flatten gradients and white surfaces for known UI containers.
3. Preserve readable typography and focus states.
4. Exclude media/player internals from destructive style rewrites.

## Phase 3: Transparency Hardening

1. Restrict transparency to top-level wrappers near target controls.
2. Preserve control text/icon color and pointer events.
3. Apply transparent background + border + shadow reset only where needed.

Recommended runtime clear set per element:

- background
- background-color
- background-image
- border-color
- box-shadow
- backdrop-filter

## Phase 4: Alignment and Layout Reflow

Use a deterministic ancestor-walk pattern:

1. Find the label node by text (`Selections` / `选集`).
2. Walk upward until you reach a parent whose siblings include a video panel.
3. Set that ancestor as the selection card and parent as layout container.
4. Move selection card after video panel.
5. Force single-column container + full-width video + full-width selection panel.

Pseudo-flow:

1. `selectionLabel = findByText(["选集", "selections"])`
2. `selectionCard, layoutContainer = findAncestorWithVideoSibling(selectionLabel)`
3. `videoPanel = findSiblingWithVideo(layoutContainer, selectionCard)`
4. `videoPanel.insertAdjacentElement('afterend', selectionCard)`
5. normalize widths and max-width constraints on container, video panel, media wrappers, and selection card.

## Phase 5: Rerender Resilience

Wire all critical enforcers into three paths:

1. Immediate pass on load.
2. Scheduled delayed passes (for example 300ms, 1200ms, 2600ms).
3. Mutation observer callback with debounce.
4. Optional watchdog interval (short cadence) for stubborn sites.

This pattern prevents regressions where site scripts restore old classes or inline styles.

## Validation Matrix

Run all checks on desktop and mobile widths:

1. Video remains visible and controls function.
2. Selection card is below video.
3. Video panel spans expected horizontal width.
4. Top control wrappers are transparent where requested.
5. Search/auth/menu controls remain clickable.
6. Download and seek controls stay aligned after resize.
7. State remains correct after delayed rerenders.
8. No white flashes during route changes.

## Privacy and Safety Checklist

Before publish:

1. Remove local machine paths and environment-specific references.
2. Remove personal identifiers not intended for publication.
3. Avoid embedding credentials, tokens, keys, or account secrets.
4. Sanitize repository links if anonymization is required.
5. Review commit history metadata when privacy requirements are strict.

## Reproducible Delivery Template

For each release, publish:

1. One script artifact with synchronized version metadata.
2. One release summary including:
- request addressed,
- implementation details,
- rerender wiring points,
- validation checklist.
3. One installation/update note with practical rollback steps.

## Quick Start for Similar Sites

1. Implement only dark baseline + player-safe exclusions.
2. Add transparency hardening for top wrappers.
3. Add layout reflow for selection card + full-width player.
4. Add mutation + watchdog resilience.
5. Validate on at least two URLs per page type.
6. Ship with synchronized versioning and release notes.

## Outcome

Using this canonical approach, modifications become reproducible, safe for playback, and resilient to modern front-end rerenders across similar video platforms.
