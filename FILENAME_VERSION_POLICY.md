# Userscript Filename and Version Synchronization Policy

- Every functional update to the userscript must increment the version number in both the filename and the `@version` field in the userscript metadata block.
- The filename must follow the live repository pattern: `xaavv-master-automation-dark-mode-v<version>.user.js`.
- All documentation and install instructions must reference the current filename and version.
- This policy ensures users always install the correct, up-to-date script and that versioning is clear across all project artifacts.

## Steps for Each Update
1. Update the `@version` field in the userscript metadata.
2. Rename the userscript file to the exact versioned pattern used by the live repository, for example `xaavv-master-automation-dark-mode-v1.2.46.user.js`.
3. Update the `@name` and `@namespace` metadata if the live repository naming has changed.
4. Update all install instructions, rollback notes, and tracked validation docs to reference the current filename.
5. Validate the renamed script directly with `node --check <filename>` before commit.
6. Commit and push changes using the `mikutellyourworld` identity.

## Reproducible Sync Checklist
1. Inspect the live repository root and confirm the currently published userscript filename.
2. Increment the local version to the next coherent version rather than reusing a stale filename.
3. Rename the local userscript file before editing documentation so search/replace stays unambiguous.
4. Update README install steps and changelog with the new filename/version pair.
5. Update any tracked docs that mention the old script filename.
6. Run a syntax check against the renamed userscript.
7. Push the matching commit to `main`.

---

For more details, see `HANDOVER_AND_PROCESS.md` and `RELOCATION_AND_NAMING_POLICY.md`.
