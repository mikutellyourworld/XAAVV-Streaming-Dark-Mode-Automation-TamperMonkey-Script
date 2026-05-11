# Dictionary Disclosure Policy

## Policy

This repository supports dictionary-backed localization features.

Public repository content must not include explicit dictionary term lists, term examples, term mappings, or category-level term inventories.

## Allowed in Public Repo

1. High-level statements that dictionary-backed localization exists.
2. Feature-level behavior descriptions (for example, conversion runs before search, guardrails exist, repeated-query fallback behavior).
3. Non-sensitive maintenance notes about versioning, reliability, and deployment.

## Not Allowed in Public Repo

1. Any explicit source/target dictionary entries.
2. Any examples of dictionary terms used for localization behavior.
3. Any ranked term inventories or term-level evidence tables.

## Local-Only Handling

1. Keep detailed dictionary content in local/private records.
2. Do not commit local dictionary records to the repository.
3. Ensure public release notes remain non-disclosing.

## Release Checklist

Before publishing:

1. Scan docs and code for explicit dictionary terms.
2. Replace term-level details with neutral, high-level wording.
3. Confirm version/file synchronization after any edits.
