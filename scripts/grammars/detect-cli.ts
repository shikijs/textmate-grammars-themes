import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { basename } from 'node:path'
import fg from 'fast-glob'
import { FEATURES_POLYFILLABLE, FEATURES_SUPPORTED_BY_JS, detectRegexFeatures } from 'oniguruma-to-js/detect'

export function getPatterns(grammar: any) {
  const patterns = new Set<string>()

  function traverse(a: any): void {
    if (!a)
      return
    if (a.match)
      patterns.add(a.match)
    if (a.begin)
      patterns.add(a.begin)
    if (a.end)
      patterns.add(a.end)
    if (a.patterns) {
      a.patterns.forEach((j: any) => {
        traverse(j)
      })
    }
    Object.values(a.repository || {}).forEach((j: any) => {
      traverse(j)
    })
  }

  traverse(grammar)

  return patterns
}

export async function run() {
  const files = await fg('*.json', {
    cwd: fileURLToPath(new URL('../../packages/tm-grammars/raw', import.meta.url)),
    absolute: true,
  })
    .then(files => Promise.all(files.sort().map(async (f) => {
      const content = JSON.parse(await fs.readFile(f, 'utf-8'))
      const name = basename(f, '.json')
      return {
        path: f,
        name,
        content,
      }
    })))

  const reports = files.map((f) => {
    const patterns = getPatterns(f.content)
    const set = detectRegexFeatures([...patterns])
    return {
      ...f,
      patterns,
      features: set,
    }
  })

  const markdown: string[] = [
    '| Language | Features Not Supported | Features Polyfillable | Features Supported by JS |',
    '| --- | --- | --- | --- |',
  ]

  reports.forEach((r) => {
    const featuresList = [...r.features].sort()
    const featuresJs = featuresList.filter(i => FEATURES_SUPPORTED_BY_JS.includes(i))
    const featuresPolyfill = featuresList.filter(i => FEATURES_POLYFILLABLE.includes(i))
    const featuresUnsupported = featuresList.filter(i => !FEATURES_SUPPORTED_BY_JS.includes(i) && !FEATURES_POLYFILLABLE.includes(i))

    markdown.push(
      `| ${
        [
          r.name,
          featuresUnsupported.map(i => `\`${i}\``).join(' '),
          featuresPolyfill.map(i => `\`${i}\``).join(' '),
          featuresJs.map(i => `\`${i}\``).join(' '),
        ].join(' | ')
      } |`,
    )
  })

  await fs.writeFile(new URL('../../packages/tm-grammars/grammar-syntaxes.md', import.meta.url), markdown.join('\n'), 'utf-8')
}

run()
