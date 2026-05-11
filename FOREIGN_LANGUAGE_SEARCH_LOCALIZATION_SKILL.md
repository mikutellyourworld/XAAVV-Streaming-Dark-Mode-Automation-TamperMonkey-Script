# Foreign-Language Search Localization Skill (English -> Target Language)

## Purpose

This skill provides a reusable pattern to convert English search intent into target-language search queries before they are sent to a website search endpoint. It is designed for multilingual content sites where titles and tags are mostly in non-English languages.

## What Was Implemented In This Repo

This repo now includes a stacked search dictionary implementation in the userscript:

1. Phrase-level dictionary (highest priority)
2. Token-level dictionary (fallback)
3. Query conversion before search submission
4. URL rewrite for direct `/search/<query>` routes
5. Ranking-driven variant ordering to improve result coverage

Implementation references in code:

- `SEARCH_DICTIONARY_STACKS`
- `lookupPhraseVariants(...)`
- `lookupSearchVariants(...)`
- `convertEnglishSearchQueryToZh(...)`
- `wireSearchQueryLocalization(...)`
- `maybeRewriteEnglishSearchPath(...)`

## Why Stacked Dictionaries Work Better

Single-token replacement is often not enough for multilingual sites. Stacked dictionaries improve precision and recall by:

1. Resolving multi-word intent first (phrase stack)
2. Backfilling unknown words via token stack
3. Expanding to ranked variants when one-to-one translation is weak

## Generic Workflow (Portable To Any Site)

1. Discover the search transport.
- Identify search input, button, and submit behavior.
- Detect route style, such as `/search/<term>` or query params.

2. Build dictionary stacks.
- Stack A: phrase mappings (exact normalized phrase keys).
- Stack B: token mappings (normalized token keys).
- Store each key with prioritized target-language variants.

3. Add conversion guardrails.
- Skip conversion when the query already contains target-language script.
- Skip empty/non-text queries.
- Normalize punctuation/plurals for robust lookup.

4. Intercept all search entry points.
- Form submit
- Enter key in search input
- Search button click
- Direct route rewrites (`/search/<english>`)

5. Rank variants using live site evidence.
- Evaluate candidate target terms against real search result counts.
- Keep highest-yield variants first in each dictionary entry.
- Re-check periodically as site content evolves.

6. Validate end-to-end.
- English input from search bar converts correctly.
- Direct English search URL rewrites correctly.
- Existing native-language input remains unchanged.
- No loops and no broken navigation.

## Pseudocode Template

```javascript
const STACKS = [
  { name: 'phrase', map: { /* normalized phrase -> [ranked variants] */ } },
  { name: 'token',  map: { /* normalized token  -> [ranked variants] */ } }
];

function convertQuery(raw) {
  if (isAlreadyTargetLanguage(raw)) return raw;

  const phraseHit = lookupPhrase(raw);
  if (phraseHit.length) return joinVariants(phraseHit);

  const tokens = tokenize(raw);
  if (tokens.length === 1) {
    const v = lookupToken(tokens[0]);
    return v.length ? joinVariants(v) : raw;
  }

  return tokens.map(t => lookupToken(t)[0] || t).join(' ');
}

function onSearch(raw) {
  const converted = convertQuery(raw);
  if (converted !== raw) navigateToSearch(converted);
}
```

## Porting Checklist

- [ ] Update site selectors for input/button/form
- [ ] Update route parser and route builder
- [ ] Replace script detection regex for your target language(s)
- [ ] Seed phrase/token dictionaries for your domain
- [ ] Run ranking pass using live result counts
- [ ] Add periodic dictionary maintenance schedule

## Repositories That Improve This Skill

These repos can strengthen detection, translation, and preprocessing in future versions:

1. `wooorm/franc`
- URL: https://github.com/wooorm/franc
- Use case: lightweight language detection to decide when conversion should run.

2. `argosopentech/argos-translate`
- URL: https://github.com/argosopentech/argos-translate
- Use case: offline translation fallback for dictionary bootstrap and updates.

3. `UlionTse/translators`
- URL: https://github.com/UlionTse/translators
- Use case: multi-engine translation aggregation to generate candidate variants.

4. `vgrabovets/multi_rake`
- URL: https://github.com/vgrabovets/multi_rake
- Use case: multilingual keyword extraction to discover high-frequency target terms from titles.

5. `lovell/limax`
- URL: https://github.com/lovell/limax
- Use case: robust normalization/transliteration helpers for mixed-script preprocessing.

## Operational Notes

- Keep dictionary keys in normalized lowercase English.
- Keep values as ranked arrays, not single replacements.
- Prefer additive updates over destructive rewrites.
- Track coverage with a small benchmark set of common English queries.

## Maintenance Strategy

1. Weekly: sample top English queries and compare result coverage.
2. Monthly: rerank dictionary variants from live counts.
3. Quarterly: refresh dictionary seed set from new content trends.
