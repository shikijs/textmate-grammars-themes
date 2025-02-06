import fs from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHighlighterCore } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import { expect, it } from 'vitest'
import { grammars } from '../packages/tm-grammars/index'
import theme from '../packages/tm-themes/themes/vitesse-black.json'

const sampleDir = fileURLToPath(new URL('../samples', import.meta.url))

const JS_ENGINE_EXPECT_FAIL: string[] = [
  'swift',
  'purescript',
]

const JS_ENGINE_EXPECT_MISMATCH: string[] = [
  'emacs-lisp',
]

for (const g of grammars) {
  const sample = join(sampleDir, `${g.name}.sample`)
  if (!await fs.stat(sample).catch(() => false)) {
    continue
  }
  it(g.name, async () => {
    using shikiWasm = await createHighlighterCore({
      themes: [theme as any],
      langs: [() => import(`../packages/tm-grammars/grammars/${g.name}.json`)],
      engine: createOnigurumaEngine(() => import('@shikijs/engine-oniguruma/wasm-inlined')),
    })
    using shikiJs = await createHighlighterCore({
      themes: [theme as any],
      langs: [() => import(`../packages/tm-grammars/grammars/${g.name}.json`)],
      engine: createJavaScriptRegexEngine(),
    })

    const resultWasm = shikiWasm
      .codeToTokensBase(await fs.readFile(sample, 'utf-8'), { lang: g.name, theme: 'vitesse-black' })
      .flat()
      .map(i => (i.color || '').padEnd(15, ' ') + i.content)
      .join('\n')

    await expect(resultWasm)
      .toMatchFileSnapshot(`./__snapshots__/${g.name}.txt`)

    let resultJs = ''
    let resultJsError: any
    try {
      resultJs = shikiJs
        .codeToTokensBase(await fs.readFile(sample, 'utf-8'), { lang: g.name, theme: 'vitesse-black' })
        .flat()
        .map(i => (i.color || '').padEnd(15, ' ') + i.content)
        .join('\n')
    }
    catch (e) {
      resultJsError = e
    }

    if (JS_ENGINE_EXPECT_FAIL.includes(g.name)) {
      expect(resultJsError)
        .toBeTruthy()
      return
    }
    else if (resultJsError) {
      throw resultJsError
    }

    if (JS_ENGINE_EXPECT_MISMATCH.includes(g.name)) {
      expect(resultJs).not.toBe(resultWasm)
    }
    else {
      expect(resultJs).toBe(resultWasm)
    }
  })
}
