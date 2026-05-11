# XAAVV Dictionary Process Notice (Public Copy)

## Purpose

This public document confirms that search localization is dictionary-backed.

Dictionary content is intentionally not documented in this repository's public markdown files.

---

## Public/Private Separation

1. Public repo: contains feature-level references to dictionary-backed localization and the shipped userscript implementation.
2. Local/private maintenance: may contain ranking inputs, curation notes, and term-level evidence.

---

## Implementation Policy

1. Public docs must not include explicit term inventories or ranking tables.
2. Public code may implement dictionary-backed localization behavior.
3. Detailed curation notes and external evidence should remain local/private.

---

## Sequencing Behavior (Sanitized)

1. A recognized English query resolves to one localized term per search attempt.
2. Repeating the same English query cycles through ranked variants in configured order.
3. Duplicate event triggers during one user action are deduplicated so rotation advances once per attempt.

---

## Runtime Loading Behavior (Sanitized)

1. The shipped userscript includes a built-in dictionary baseline for search localization.
2. An optional local/private payload in `localStorage` key `xaavv-search-dictionary-private-v1` may override or extend that baseline.
3. Public diagnostics and docs may describe the override mechanism without listing the underlying terms.

---

## Maintenance Note

When updating localization behavior:

1. Keep public release notes high level.
2. Store detailed dictionary notes in local/private records only.
3. Ensure version/file synchronization remains intact.

---

## Status

- Public copy sanitized for term-level disclosure in documentation.
- Dictionary-backed search localization remains supported.
- Built-in baseline plus optional local override behavior documented.