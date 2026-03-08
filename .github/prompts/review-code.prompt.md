# Code review guidance for this repository

## Grammars and themes are auto-synced

**Grammars and themes in this repo are automatically synced from upstream sources.** They are not meant to be edited directly in this repository.

### Generated / fetched paths (do not accept direct edits)

- `packages/tm-grammars/grammars`
- `packages/tm-grammars/raw`
- `packages/tm-grammars/index.js`
- `packages/tm-themes/themes`
- `packages/tm-themes/index.js`

### Source of truth

- **`sources-grammars.ts`** — defines where grammars come from and how they are built
- **`sources-themes.ts`** — defines where themes come from

Changes to grammars or themes should be made by updating these source files (e.g. adding a new source, changing a repo URL, or applying a patch), not by editing the generated files under the paths above.

---

## When someone opens a PR that edits grammar/theme files directly

If a PR modifies files under `packages/tm-grammars/grammars`, `packages/tm-grammars/raw`, or `packages/tm-themes/themes` (e.g. fixing a bug or adding a rule in a grammar or theme):

1. **Do not merge** those direct edits.
2. **Ask the contributor** to open the fix in the **upstream** repository (the original grammar/theme project).
3. **Explain** that this repo syncs from upstream; once their fix is merged upstream, it will be picked up here on the next sync.

---

## When upstream is unmaintained but the fix is critical

If the upstream repo is no longer maintained and the fix is critical:

- We can **temporarily** add a `patch` function in **`sources-grammars.ts`** (or the appropriate sources file) to apply the fix during sync. This is a workaround only.
- For a **long-term solution**, suggest that someone **take over or fork the upstream repo** and maintain it, so we can point this repo’s source to the maintained fork and keep receiving updates.
