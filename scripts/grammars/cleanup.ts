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

  function cleanupMatch(match: string) {
    const lines = match.split(/\n/g)
    if (lines.length === 1)
      return match
    return lines
      .map(i => i.replace(/\s#.*$/, '').trim())
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
