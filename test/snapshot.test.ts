import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHighlighterCore } from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import { expect, it } from 'vitest'
import { grammars } from '../packages/tm-grammars/index'
import theme from '../packages/tm-themes/themes/vitesse-black.json'

const sampleDir = fileURLToPath(new URL('../samples', import.meta.url))

for (const g of grammars) {
  const sample = join(sampleDir, `${g.name}.sample`)
  if (!await fs.stat(sample).catch(() => false)) {
    continue
  }
  it(g.name, async () => {
    const highlighter = await createHighlighterCore({
      themes: [theme as any],
      langs: [() => import(`../packages/tm-grammars/grammars/${g.name}.json`)],
      engine: createOnigurumaEngine(() => import('@shikijs/engine-oniguruma/wasm-inlined')),
    })

    try {
      await expect(
        highlighter
          .codeToTokensBase(await fs.readFile(sample, 'utf-8'), { lang: g.name, theme: 'vitesse-black' })
          .flat()
          .map(i => (i.color || '').padEnd(15, ' ') + i.content)
          .join('\n'),
      )
        .toMatchFileSnapshot(`./__snapshots__/${g.name}.txt`)
    }
    finally {
      highlighter.dispose()
    }
  })
}
