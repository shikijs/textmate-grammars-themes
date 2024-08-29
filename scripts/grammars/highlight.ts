import fs from 'node:fs/promises'
import { createHighlighterCore } from '@shikijs/core'

export async function highlight(grammar: any) {
  const sample = new URL(`../../samples/${grammar.name}.sample`, import.meta.url)
  if (!await fs.stat(sample).catch(() => false)) {
    console.warn('Missing sample for', grammar.name)
    return
  }

  const highlighter = await createHighlighterCore({
    themes: [() => import('../../packages/tm-themes/themes/vitesse-black.json') as any],
    langs: [grammar],
    loadWasm: () => import('@shikijs/core/wasm-inlined'),
  })

  try {
    return highlighter
      .codeToTokensBase(await fs.readFile(sample, 'utf-8'), { lang: grammar.name, theme: 'vitesse-black' })
      .flat()
      .map(i => (i.color || '').padEnd(15, ' ') + i.content)
      .join('\n')
  }
  finally {
    highlighter.dispose()
  }
}
