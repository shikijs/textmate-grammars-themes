import fs from 'node:fs/promises'
import process from 'node:process'
import pLimit from 'p-limit'
import stringify from 'json-stable-stringify'
import c from 'chalk'
import { parseGitHubUrl, resolveSourceGitHub } from '../shared/github'
import { downloadFromMarketplace } from '../shared/marketplace'
import { parseFile } from '../shared/parse'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import { generateLicense } from '../shared/license'
import { sources } from '../../sources-themes'
import type { ThemeSource } from './types'
import { cleanupTheme } from './cleanup'

const badge = c.cyan.bold('  theme  ')

const dirOutput = new URL('../../packages/tm-themes/themes/', import.meta.url)

await fs.mkdir(dirOutput, { recursive: true })

const oldMeta = process.argv.includes('--force')
  ? []
  : await import('../../packages/tm-themes/index.js')
    .then(m => m.themes)
    .catch(() => [] as ThemeInfo[])

let changed = false

const limit = pLimit(25)

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      const { theme, info, skip } = await fetchTheme(source)
      if (!skip) {
        console.log(badge + c.gray(` Fetched ${source.name}`))
        changed = true
        await fs.writeFile(new URL(`${source.name}.json`, dirOutput), `${stringify(theme, { space: 2 })}\n`, 'utf-8')
      }
      else {
        console.log(badge + c.gray(` Skipped ${source.name}`))
      }
      return info
    })),
)

if (changed) {
  resolvedInfo.sort((a, b) => a.name.localeCompare(b.name))
  await fs.writeFile(new URL('../index.js', dirOutput), `export const themes = ${stringify(resolvedInfo, { space: 2 })}\n`, 'utf-8')
  await generateREADME(resolvedInfo)
  await fs.writeFile(new URL('../NOTICE', dirOutput), await generateLicense('tm-themes', resolvedInfo), 'utf-8')
  console.log(badge + c.green(' Finished'))
}
else {
  console.log(badge + c.green(' Finished, nothing changed'))
}

async function fetchTheme(source: ThemeSource) {
  let raw: string
  const old = oldMeta.find(i => i.name === source.name)
  const info = await resolveSourceGitHub(source, old)
  if (info === old)
    return { info, skip: true }
  let fileUrl = info.source.toLowerCase()

  if (source.marketplace) {
    const name = source.marketplace.theme
    const { json, zip } = await downloadFromMarketplace(source.marketplace.name)
    const grammar = json.contributes.themes.find((i: any) => i.label === name)
    if (!grammar)
      throw new Error(`Failed to find theme ${name} in ${source.marketplace.name}`)
    raw = String(zip.getEntry(grammar.path.replace('./', 'extension/'))!.getData())
    fileUrl = grammar.path

    if (grammar.uiTheme === 'vs-dark')
      info.type = 'dark'
    else if (grammar.uiTheme === 'vs')
      info.type = 'light'
  }
  else {
    raw = await fetch(`${info.source}?raw=true`).then(r => r.text())
  }

  if (!info.type)
    info.type = source.name.toLowerCase().includes('light') ? 'light' : 'dark'

  try {
    let parsed = parseFile(fileUrl, raw)
    // Apply custom patching function
    parsed = source.patch?.(parsed) || parsed
    // Update info
    info.displayName ||= parsed.name
    parsed.name = info.name
    parsed.displayName = info.displayName
    parsed.type = info.type

    if (parsed.include) {
      if (source.marketplace)
        throw new Error(`Marketplace themes cannot include other themes`)
      console.log(`Merging ${source.name} with ${parsed.include}`)
      const { theme: included } = await fetchTheme({
        ...source,
        source: new URL(parsed.include, info.source).href,
      })

      parsed = Object.assign({}, included, parsed)

      parsed.colors = {
        ...included.colors,
        ...parsed.colors,
      }
      parsed.tokenColors = [
        ...included.tokenColors || [],
        ...parsed.tokenColors || [],
      ]
      if (included.semanticTokenColors || parsed.semanticTokenColors) {
        parsed.semanticTokenColors = {
          ...included.semanticTokenColors,
          ...parsed.semanticTokenColors,
        }
      }
      delete parsed.include
    }

    return {
      theme: cleanupTheme(parsed),
      info,
    }
  }
  catch (e) {
    console.error(`Failed to parse ${info.name} from ${info.source}`)
    throw e
  }
}

export async function generateREADME(resolved: ThemeInfo[]) {
  const original = await fs.readFile(new URL('../README.md', dirOutput), 'utf-8')

  function format(info: ThemeInfo) {
    return `| ${info.displayName} | \`${info.name}\` | [${[parseGitHubUrl(info.source).repo]}](${info.source}) | ${info.licenseUrl ? `[${info.license}](${info.licenseUrl})` : ''} |`
  }
  const replaced = original.replace(
    /<!--list-start-->([\s\S]*?)<!--list-end-->/,
    [
      '<!--list-start-->',
      '',
      '## Light Themes',
      '',
      '| Name | ID | Source | License |',
      '| ---- | -- | ------ | ------- |',
      ...resolved.filter(i => i.type === 'light').map(info => format(info)),
      '',
      '## Dark Themes',
      '',
      '| Name | ID | Source | License |',
      '| ---- | -- | ------ | ------- |',
      ...resolved.filter(i => i.type === 'dark').map(info => format(info)),
      '<!--list-end-->',
    ].join('\n'),
  )

  await fs.writeFile(new URL('../README.md', dirOutput), replaced, 'utf-8')
}
