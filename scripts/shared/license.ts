import type { GrammarInfo } from '../../packages/tm-grammars/index'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import c from 'chalk'
import { fetch } from 'ofetch'
import pLimit from 'p-limit'
import { parseGitHubUrl } from './github'

const badge = c.yellow.bold(' license ')

const _cache = new Map<string, Promise<string>>()

/**
 * Some `licenseUrl`s point to the HTML "blob" view of a file on github.com
 * instead of the raw file content (raw.githubusercontent.com). Rewrite
 * those to the raw URL so we never fetch an HTML page for the NOTICE file.
 */
export function toRawGitHubUrl(url: string): string {
  if (!/^https?:\/\/(?:www\.)?github\.com\//.test(url))
    return url
  try {
    const { repo, branch, path } = parseGitHubUrl(url)
    return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`
  }
  catch {
    return url
  }
}

/**
 * Detect whether the fetched "license" content is actually an HTML
 * document (e.g. a GitHub web page, an error page, or a login wall)
 * rather than the raw license text, so it never leaks into the NOTICE file.
 */
export function isLikelyHtml(content: string): boolean {
  return /^\s*(?:<!DOCTYPE html|<html[\s>])/i.test(content)
}

async function fetchLicenseContent(url: string): Promise<string> {
  const rawUrl = toRawGitHubUrl(url)
  const res = await fetch(rawUrl)
  const contentType = res.headers.get('content-type') || ''
  const content = await res.text()
  if (contentType.includes('text/html') || isLikelyHtml(content)) {
    throw new Error(
      `Refusing to embed HTML content into NOTICE: license URL "${url}" `
      + `(fetched as "${rawUrl}") returned an HTML page instead of the raw license text. `
      + `Fix the \`licenseUrl\` in the source config to point to the raw file.`,
    )
  }
  return content
}

export function getLicenseContent(url: string) {
  if (!_cache.has(url))
    _cache.set(url, fetchLicenseContent(url))
  return _cache.get(url)!
}

export async function generateLicense(name: string, resolved: (GrammarInfo | ThemeInfo)[]) {
  const str = [
    `THIRD-PARTY SOFTWARE NOTICES AND INFORMATION

This project incorporates material from the project(s) listed below
(collectively, “Third Party Code”).
The author(s) of ${name} are not the original author(s) of the Third Party
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
      console.log(badge + c.yellow(` fetching ${url}`))
      const content = await getLicenseContent(url)
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

  return str.join('\n')
}
