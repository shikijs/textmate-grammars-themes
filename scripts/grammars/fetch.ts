import fs from 'node:fs/promises'
import process from 'node:process'
import { fetch } from 'ofetch'
import pLimit from 'p-limit'
import c from 'chalk'
import stringify from 'json-stable-stringify'
import type { GrammarInfo } from '../../packages/tm-grammars/index'
import { downloadFromMarketplace } from '../shared/marketplace'
import { parseGitHubUrl, resolveSourceGitHub } from '../shared/github'
import { generateLicense } from '../shared/license'
import { parseFile } from '../shared/parse'
import { sources } from '../../sources-grammars'

import { fileSizeToHuman } from '../shared/utils'
import { COMMENT_HEAD } from '../shared/head'
import type { GrammarSource } from './types'
import { cleanupGrammar } from './cleanup'

const badge = c.magenta.bold(' grammar ')

const dirOutput = new URL('../../packages/tm-grammars/grammars/', import.meta.url)

await fs.mkdir(dirOutput, { recursive: true })

const limit = pLimit(25)

const scopeToGrammar = new Map<string, GrammarInfo>()

const oldMeta = process.argv.includes('--force')
  ? []
  : await import('../../packages/tm-grammars/index.js')
    .then(m => [...m.grammars, ...m.injections])
    .catch(() => [] as GrammarInfo[])

let changed = false

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      const { grammar, info, skip } = await fetchGrammar(source)
      if (!skip) {
        console.log(badge + c.gray(` Fetched ${source.name}`))
        changed = true
        scopeToGrammar.set(info.scopeName, grammar)
        const url = new URL(`${source.name}.json`, dirOutput)
        await fs.writeFile(url, `${stringify(grammar, { space: 2 })}\n`, 'utf-8')
      }
      else {
        console.log(badge + c.gray(` Skipped ${source.name}`))
      }
      return info
    })),
)

resolvedInfo.sort((a, b) => a.name.localeCompare(b.name))

resolvedInfo.forEach((info) => {
  const grammar = scopeToGrammar.get(info.scopeName)
  if (!grammar)
    return
  const includes = Array.from(JSON.stringify(grammar, null, 2).matchAll(/"include": "(.*?)"/g)).map(i => i[1].replace(/#.*$/g, '')).filter(i => i && !i.startsWith('#'))
  const embedded = new Set([
    ...includes.map(i => resolvedInfo.find(r => r.scopeName === i)?.name).filter(Boolean).filter(i => i !== info.name),
    ...resolvedInfo.filter(i => i.embeddedIn?.includes(info.name)).map(i => i.name),
  ])
  info.embeddedIn?.forEach(i => embedded.delete(i))
  if (embedded.size)
    info.embedded = Array.from(embedded) as string[]
})

if (changed) {
  await fs.writeFile(
    new URL('../index.js', dirOutput),
    [
      COMMENT_HEAD,
      `export const grammars = ${stringify(resolvedInfo.filter(i => !i.embeddedIn), { space: 2 })}\n`,
      `export const injections = ${stringify(resolvedInfo.filter(i => i.embeddedIn), { space: 2 })}\n`,
    ].join('\n'),
    'utf-8',
  )
  await generateREADME(resolvedInfo)
  await fs.writeFile(new URL('../NOTICE', dirOutput), await generateLicense('tm-grammars', resolvedInfo), 'utf-8')
  console.log(badge + c.green(' Finished'))
}
else {
  console.log(badge + c.green(' Finished, nothing changed'))
}

async function fetchGrammar(source: GrammarSource) {
  let raw: string
  let parsed: any
  let info: GrammarInfo = source as GrammarInfo
  if (typeof source.source === 'function') {
    parsed = await source.source()
  }
  else {
    const old = process.argv.includes(source.name)
      ? undefined
      : oldMeta.find(i => i.name === source.name)
    info = await resolveSourceGitHub(source, old)
    if (old === info)
      return { info, skip: true }

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
    parsed = parseFile(fileUrl, raw)
  }

  try {
    // Apply custom patching function
    parsed = source.patch?.(parsed) || parsed
    // Update info
    parsed.scopeName = info.scopeName || parsed.scopeName
    info.scopeName = parsed.scopeName
    info.displayName ||= parsed.name
    parsed.name = info.name
    parsed.displayName = info.displayName
    if (source.injectTo)
      parsed.injectTo = source.injectTo
  }
  catch (e) {
    console.error(`Failed to parse ${info.name} from ${info.source}`)
    throw e
  }

  await fs.writeFile(new URL(`../../../packages/tm-grammars/raw/${info.name}.json`, import.meta.url), `${stringify(parsed, { space: 2 })}\n`, 'utf-8')
  const grammar = await cleanupGrammar(parsed)
    .catch((e) => {
      console.error(`Failed to cleanup ${info.name} from ${info.source}`)
      console.error(e)
      return parsed
    })
  info.byteSize = new TextEncoder().encode(JSON.stringify(grammar)).length
  return {
    grammar,
    info,
  }
}

export async function generateREADME(resolved: GrammarInfo[]) {
  const original = await fs.readFile(new URL('../README.md', dirOutput), 'utf-8')

  function createTable(items: GrammarInfo[]) {
    return [
      '| Name | Alias | Source | License | Deps On | File Size |',
      '| ---- | ----- | ------ | ------- | ------- | --------- |',
      ...items.map(info => `| \`${info.name}\` | ${info.aliases?.map(i => `\`${i}\``).join(' ') || ''} | ${typeof info.source === 'string' ? `[${[parseGitHubUrl(info.source).repo]}](${info.source})` : '-'} | ${info.licenseUrl ? `[${info.license}](${info.licenseUrl})` : ''} | ${info.embedded?.map(i => `\`${i}\``).join(' ') || ''} | ${fileSizeToHuman(info.byteSize)} |`),
    ]
  }
  const replaced = original.replace(
    /<!--list-start-->([\s\S]*?)<!--list-end-->/,
    [
      '<!--list-start-->',
      '## Grammars',
      ...createTable(resolved.filter(i => !i.embeddedIn)),
      '',
      '## Injections',
      '',
      'Injections are grammars that are embedded in other grammars. They are used to aggregate other grammars but not used directly.',
      '',
      ...createTable(resolved.filter(i => i.embeddedIn)),
      '<!--list-end-->',
    ].join('\n'),
  )

  await fs.writeFile(new URL('../README.md', dirOutput), replaced, 'utf-8')
}
