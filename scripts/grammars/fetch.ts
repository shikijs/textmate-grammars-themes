import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fetch } from 'ofetch'
import pLimit from 'p-limit'
import stringify from 'json-stable-stringify'
import type { GrammarInfo } from '../../packages/tm-grammars/index'
import { downloadFromMarketplace } from '../shared/marketplace'
import { parseGitHubUrl, resolveSourceGitHub } from '../shared/github'
import { generateLicense } from '../shared/license'
import { parseFile } from '../shared/parse'
import { sources } from './sources'

import type { GrammarSource } from './types'
import { cleanupGrammar } from './cleanup'

const dirOutput = new URL('../../packages/tm-grammars/grammars/', import.meta.url)

await fs.rm(dirOutput, { recursive: true })
await fs.mkdir(dirOutput, { recursive: true })

const limit = pLimit(25)

const scopeToGrammar = new Map<string, GrammarInfo>()

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      console.log(`Fetching ${source.name}...`)
      const { grammar, info } = await fetchGrammar(source)
      scopeToGrammar.set(info.scopeName, grammar)
      const url = new URL(`${source.name}.json`, dirOutput)
      if (existsSync(url))
        throw new Error(`File ${url} already exists`)
      await fs.writeFile(url, `${stringify(grammar, { space: 2 })}\n`, 'utf-8')
      return info
    })),
)

resolvedInfo.sort((a, b) => a.name.localeCompare(b.name))

resolvedInfo.forEach((info) => {
  const grammar = scopeToGrammar.get(info.scopeName)!
  const includes = Array.from(JSON.stringify(grammar, null, 2).matchAll(/"include": "(.*?)"/g)).map(i => i[1].replace(/#.*$/g, '')).filter(i => i && !i.startsWith('#'))
  const embedded = Array.from(new Set([
    ...includes.map(i => scopeToGrammar.get(i)?.name).filter(Boolean).filter(i => i !== info.name),
    ...resolvedInfo.filter(i => i.embeddedIn?.includes(info.name)).map(i => i.name),
  ]))
  if (embedded.length)
    info.embedded = embedded as string[]
})

await fs.writeFile(
  new URL('../index.js', dirOutput),
  [
    `export const grammars = ${stringify(resolvedInfo.filter(i => !i.embeddedIn), { space: 2 })}\n`,
    `export const injections = ${stringify(resolvedInfo.filter(i => i.embeddedIn), { space: 2 })}\n`,
  ].join('\n'),
  'utf-8',
)
await generateREADME(resolvedInfo)
await fs.writeFile(new URL('../NOTICE', dirOutput), await generateLicense('tm-grammars', resolvedInfo), 'utf-8')

async function fetchGrammar(source: GrammarSource) {
  let raw: string
  const info = await resolveSourceGitHub(source)
  let fileUrl = info.source.toLowerCase()

  if (source.marketplace) {
    const name = source.marketplace.grammar
    const { json, zip } = await downloadFromMarketplace(source.marketplace.name)
    const grammar = json.contributes.grammars.find((i: any) => i.language === name)
    if (!grammar)
      throw new Error(`Failed to find grammar ${name} in ${source.marketplace.name}`)
    raw = String(zip.getEntry(grammar.path.replace('./', 'extension/'))!.getData())
    fileUrl = grammar.path
  }
  else {
    raw = await fetch(`${info.source}?raw=true`).then(r => r.text())
  }

  try {
    let parsed = parseFile(fileUrl, raw)
    // Apply custom patching function
    parsed = source.patch?.(parsed) || parsed
    // Update info
    info.scopeName = parsed.scopeName
    info.displayName ||= parsed.name
    parsed.name = info.name
    parsed.displayName = info.displayName
    return {
      grammar: cleanupGrammar(parsed),
      info,
    }
  }
  catch (e) {
    console.error(`Failed to parse ${info.name} from ${info.source}`)
    throw e
  }
}

export async function generateREADME(resolved: GrammarInfo[]) {
  const original = await fs.readFile(new URL('../README.md', dirOutput), 'utf-8')
  const replaced = original.replace(
    /<!--list-start-->([\s\S]*?)<!--list-end-->/,
    [
      '<!--list-start-->',
      '| Name | Alias | Source | License | Deps On |',
      '| ---- | ----- | ------ | ------- | ------- |',
      ...resolved.map(info => `| \`${info.name}\` | ${info.alias?.map(i => `\`${i}\``).join(' ') || ''} | [${[parseGitHubUrl(info.source).repo]}](${info.source}) | ${info.licenseUrl ? `[${info.license}](${info.licenseUrl})` : ''} | ${info.embedded?.map(i => `\`${i}\``).join(' ') || ''} |`),
      '<!--list-end-->',
    ].join('\n'),
  )

  await fs.writeFile(new URL('../README.md', dirOutput), replaced, 'utf-8')
}
