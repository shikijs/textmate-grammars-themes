import fs from 'node:fs/promises'
import { fetch } from 'ofetch'
import pLimit from 'p-limit'
import stringify from 'json-stable-stringify'
import type { GrammarInfo } from '../../packages/tm-grammars/index'
import { octokit } from '../shared/octokit'
import { downloadFromMarketplace } from '../shared/marketplace'
import { sources } from './sources'

import type { GrammarSource } from './types'
import { cleanupLanguageReg, parseGitHubUrl, parseGrammar } from './utils'

const dirOutput = new URL('../../packages/tm-grammars/grammars/', import.meta.url)

await fs.mkdir(dirOutput, { recursive: true })

const limit = pLimit(25)

const scopeToGrammar = new Map<string, GrammarInfo>()

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      console.log(`Fetching ${source.name}...`)
      const { grammar, info } = await fetchGrammar(source)
      scopeToGrammar.set(info.scopeName, grammar)
      await fs.writeFile(new URL(`${source.name}.json`, dirOutput), `${stringify(grammar, { space: 2 })}\n`, 'utf-8')
      return info
    })),
)

resolvedInfo.sort((a, b) => a.name.localeCompare(b.name))

resolvedInfo.forEach((info) => {
  const grammar = scopeToGrammar.get(info.scopeName)!
  const includes = Array.from(JSON.stringify(grammar, null, 2).matchAll(/"include": "(.*?)"/g)).map(i => i[1].replace(/#.*$/g, '')).filter(i => i && !i.startsWith('#'))
  const embedded = Array.from(new Set(includes.map(i => scopeToGrammar.get(i)?.name).filter(Boolean).filter(i => i !== info.name)))
  if (embedded.length)
    info.embedded = embedded as string[]
})

await fs.writeFile(new URL('../index.js', dirOutput), `export default ${stringify(resolvedInfo, { space: 2 })}\n`, 'utf-8')
await generateREADME(resolvedInfo)
await generateLicense(resolvedInfo)

async function fetchGrammar(source: GrammarSource) {
  let raw: string
  const info = await resolveSourceGitHub(source)
  let fileUrl = info.source.toLowerCase()

  if (source.marketplace) {
    const name = source.marketplace.grammar
    const { json, zip } = await downloadFromMarketplace(source.marketplace.name)
    console.log(json.contributes.grammars)
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
    let parsed = parseGrammar(fileUrl, raw)
    // Apply custom patching function
    parsed = source.patch?.(parsed) || parsed
    // Update info
    info.scopeName = parsed.scopeName
    info.displayName ||= parsed.name
    parsed.name = info.name
    parsed.displayName = info.displayName
    return {
      grammar: cleanupLanguageReg(parsed),
      info,
    }
  }
  catch (e) {
    console.error(`Failed to parse ${info.name} from ${info.source}`)
    throw e
  }
}

export function getLicenseUrl(repo: string) {
  return octokit.request('GET /repos/{owner}/{repo}/license', { owner: repo.split('/')[0], repo: repo.split('/')[1] })
    .then((r) => {
      return r.data
    })
}

export function getSha(repo: string, branch = 'main') {
  return octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', { owner: repo.split('/')[0], repo: repo.split('/')[1], ref: branch })
    .then(r => r.data.sha)
}

export async function resolveSourceGitHub(source: GrammarSource) {
  try {
    const {
      patch: _, // exclude keys
      marketplace: __,
      ...rest
    } = source
    const info = rest as GrammarInfo
    const { repo, branch, path } = parseGitHubUrl(source.source as string)!

    await Promise.all([
      getLicenseUrl(repo)
        .catch(() => undefined)
        .then((license) => {
          if (!license)
            return
          info.licenseUrl = license.download_url!
          info.license = license.license!.spdx_id!
        }),
      getSha(repo, branch)
        .then(sha => info.sha = sha),
    ])

    if (!info.sha)
      throw new Error(`Failed to resolve sha for ${source.name} from ${source.source}`)

    info.source = `https://github.com/${repo}/blob/${info.sha || branch}/${path}`

    return info
  }
  catch (e) {
    console.error(`Failed to resolve source for ${source.name} from ${source.source}`)
    throw e
  }
}

export async function generateLicense(resolved: GrammarInfo[]) {
  const str = [
    `THIRD-PARTY SOFTWARE NOTICES AND INFORMATION

This project incorporates material from the project(s) listed below
(collectively, “Third Party Code”).
The author(s) of tm-grammars are not the original author(s) of the Third Party
Code.
The original copyright notice and license under which the author(s) received
such Third Party Code are set out below.
This Third Party Code is licensed to you under their original license terms set
forth below.

The following files/folders contain third party software:
`,
  ]

  const licenses = new Map<string, {
    spdx: string
    content: string
    files: string[]
  }>()

  for (const info of resolved) {
    if (!info.licenseUrl)
      continue
    const license = licenses.get(info.licenseUrl!) ?? {
      spdx: info.license!,
      content: '',
      files: [],
    }
    license.files.push(info.name)
    licenses.set(info.licenseUrl!, license)
  }

  const limit = pLimit(25)
  await Promise.all(
    [...licenses.keys()].map(url => limit(async () => {
      console.log(`Fetching License: ${url}...`)
      const content = await fetch(url).then(r => r.text())
      licenses.get(url)!.content = content
    })),
  )

  for (const [url, { files, spdx, content }] of licenses.entries()) {
    str.push(
      '=========================================================================================================',
      `Files:   ${files.map(name => `${name}.json`).join(', ')}`,
      `License: ${url}`,
      `SPDX:    ${spdx}`,
      '---------------------------------------------------------------------------------------------------------',
      content,
    )
  }

  await fs.writeFile(new URL('../NOTICE', dirOutput), str.join('\n'), 'utf-8')
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
