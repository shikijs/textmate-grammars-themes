import fs from 'node:fs/promises'
import { fetch } from 'ofetch'
import pLimit from 'p-limit'
import stringify from 'json-stable-stringify'
import { sources } from './sources'

import type { GrammarInfo, GrammarSource } from './types'
import { cleanupLanguageReg, parseGitHubUrl, parseGrammar } from './utils'
import { octokit } from './octokit'

const dirOutput = new URL('../../packages/tm-grammars/grammars/', import.meta.url)

await fs.mkdir(dirOutput, { recursive: true })

const limit = pLimit(25)

const NOTICE_HEAD = `THIRD-PARTY SOFTWARE NOTICES AND INFORMATION

This project incorporates material from the project(s) listed below
(collectively, “Third Party Code”).
The author(s) of tm-grammars are not the original author(s) of the Third Party
Code.
The original copyright notice and license under which the author(s) received
such Third Party Code are set out below.
This Third Party Code is licensed to you under their original license terms set
forth below.

The following files/folders contain third party software:
`

const resolvedInfo = await Promise.all(
  sources
    .map(source => limit(async () => {
      console.log(`Fetching ${source.name}...`)
      const { grammar, info } = await fetchGrammar(source)
      await fs.writeFile(new URL(`${source.name}.json`, dirOutput), `${stringify(grammar, { space: 2 })}\n`, 'utf-8')
      return info
    })),
)

await fs.writeFile(new URL('../index.js', dirOutput), `export default ${stringify(resolvedInfo, { space: 2 })}\n`, 'utf-8')
await generateREADME(resolvedInfo)
await generateLicense(resolvedInfo)

async function fetchGrammar(source: GrammarSource) {
  if (source.source.startsWith('marketplace:'))
    throw new Error('Marketplace grammars are not supported yet')
  const info = await resolveSource(source)
  const raw = await fetch(`${info.source}?raw=true`).then(r => r.text())
  const url = info.source.toLowerCase()
  try {
    const parsed = parseGrammar(url, raw)
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

export async function resolveSource(source: GrammarSource) {
  try {
    const info: GrammarInfo = { ...source }
    const { repo, branch, path } = parseGitHubUrl(source.source)!

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
    NOTICE_HEAD,
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
      '| Name | Alias | Source | License |',
      '| ---- | ----- | ------ | ------- |',
      ...resolved.map(info => `| \`${info.name}\` | ${info.alias?.map(i => `\`${i}\``).join(' ') || ''} | [${[parseGitHubUrl(info.source).repo]}](${info.source}) | ${info.licenseUrl ? `[${info.license}](${info.licenseUrl})` : ''} |`),
      '<!--list-end-->',
    ].join('\n'),
  )

  await fs.writeFile(new URL('../README.md', dirOutput), replaced, 'utf-8')
}
