# XAAVV Search Dictionary Expansion Process (v1.2.36)

## Purpose

This document records the full method used to expand the English-to-Simplified-Chinese search localization dictionary with stronger coverage for:

1. Trans/transgender-adjacent search terms.
2. Cross-dressing and femboy term variants.
3. Common high-frequency adult tag families.

The intent is reproducibility: any maintainer can repeat this process with the same ranking logic and safety constraints.

---

## Scope of This Iteration

- Repo: XAAVV-Streaming-Dark-Mode-Automation-TamperMonkey-Script
- Script version bumped: 1.2.35 -> 1.2.36
- Script file renamed: xaavv-master-automation-dark-mode-v1.2.35.user.js -> xaavv-master-automation-dark-mode-v1.2.36.user.js
- Data source type: live XAAVV search-page evidence plus established domain synonyms.

---

## Evidence Collection Workflow

### Step 1: Validate live terms used by XAAVV

Using XAAVV search routes and page snapshots, we verified that these Chinese terms are active and high-yield for this term family:

- 伪娘
- 人妖
- 女装
- TS
- 变性人
- 跨性别

### Step 2: Capture comparative search volume indicators

Observed result counts from XAAVV search page headers:

| Query | Observed Count |
|---|---:|
| 伪娘 | 1562 |
| 人妖 | 1460 |
| 女装 | 39 |

Interpretation:

1. 伪娘 and 人妖 are highly productive recall anchors on this site.
2. 女装 has lower precision for this use case because it also collides with non-trans fashion/context content.
3. TS appears frequently in titles/snippets and should remain in top candidates.

### Step 3: Expand English synonym coverage

Added and normalized mappings for:

1. Core identity terms: trans, transgender, trans woman, trans girl.
2. Community/search aliases: ladyboy, shemale, newhalf, ts.
3. Cross-dressing cluster: crossdresser, crossdressing, otokonoko, femboy, transvestite, trap.
4. User-requested ambiguous alias: fairy.

### Step 4: Expand common adult-tag families

Added a secondary expansion set for widely searched categories to improve overall dictionary utility:

1. Acts: anal, deepthroat, blowjob, creampie, gangbang, orgy.
2. Performer category tags: milf, mature, teen, amateur, solo.
3. Regional/content tags: asian, japanese, chinese, uncensored.
4. Style/fetish tags: bdsm, bondage, domination, submissive, squirt, rimjob.

---

## Normalization and Resolution Rules (unchanged core logic)

The algorithm behavior remains:

1. Normalize English input to lowercase lookup form.
2. Skip conversion if CJK text already exists.
3. Phrase stack lookup first.
4. Token stack fallback second.
5. Resolve exactly one translated term per search.
6. Rotate through ranked variants only on repeated identical English keys.

Why we kept this model:

1. It avoids over-broad multi-term query strings.
2. It keeps first-run behavior deterministic.
3. It still enables fallback exploration through rotation.

---

## Ranking Method for New Terms

For each new key, variant arrays are ordered by this priority:

1. Live XAAVV result yield (from observed search pages).
2. Direct title/tag appearance in XAAVV snippets.
3. Semantic closeness to the English source term.
4. Backward compatibility with prior dictionary behavior.

Example ranking rationale:

- trans -> [伪娘, 变性人, 跨性别, TS, 人妖]

Reasoning:

1. 伪娘 and 人妖 demonstrated high recall on-site.
2. 变性人 and 跨性别 are semantically explicit.
3. TS appears in many titles and remains an important alias.

---

## Safety and Quality Constraints Applied

1. No changes to query-rewrite control flow beyond dictionary content and versioning.
2. No change to guardrails that skip CJK-native input.
3. No change to single-term resolution contract.
4. Additive updates only: existing mappings preserved where possible.

---

## Files Changed in This Iteration

1. xaavv-master-automation-dark-mode-v1.2.36.user.js
- Version header and runtime version updated.
- Phrase dictionary expanded.
- Token dictionary expanded.

2. README.md
- Install filename updated to v1.2.36.
- Fix log entry added for v1.2.36 dictionary expansion.

3. INSTALLATION_AND_UPDATE_GUIDE.md
- Version references and raw URL updated to v1.2.36.
- "What\'s New" section updated for this release.

4. HANDOVER_v1.2.35_2026-05-11.md
- Addendum section added to document v1.2.36 dictionary-expansion release and process-doc linkage.

5. DICTIONARY_EXPANSION_PROCESS_v1.2.36_2026-05-11.md
- This full methodology document.

---

## Validation Checklist for Maintainers

After installing v1.2.36, verify:

1. English input "trans" rewrites to one high-yield Chinese term.
2. Repeating "trans" rotates through ranked alternatives.
3. English input "fairy" maps into the trans/femboy cluster.
4. English input "ladyboy" and "shemale" map to on-site productive tags.
5. Existing mappings (for butt, boobs, threesome, cosplay) still resolve correctly.
6. Chinese native input remains unchanged (no rewrite).
7. No navigation loops and no broken /search/<term> route behavior.

---

## Reproducible Repeat Procedure

Use this each cycle:

1. Collect 5-20 English seed terms from user reports.
2. Build 2-5 Chinese candidate variants per term.
3. Test each candidate via /search/<term> and capture result counts.
4. Rank variants by observed count + snippet relevance.
5. Add ranked arrays to phrase or token stacks.
6. Validate single-term behavior and repeated-query rotation.
7. Update version number, filename, README, install guide, and handover docs.

---

## Known Limits

1. Site indexing changes can alter optimal variant ordering over time.
2. Some aliases are context-dependent and may have noisy results.
3. Result counts are dynamic and should be periodically re-measured.

---

## Next Optimization Targets

1. Add a dictionary benchmark fixture (term -> expected top variant).
2. Add optional debug logging toggle for variant selection path.
3. Add a tiny script to semi-automate ranking refresh from observed counts.

---

## Status

- Process fully documented.
- Dictionary expanded and versioned.
- Ready for commit, push, and compact handoff continuation.
