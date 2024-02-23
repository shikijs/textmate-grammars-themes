import { objectPick } from '../shared/utils'

export function cleanupGrammar(lang: any) {
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

  const reGrammarComment = /\s#.*$/
  function cleanupMatch(match: string) {
    // https://github.com/shikijs/shiki/issues/591#issuecomment-1961637557
    // It seems the `shellscript` grammars has a selector that missing the backslash escape, we patched them here
    if (lang.name === 'shellscript')
      match = match.replace(/\[\^ \t\n/g, '[^ \\t\\n')

    const lines = match
      .split(/\n/g)
    if (lines.length === 1)
      return match
    return lines
      .map(i => i.replace(reGrammarComment, '').trim())
      .join('\n')
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

  return picked
}
