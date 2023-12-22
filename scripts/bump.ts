import fs from 'node:fs/promises'
import process from 'node:process'
import Git from 'simple-git'
import semver from 'semver'

const git = Git()

await git.add(['.'])

const result = await git.status()

const lastReleaseSHA = (await git.log(['-n', '1', '--pretty=format:%h', '--', 'packages/tm-grammars/package.json', 'packages/tm-themes/package.json'])).latest?.hash
const diff = !lastReleaseSHA
  ? []
  : (await git.diffSummary([lastReleaseSHA!, 'HEAD']))?.files || []

const filesChanged = [
  ...result.files.map(i => i.path),
  ...diff.map(i => i.file),
]

let grammarsVersion = ''
let themesVersion = ''
const grammarsChanged = filesChanged.filter(i => i.startsWith('packages/tm-grammars/grammars/') || i.startsWith('packages/tm-grammars/index.'))
const themesChanged = filesChanged.filter(i => i.startsWith('packages/tm-themes/themes/') || i.startsWith('packages/tm-themes/index.'))

async function bumpVersion(path: string) {
  const raw = await fs.readFile(path, 'utf-8')
  const json = JSON.parse(raw)
  json.version = semver.inc(json.version, 'patch')
  await fs.writeFile(path, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
  return json.version
}

if (grammarsChanged.length) {
  console.log('Grammars changed, bumping version...')
  grammarsVersion = await bumpVersion('packages/tm-grammars/package.json')
}

if (themesChanged.length) {
  console.log('Themes changed, bumping version...')
  themesVersion = await bumpVersion('packages/tm-themes/package.json')
}

if ((grammarsChanged.length || themesChanged.length)) {
  console.log('Grammars or themes changed, committing...')
  if (process.env.GITHUB_OUTPUT) {
    console.log('Grammars or themes changed, setting CHANGED=true...', process.env.GITHUB_OUTPUT)
    await fs.writeFile(process.env.GITHUB_OUTPUT, `CHANGED=true`, 'utf-8')
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    const REPO = 'https://github.com/antfu/textmate-grammars-themes'
    await fs.writeFile(
      process.env.GITHUB_STEP_SUMMARY,
      [
        `Since [last release](${REPO}/compare/${lastReleaseSHA}...main):`,

        ...grammarsChanged.length
          ? [
              '## Grammar Changes',
              ...grammarsChanged.map(i => `- ${i}`),
              '',
              `🚀 Released as \`v${grammarsVersion}\``,
            ]
          : [],

        ...themesChanged.length
          ? [
              '## Theme Changes',
              ...themesChanged.map(i => `- ${i}`),
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
