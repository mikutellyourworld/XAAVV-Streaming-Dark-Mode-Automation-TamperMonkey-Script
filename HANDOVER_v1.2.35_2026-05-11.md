# XAAVV Tampermonkey Handover

## Purpose

This handover summarizes the current state of the XAAVV userscript project after iterative UI hardening, playback control work, and multilingual search-localization upgrades through version 1.2.35.

The goal is to provide enough operational and technical context for a new maintainer to continue safely without re-discovering prior decisions.

---

## Current Baseline

- Active script file: xaavv-master-automation-dark-mode-v1.2.35.user.js
- Current script version metadata: 1.2.35
- Primary branch: main
- Latest core behavior update commit: cf72533
- Latest documentation/skill update commit: 8f2a5e6

---

## What Was Built

### 1. UI and Play-Page Control Layer

Implemented and iteratively stabilized:

- Dark theme normalization across XAAVV domains and subdomains.
- Top-bar visual adjustments on play pages while preserving interaction.
- Floating Download button behavior and placement tuning.
- Interactive progress bar/seek interaction behavior.
- Center overlay/play-pause synchronization and watchdog passes.
- Intermediate route handling between detail and playable URLs.

### 2. Search Localization Layer (English to Foreign-Language Queries)

Implemented as a generic, reusable architecture:

- Stacked dictionary model:
  - Phrase stack
  - Token stack fallback
- Search interception entry points:
  - Form submit
  - Enter key
  - Search button click
  - Direct search-path rewrites
- Guardrails:
  - Skip conversion for CJK/native-script queries
  - Normalize incoming English query text
- Ranking strategy:
  - Variant order based on live result relevance checks

### 3. Single-Term Resolution Improvement (v1.2.35)

Problem observed:

- Multi-variant expansion in one query reduced precision for some searches.

Fix introduced:

- One translated target term per search.
- Optional sequential fallback for repeated searches of the same English key.
- Phrase match priority remains above token fallback.

Outcome:

- Cleaner target queries and better alignment with site search behavior.

---

## Key Files and Their Roles

1. xaavv-master-automation-dark-mode-v1.2.35.user.js
- Primary runtime userscript.
- Contains all UI automation, playback controls, route handling, and search localization logic.

2. README.md
- Project overview and change log snapshots.
- Install pointer and high-level feature narrative.

3. INSTALLATION_AND_UPDATE_GUIDE.md
- End-user install/update instructions.
- Version/file-name synchronization details.

4. FOREIGN_LANGUAGE_SEARCH_LOCALIZATION_SKILL.md
- Generic, reusable skill guide for cross-language search localization.
- Transferable workflow and portability checklist.

5. DARK_MODING_SKILL.md
- Operational lessons and dark-theme hardening guidance.

---

## Search Localization Architecture Notes

### Current Flow

1. Detect search-trigger event.
2. Normalize incoming English query.
3. If phrase match exists, use phrase stack.
4. Else use token fallback stack.
5. Resolve to one target term.
6. If same English key is searched again, rotate to next ranked variant.
7. Navigate to rewritten search route.

### Why This Matters

- Reduces noisy, over-broad query strings.
- Preserves deterministic behavior on first search.
- Enables progressive fallback exploration without manual dictionary edits.

---

## Validation Summary

Validated repeatedly during implementation using:

- Direct page navigation on XAAVV play/search/detail URLs.
- DOM-based checks for header controls and search behavior.
- Syntax validation with node --check after script updates.
- Iterative commit/push cycles with version/file synchronization.

Known validation emphasis areas:

- Search conversion correctness for English input.
- No conversion for already-native-language queries.
- Header controls remaining visible and interactive.
- No mismatch between script filename and internal version.

---

## Version Evolution Relevant to Handover

- 1.2.33
  - Initial dictionary-backed search localization.
- 1.2.34
  - Stacked dictionary model with phrase/token prioritization.
- 1.2.35
  - Single-term output per search plus repeated-query fallback sequencing.

---

## Operational Conventions Used

- Version number changed in both script header and runtime constant on each release.
- Script filename kept synchronized with version.
- Documentation updates performed with each behavior change.
- Search dictionary documentation in public docs kept generic rather than listing sensitive term sets.

---

## Suggested Immediate Post-Handover Checks

1. Install latest script from main branch file.
2. Test English search in top-bar input and direct /search/<english> paths.
3. Repeat the same English query multiple times to confirm fallback sequencing.
4. Confirm native-language search input passes through unchanged.
5. Confirm login/register/search controls remain usable on play pages.

---

## Recommended Next Iteration

1. Add a user-editable dictionary configuration block near the top of the script.
2. Add a lightweight debug toggle to log conversion decisions per query.
3. Add minimal regression test harness for query conversion functions.
4. Add periodic dictionary ranking refresh workflow.

---

## External Repositories Already Identified For Improvement

Potential tooling sources for future enhancement:

- wooorm/franc
- argosopentech/argos-translate
- UlionTse/translators
- vgrabovets/multi_rake
- lovell/limax

These can support language detection, translation candidate generation, normalization, and keyword extraction for cross-language search localization at scale.

---

## Handover Status

- Code baseline: complete and published.
- Documentation baseline: complete and published.
- Skill documentation: complete and published.
- Ready for conversation compaction.
