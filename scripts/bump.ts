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

const grammarsChanged = filesChanged.some(i => i.startsWith('packages/tm-grammars/grammars/') || i.startsWith('packages/tm-grammars/index.'))
const themesChanged = filesChanged.some(i => i.startsWith('packages/tm-themes/themes/') || i.startsWith('packages/tm-themes/index.'))

async function bumpVersion(path: string) {
  const raw = await fs.readFile(path, 'utf-8')
  const json = JSON.parse(raw)
  json.version = semver.inc(json.version, 'patch')
  await fs.writeFile(path, `${JSON.stringify(json, null, 2)}\n`, 'utf-8')
}

if (grammarsChanged) {
  console.log('Grammars changed, bumping version...')
  await bumpVersion('packages/tm-grammars/package.json')
}

if (themesChanged) {
  console.log('Themes changed, bumping version...')
  await bumpVersion('packages/tm-themes/package.json')
}

if ((grammarsChanged || themesChanged) && process.env.GITHUB_OUTPUT) {
  console.log('Grammars or themes changed, setting CHANGED=true...', process.env.GITHUB_OUTPUT)
  await fs.writeFile(process.env.GITHUB_OUTPUT, `CHANGED=true`, 'utf-8')
}

if (!grammarsChanged && !themesChanged) {
  console.log('Nothing changed, exiting...')
  process.exit(0)
}

await git.add(['.'])
