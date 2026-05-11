# XAAVV Dictionary Process Notice (Public Copy)

## Purpose

This public document confirms that search localization is dictionary-backed.

Dictionary content is intentionally not published in this repository.

---

## Public/Private Separation

1. Public repo: contains only feature-level references to dictionary-backed localization.
2. Local/private maintenance: contains actual dictionary term sets, ranking inputs, and term-level evidence.

---

## Implementation Policy

1. Public code and docs must not include explicit dictionary term inventories.
2. Public docs may state that a dictionary exists and is used.
3. Any term-level curation, ranking, or coverage details must remain local-only.

---

## Sequencing Behavior (Sanitized)

1. A recognized English query resolves to one localized term per search attempt.
2. Repeating the same English query cycles through ranked variants in configured order.
3. Ranking order is sourced from the private dictionary payload and is not disclosed in this repository.
4. Duplicate event triggers during one user action are deduplicated so rotation advances once per attempt.

---

## Maintenance Note

When updating localization behavior:

1. Keep public release notes high level.
2. Store detailed dictionary notes in local/private records only.
3. Ensure version/file synchronization remains intact.

---

## Status

- Public copy sanitized for term-level disclosure.
- Dictionary feature still supported.
