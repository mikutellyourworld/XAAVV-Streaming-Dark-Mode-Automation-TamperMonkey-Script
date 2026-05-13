# Dictionary Search Sequencing Methodology

## Overview

This document explains the search sequence implementation in `xaavv-dictionary.json` and how the userscript (`xaavv-master-automation-dark-mode-v1.2.46.user.js`) utilizes it to optimize content search and discovery on XAAVV.

**Important**: This file documents the internal methodology. Dictionary terms are intentionally excluded from public README/ABOUT files per project policy.

## Search Sequence Structure

All search terms are organized into priority groups sorted by result count (highest to lowest). The userscript uses this sequence to progressively search for content, optimizing for volume and relevance.

### Search Sequence Groups

#### Group 1: Trap Scenarios (Priority 1-4)

| Priority | Term | Language | Result Count | Notes |
|----------|------|----------|--------------|-------|
| 1 | trap | English | 125 | Primary English search term; highest prevalence; broad results |
| 2 | 陷阱 | Chinese | abundant | Chinese equivalent; literal 'trap/scheme'; highest Chinese volume |
| 3 | 蜜的罠 | Japanese/Chinese | moderate | Erotic trap scenario; honey trap; specific subset |
| 4 | 设局 | Chinese | moderate | Elaborate setup/scheme; similar content subset |

**Progression Logic**: If searching with "trap" yields minimal content or duplicate results, the userscript advances to "陷阱" (Chinese), then to "蜜的罠" (Japanese/Chinese hybrid), and finally to "设局" (Chinese variant). This ensures comprehensive coverage across language variants while avoiding saturation with a single term.

#### Group 2: Gender Identity (Priority 5-7)

| Priority | Term | Language | Result Count | Notes |
|----------|------|----------|--------------|-------|
| 5 | femboy | English | 3 | English crossdresser/feminine-presenting male; maps to 伪娘 |
| 6 | 伪娘 | Chinese | prevalent | Chinese for crossdresser; appears in site tags; confirmed in titles |
| 7 | 女装 | Chinese | prevalent | Cross-dressing/women's clothing; broader scope; many results |

**Progression Logic**: English "femboy" has lower prevalence (3 results). When searched, the userscript supplements with Chinese equivalent "伪娘" for deeper content discovery, and further expands to "女装" for broader cross-dressing content.

#### Group 3: Family Relations (Priority 8-11)

| Priority | Term | Language | Result Count | Notes |
|----------|------|----------|--------------|-------|
| 8 | 姐姐 | Chinese | ~50% of rankings | Older sister; extremely prevalent in site rankings |
| 9 | 妹妹 | Chinese | ~40% of rankings | Younger sister; prevalent in rankings |
| 10 | 弟弟 | Chinese | ~30% of rankings | Younger brother; confirmed in rankings |
| 11 | 哥哥 | Chinese | ~25% of rankings | Older brother; confirmed in rankings |

**Progression Logic**: Family relation terms have high natural prevalence across the site. The sequence prioritizes sisters (姐姐, 妹妹) before brothers (弟弟, 哥哥) based on ranking frequency. Userscript can iterate through this sequence if filtering or narrow-search is required.

## Validation Methodology

Each term in the sequence has been validated through direct search on XAAVV:

- **Trap**: 125 confirmed results (highest prevalence group)
- **Gender Identity**: 3-prevalent result range (lower but viable)
- **Family Relations**: ~25-50% of ranking page titles (extremely prevalent)

Validation completed on 2026-05-13. See `XAAVV_DICTIONARY_SEARCH_VALIDATION.md` for detailed search results and top 5 titles per term.

## Userscript Integration

### How the Userscript Uses the Sequence

The userscript (`xaavv-master-automation-dark-mode-v1.2.46.user.js`) imports `xaavv-dictionary.json` and accesses the `search_sequence_sorted_by_prevalence` array to:

1. **Populate search filters**: Auto-complete and filter suggestions use the priority ordering
2. **Progressive search**: If a user searches for "trap", the userscript can offer follow-up suggestions in sequence (陷阱, 蜜的罠, 设局)
3. **Content discovery**: When navigating content, the userscript can recommend related terms using the sequence
4. **Redundancy handling**: If a term is already searched, the userscript skips to the next priority term

### Code Pattern Example (Pseudocode)

```javascript
// Load dictionary
const dictionary = await fetch('xaavv-dictionary.json').then(r => r.json());
const sequence = dictionary.search_sequence_sorted_by_prevalence;

// Find next unsearched term in group
function getNextSearchTerm(group_name, lastSearched) {
  const group = sequence.find(s => s.term_group === group_name);
  const nextTerm = group.sequence.find(t => !lastSearched.includes(t.term));
  return nextTerm?.term || null;
}

// Search progression example
if (currentSearch === 'trap') {
  suggestedNext = getNextSearchTerm('trap_scenarios', ['trap']);
  // Returns: { term: '陷阱', priority: 2, ... }
}
```

## Defensive Design: Leaked Terms

If dictionary terms leak to public documentation (README, ABOUT, etc.), the search and filter functionality remains operational because:

1. **Dictionary is in code**: The sequence is embedded or referenced in the userscript, not parsed from docs
2. **Terms are generic keywords**: Even if visible in documentation, they represent valid search queries on XAAVV
3. **Sequence ordering preserved**: The priority-based progression is algorithm-based, not documentation-based

Example: If "femboy" is accidentally mentioned in README, searches still work because the userscript's import of `xaavv-dictionary.json` overrides the public documentation with the authoritative sequence.

## Local Documentation Only

**This file is local project documentation only** and is not referenced in public README or ABOUT files. The methodology is implemented in code (userscript) and stored in the JSON dictionary structure. All dictionary terms are hidden from public-facing documentation per project policy.

## Future Enhancements

- Add dynamic result count tracking to update sequence priorities in real-time as site content evolves
- Implement caching to avoid redundant searches within session
- Add user-configurable sequence overrides for power users
- Log search progression for analytics/improvement

---

**File Status**: Internal methodology documentation. Do not include in public README or push this file to public repositories without redaction.

**Last Updated**: 2026-05-13
**Maintained By**: mikutellyourworld
