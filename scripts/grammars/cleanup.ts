import { syntaxLowering } from 'oniguruma-to-js'
import { loweringTextmateGrammar } from 'oniguruma-to-js/textmate'
import { objectPick } from '../shared/utils'
import { highlight } from './highlight'

export async function cleanupGrammar(grammar: any, verify = true) {
  const before = verify ? await highlight(grammar) : null

  let converted = loweringTextmateGrammar(
    grammar,
    {
      handlePattern(pattern) {
        // https://github.com/shikijs/shiki/issues/591#issuecomment-1961637557
        // It seems the `shellscript` grammars has a selector that missing the backslash escape, we patched them here
        if (grammar.name === 'shellscript') {
          pattern = pattern.replace(/\[\^ \t\n/g, '[^ \\t\\n')
        }

        // Rewrite Oniguruma patterns to more JS-friendly syntax
        // Also it would "compress" the regex to save some bytes
        return syntaxLowering(pattern)
      },
    },
  )

  converted = objectPick(
    converted,
    [
      'aliases',
      'balancedBracketSelectors',
      'displayName',
      'embeddedLangs',
      'fileTypes',
      'firstLineMatch',
      'injections',
      'injectionSelector',
      'injectTo',
      'name',
      'patterns',
      'repository',
      'scopeName',
      'foldingStopMarker',
      'foldingStartMarker',
      'unbalancedBracketSelectors',
    ],
    // (_, key, value) => console.log('lang key removal', key, '|', value),
  )

  const after = verify ? await highlight(converted) : null

  if (verify && before !== after) {
    throw new Error(`cleanup failed for ${grammar.name}`)
  }

  return converted
}
