import fs from 'node:fs/promises'
import pLimit from 'p-limit'
import stringify from 'json-stable-stringify'
import { parseGitHubUrl, resolveSourceGitHub } from '../shared/github'
import { downloadFromMarketplace } from '../shared/marketplace'
import { parseFile } from '../shared/parse'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import { generateLicense } from '../shared/license'
import { sources } from '../../sources-themes'
import type { ThemeSource } from './types'
import { cleanupTheme } from './cleanup'

const dirOutput = new URL('../../packages/tm-themes/themes/', import.meta.url)

await fs.rm(dirOutput, { recursive: true })
await fs.mkdir(dirOutput, { recursive: true })

const limit = pLimit(25)

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      console.log(`Fetching ${source.name}...`)
      const { theme, info } = await fetchTheme(source)
      await fs.writeFile(new URL(`${source.name}.json`, dirOutput), `${stringify(theme, { space: 2 })}\n`, 'utf-8')
      return info
    })),
)

resolvedInfo.sort((a, b) => a.name.localeCompare(b.name))

await fs.writeFile(new URL('../index.js', dirOutput), `export const themes = ${stringify(resolvedInfo, { space: 2 })}\n`, 'utf-8')
await generateREADME(resolvedInfo)
await fs.writeFile(new URL('../NOTICE', dirOutput), await generateLicense('tm-themes', resolvedInfo), 'utf-8')

async function fetchTheme(source: ThemeSource) {
  let raw: string
  const info = await resolveSourceGitHub(source)
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
  const replaced = original.replace(
    /<!--list-start-->([\s\S]*?)<!--list-end-->/,
    [
      '<!--list-start-->',
      '| Name | Source | License | Type |',
      '| ---- | ------ | ------- | ---- |',
      ...resolved.map(info => `| \`${info.name}\` | [${[parseGitHubUrl(info.source).repo]}](${info.source}) | ${info.licenseUrl ? `[${info.license}](${info.licenseUrl})` : ''} | \`${info.type}\` |`),
      '<!--list-end-->',
    ].join('\n'),
  )

  await fs.writeFile(new URL('../README.md', dirOutput), replaced, 'utf-8')
}
