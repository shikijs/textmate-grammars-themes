import fs from 'node:fs/promises'
import process from 'node:process'
import Git from 'simple-git'
import semver from 'semver'

const git = Git()

await git.add(['.'])

const result = await git.status()

const files = result.files.map(i => i.path)

const grammarsChanged = files.some(i => i.startsWith('packages/tm-grammars/grammars'))
const themesChanged = files.some(i => i.startsWith('packages/tm-themes/themes'))

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

if ((grammarsChanged || themesChanged) && process.env.GITHUB_ENV) {
  console.log('Grammars or themes changed, setting TM_CHANAGED=true...', process.env.GITHUB_ENV)
  await fs.writeFile(process.env.GITHUB_ENV, `TM_CHANAGED=true`, 'utf-8')
}

if (!grammarsChanged && !themesChanged) {
  console.log('Nothing changed, exiting...')
  process.exit(0)
}

await git.add(['.'])
