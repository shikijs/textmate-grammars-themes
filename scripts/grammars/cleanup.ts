import { optimize } from 'oniguruma-parser/optimizer'
import { objectPick } from '../shared/utils'
import { highlight } from './highlight'

export function traverseGrammarPatterns(a: any, callback: (pattern: string) => any | void): void {
  if (Array.isArray(a)) {
    a.forEach((j: any) => {
      traverseGrammarPatterns(j, callback)
    })
    return
  }
  if (!a || typeof a !== 'object')
    return

  delete a.comment

  if (a.foldingStartMarker) {
    const pattern = callback(a.foldingStartMarker)
    if (pattern != null)
      a.foldingStartMarker = pattern
  }
  if (a.foldingStopMarker) {
    const pattern = callback(a.foldingStopMarker)
    if (pattern != null)
      a.foldingStopMarker = pattern
  }
  if (a.firstLineMatch) {
    const pattern = callback(a.firstLineMatch)
    if (pattern != null)
      a.firstLineMatch = pattern
  }
  if (a.match) {
    const pattern = callback(a.match)
    if (pattern != null)
      a.match = pattern
  }
  if (a.begin) {
    const pattern = callback(a.begin)
    if (pattern != null)
      a.begin = pattern
  }
  if (a.end) {
    const pattern = callback(a.end)
    if (pattern != null)
      a.end = pattern
  }
  if (a.while) {
    const pattern = callback(a.while)
    if (pattern != null)
      a.while = pattern
  }
  if (a.patterns) {
    traverseGrammarPatterns(a.patterns, callback)
  }
  if (a.captures) {
    traverseGrammarPatterns(Object.values(a.captures), callback)
  }
  if (a.beginCaptures) {
    traverseGrammarPatterns(Object.values(a.beginCaptures), callback)
  }
  if (a.endCaptures) {
    traverseGrammarPatterns(Object.values(a.endCaptures), callback)
  }
  if (a.injections) {
    traverseGrammarPatterns(Object.values(a.injections), callback)
  }
  Object.values(a.repository || {}).forEach((j: any) => {
    traverseGrammarPatterns(j, callback)
  })
}

export async function cleanupGrammar(grammar: any, verify = true) {
  grammar = structuredClone(grammar)
  const before = verify ? await highlight(grammar) : null

  traverseGrammarPatterns(
    grammar,
    (pattern) => {
      let result = pattern
      try {
        // Optimize Oniguruma regexes by minifying them and, in some cases, improving their
        // performance
        result = optimize(pattern, {
          rules: {
            // Needed since TextMate grammars merge backrefs across patterns
            allowOrphanBackrefs: true,
            // Follow `vscode-oniguruma` which enables this Oniguruma option by default
            captureGroup: true,
          },
        }).pattern
      }
      catch {
        // Ignore errors; either the pattern is an invalid Oniguruma regex (most likely) or it uses
        // a feature that the `oniguruma-parser` library doesn't support
      }
      return result
    },
  )

  grammar = objectPick(
    grammar,
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

  const after = verify ? await highlight(grammar) : null

  if (verify && before !== after) {
    throw new Error(`Cleanup failed for ${grammar.name}`)
  }

  return grammar
}
