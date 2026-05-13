# XAAVV Prevalence Expansion v1.2.46

## Objective

Expand and verify a large, reproducible set of XAAVV-sourced terms and names, with prevalence on XAAVV as the primary ranking signal.

Target requested: at least 500 unique term/name entries.

## Files Added/Updated

- `tools/build_xaavv_prevalence_inventory.py`
- `data/xaavv_prevalence_inventory.json`
- `data/XAAVV_PREVALENCE_INVENTORY.md`

## Prevalence-First Rule

When choosing translations and candidate tags/names:

1. Prefer terms that appear more frequently on XAAVV pages and titles.
2. Use generic dictionary equivalents only as secondary fallback.
3. Keep extraction source tied to XAAVV public pages.

## Reproducible Build Steps

```powershell
Set-Location 'C:\Users\purpl\Documents\xaavv-dark-kiro-tampermonkey'
python tools/build_xaavv_prevalence_inventory.py --pages 8
```

What this does:

1. Crawls seeded XAAVV searches over 8 pages each.
2. Extracts title text from `/xaavv/*.html` links.
3. Derives handles/names and terms.
4. Ranks by frequency and writes JSON + Markdown outputs.

## Validation Steps

Userscript syntax check:

```powershell
Set-Location 'C:\Users\purpl\Documents\xaavv-dark-kiro-tampermonkey'
node --check xaavv-master-automation-dark-mode-v1.2.46.user.js
```

Inventory minimum-threshold check:

```powershell
Set-Location 'C:\Users\purpl\Documents\xaavv-dark-kiro-tampermonkey'
python -c "import json; d=json.load(open('data/xaavv_prevalence_inventory.json', encoding='utf-8')); total=d['counts']['total_unique_term_plus_name_entries']; assert total>=500, f'total {total} < 500'; print('PASS total_unique_entries=', total)"
```

## Latest Run Results

From the latest generation run:

- fetched_pages: 240
- failed_pages: 0
- unique_titles: 2611
- unique_terms: 27377
- unique_handles: 1628
- total_unique_term_plus_name_entries: 29005

Threshold status:

- Requested minimum >= 500
- Observed: 29005
- Result: PASS

## Notes

- This inventory is intentionally broad for discovery and ranking.
- The userscript dictionary can remain curated while using this inventory as source evidence for future additions.
