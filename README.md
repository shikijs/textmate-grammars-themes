# tm-grammars / tm-themes

[![tm-grammars](https://img.shields.io/npm/v/tm-grammars?label=tm-grammars&labelColor=080f12&color=1fa669)](https://www.npmjs.com/package/tm-grammars)
[![tm-themes](https://img.shields.io/npm/v/tm-themes?label=tm-themes&labelColor=080f12&color=1fa669)](https://www.npmjs.com/package/tm-themes)

Collection of TextMate [grammars](./packages/tm-grammars/) and [themes](./packages/tm-themes/), converted to JSON and re-distributed as npm packages. Extracted from Shiki, available for general usage.

Packages are **automatically updated and published** every day (if there are changes).

[Preview Playground](https://textmate-grammars-themes.netlify.app/)

## Contribute

### Add a new grammar

> [!NOTE]
> For new grammars to be accepted, we typically require the language to be popular and have a significant number of users. Usually we see [GitHub's linguist](https://github.com/github-linguist/linguist) repo as a marker for this. If you language is not in linguist, we would recommend adding it there first.
>
> Meanwhile, to use a grammar with Shiki, you can always [provide a custom grammar](https://shiki.style/guide/load-lang) locally.

1. Fork this repository.
2. Install dependencies with `pnpm install`.
3. Add grammar source and metadata to [`sources-grammars.ts`](./sources-grammars.ts).
4. Add a code sample file `<id>.sample` for your language under [`./samples`](./samples). A sample should include a variety of language syntaxes and succinctly capture the idiosyncrasy of a language. Format requirements:
  - Space for indentation.
  - Less than 100 columns if possible.
  - A comment with a link to the source on the last line (e.g. `# From https://poignant.guide/book/chapter-5.html`).
5. Generate a [personal access token](https://github.com/settings/tokens?type=beta) with the default permissions. This token is used to query public information from GitHub API and avoid rate limits.
6. Create a `.env` file and paste your generated token into the file like so:
```bash
GITHUB_TOKEN=your-personal-access-token
```
7. Run `pnpm run fetch` to download the grammar.
8. Run `pnpm run play` to start the playground. Select the new grammar in the left column to verify the accuracy and confirm that the grammar works as expected.
9. Send in the PR!

### Add a new theme

> [!NOTE]
> For new themes to be accepted, we typically require the theme to be popular and have a significant number of users. Like over `50K downloads` on VS Code marketplace, or over `300 stars` on GitHub.
>
> Meanwhile, to use a theme with Shiki, you can always [provide a custom theme](https://shiki.style/guide/load-theme) locally.

1. Fork this repository.
2. Install dependencies with `pnpm install`.
3. Add theme source and metadata to [`sources-themes.ts`](./sources-themes.ts).
4. Generate a [personal access token](https://github.com/settings/tokens?type=beta) with the default permissions. This token is used to query public information from GitHub API and avoid rate limits.
5. Create a `.env` file and paste your generated token into the file like so:
```bash
GITHUB_TOKEN=your-personal-access-token
```
6. Run `pnpm run fetch` to download the theme.
7. Run `pnpm run play` to start the playground. Select the new theme in the right column to verify the accuracy and confirm that the theme works as expected.
8. Send in the PR!

## License

The grammars and themes included in this package are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [Grammars NOTICE](./packages/tm-grammars/NOTICE) and [Themes NOTICE](./packages/tm-themes/NOTICE).

All other files [MIT](./LICENSE) © Pine Wu & Anthony Fu.
