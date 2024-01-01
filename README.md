# tm-grammars / tm-themes

[![tm-grammars](https://img.shields.io/npm/v/tm-grammars?label=tm-grammars&labelColor=080f12&color=1fa669)](https://www.npmjs.com/package/tm-grammars)
[![tm-themes](https://img.shields.io/npm/v/tm-themes?label=tm-themes&labelColor=080f12&color=1fa669)](https://www.npmjs.com/package/tm-themes)

Collection of TextMate [grammars](./packages/tm-grammars/) and [themes](./packages/tm-themes/), converted in JSON format and re-distributed as npm packages.

Packages are **automatically updated and published** every day (if there are changes).

Scripts are extracted and modified from [Shiki](https://github.com/shikijs/shiki).

## Contribute

### Add a new grammar

1. Fork this repository
2. Install the dependencies with `pnpm i`
3. Add grammar source and metadata to [`sources-grammars.ts`](./sources-grammars.ts)
4. Add a code sample file `<id>.sample` for your language under [`./samples`](./samples). A sample should include a variety of language syntaxes and succinctly capture the idiosyncrasy of a language. Format requirements:
  - Space for indentation
  - Less than 100 columns if possible
  - Link to source in the last line, for example, `# From` https://poignant.guide/book/chapter-5.html`
5. Generate a [personal access token](https://github.com/settings/tokens?type=beta), keep the default, no extra permission is needed. This token is used to query public information from GitHub API and avoid rate limits.
6. Create a `.env` file and past your generated token into the file like so:
```bash
GITHUB_TOKEN=your-personal-access-token
```
7. Run `pnpm run fetch` to download the grammar and verify it works
8. Send in the PR!

### Add a new theme

1. Fork this repository
2. Install the dependencies with `pnpm i`
3. Add theme source and metadata to [`sources-themes.ts`](./sources-themes.ts)
4. Generate a [personal access token](https://github.com/settings/tokens?type=beta), keep the default, no extra permission is needed. This token is used to query public information from GitHub API and avoid rate limits.
5. Create a `.env` file and past your generated token into the file like so:
```bash
GITHUB_TOKEN=your-personal-access-token
```
6. Run `pnpm run fetch` to download the theme and verify it works
4. Send in the PR!

## License

The grammars included in this package are covered by their repositories’ respective licenses, which are permissive (apache-2.0, mit, etc), and made available in [Grammars NOTICE](./packages/tm-grammars/NOTICE) and [Themes NOTICE](./packages/tm-themes/NOTICE).

All other files [MIT](./LICENSE) © Pine Wu & Anthony Fu
