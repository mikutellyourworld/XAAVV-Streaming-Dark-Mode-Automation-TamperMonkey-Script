# Foreign-Language Search Localization Skill

## Public Summary

This project includes dictionary-backed search localization.

Public repository artifacts intentionally avoid term-level dictionary disclosure.

## Disclosure Rule

1. Public docs/code: high-level feature references only.
2. Local/private records: term-level dictionary data and curation notes.

See `DICTIONARY_DISCLOSURE_POLICY.md` for the repository policy.

## Sequencing Rule (Sanitized)

1. Resolve each recognized English input to a single localized term before navigation.
2. For repeated attempts of the same English intent, rotate variants in configured rank order.
3. Ensure one user attempt advances rotation only once even if multiple input handlers fire.
4. Keep rank evidence, explicit terms, and curation notes in local/private records only.

## Runtime Requirement (Sanitized)

1. Public script builds do not embed term-level dictionary data.
2. Search-term rewriting only activates when a local/private payload is present in `localStorage` key `xaavv-search-dictionary-private-v1`.
3. Runtime consumers should re-read that payload when it changes instead of assuming it only exists at initial script startup.
