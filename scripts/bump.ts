import fs from 'node:fs/promises'
import process from 'node:process'
import semver from 'semver'
import Git from 'simple-git'

const git = Git()

await git.add(['.'])

const result = await git.status()

const currentSHA = (await git.log(['-n', '1', '--pretty=format:%h'])).latest?.hash
const lastReleaseSHA = (await git.log(['-n', '1', '--pretty=format:%h', '--grep', 'ci skip'])).latest?.hash
const diff = lastReleaseSHA ? (await git.diffSummary([lastReleaseSHA!, 'HEAD'])) : undefined
const createdDiffRaw = lastReleaseSHA ? await git.diff([lastReleaseSHA, 'HEAD', '--summary']) : ''

const filesCreated = Array.from(createdDiffRaw.match(/create mode \d+ (.+)/g) || []).map(i => i.replace(/create mode \d+ /, '')).filter(Boolean)

if (lastReleaseSHA)
  console.log('Last release:', lastReleaseSHA)

const filesChanged = [
  ...result.files.map(i => i.path),
  ...diff?.files.map(i => i.file) ?? [],
]

let grammarsVersion = ''
let themesVersion = ''
const grammarsChanged = filesChanged.filter(i => i.startsWith('packages/tm-grammars/grammars/') || i.startsWith('packages/tm-grammars/index.') || i.startsWith('sources-grammars.ts'))
const grammarsCreated = filesCreated.filter(i => i.startsWith('packages/tm-grammars/grammars/'))
const themesChanged = filesChanged.filter(i => i.startsWith('packages/tm-themes/themes/') || i.startsWith('packages/tm-themes/index.') || i.startsWith('sources-themes.ts'))
const themesCreated = filesCreated.filter(i => i.startsWith('packages/tm-themes/themes/'))

async function bumpVersion(path: string, type: 'patch' | 'minor') {
  const raw = await fs.readFile(path, 'utf-8')
  const json = JSON.parse(raw)
  json.version = semver.inc(json.version, type)
  await fs.writeFile(path, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
  return json.version
}

if (grammarsChanged.length) {
  console.log('Grammars changed, bumping version...')
  grammarsVersion = await bumpVersion(
    'packages/tm-grammars/package.json',
    grammarsCreated.length ? 'minor' : 'patch',
  )
}

if (themesChanged.length) {
  console.log('Themes changed, bumping version...')
  themesVersion = await bumpVersion(
    'packages/tm-themes/package.json',
    themesCreated.length ? 'minor' : 'patch',
  )
}

if ((grammarsChanged.length || themesChanged.length)) {
  console.log('Grammars or themes changed, committing...')
  if (process.env.GITHUB_OUTPUT) {
    console.log('Grammars or themes changed, setting CHANGED=true...', process.env.GITHUB_OUTPUT)
    await fs.writeFile(process.env.GITHUB_OUTPUT, `CHANGED=true`, 'utf-8')
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const REPO = 'https://github.com/shikijs/textmate-grammars-themes'
    await fs.writeFile(
      process.env.GITHUB_STEP_SUMMARY,
      [
        `[Since last release](${REPO}/compare/${lastReleaseSHA}...${currentSHA}):`,

        ...grammarsChanged.length
          ? [
              '## Grammar Changes',
              ...grammarsChanged.map(i => `- [${i}](https://github.com/shikijs/textmate-grammars-themes/blob/${currentSHA}/${i}) ${filesCreated.includes(i) ? '🆕' : ''}`),
              '',
              `🚀 Released as \`v${grammarsVersion}\``,
            ]
          : [],

        ...themesChanged.length
          ? [
              '## Theme Changes',
              ...themesChanged.map(i => `- [${i}](https://github.com/shikijs/textmate-grammars-themes/blob/${currentSHA}/${i}) ${filesCreated.includes(i) ? '🆕' : ''}`),
              '',
              `🚀 Released as \`v${themesVersion}\``,
            ]
          : [],
      ].join('\n'),
      'utf-8',
    )
  }
  await git.add(['.'])
}
else {
  console.log('Nothing changed, exiting...')
  if (process.env.GITHUB_STEP_SUMMARY) {
    await fs.writeFile(
      process.env.GITHUB_STEP_SUMMARY,
      'Nothing changed, skipping...',
      'utf-8',
    )
  }
  process.exit(0)
}
