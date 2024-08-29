import { objectPick } from '../shared/utils'
import { highlight } from './highlight'
import { regexpReprint } from './reprint'

export async function cleanupGrammar(lang: any, verify = true) {
  const before = verify ? await highlight(lang) : null

  lang = structuredClone(lang)
  const picked = objectPick(
    lang,
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

  function cleanupMatch(regex: string) {
    // const original = regex

    // https://github.com/shikijs/shiki/issues/591#issuecomment-1961637557
    // It seems the `shellscript` grammars has a selector that missing the backslash escape, we patched them here
    if (lang.name === 'shellscript')
      regex = regex.replace(/\[\^ \t\n/g, '[^ \\t\\n')

    regex = regexpReprint(regex)

    // if (original !== regex) {
    //   console.log({ original, regex })
    // }

    return regex
  }

  function cleanupPattern(a: any) {
    if (a.match)
      a.match = cleanupMatch(a.match)
    if (a.begin)
      a.begin = cleanupMatch(a.begin)
    if (a.end)
      a.end = cleanupMatch(a.end)
    if (a.patterns) {
      a.patterns.forEach((j: any) => {
        cleanupPattern(j)
      })
    }
  }

  if (picked.patterns)
    picked.patterns.forEach(cleanupPattern)
  Object.values(picked.repository || {}).forEach((i: any) => {
    cleanupPattern(i)
  })

  const after = verify ? await highlight(picked) : null

  if (verify && before !== after) {
    throw new Error(`cleanup failed for ${lang.name}`)
  }

  return picked
}
