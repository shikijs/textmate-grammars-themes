import pLimit from 'p-limit'
import { fetch } from 'ofetch'
import type { GrammarInfo } from '../../packages/tm-grammars/index'
import type { ThemeInfo } from '../../packages/tm-themes/index'

const _cache = new Map<string, Promise<string>>()

export function getLicenseContent(url: string) {
  if (!_cache.has(url))
    _cache.set(url, fetch(url).then(r => r.text()))
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
      console.log(`Fetching License: ${url}...`)
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
