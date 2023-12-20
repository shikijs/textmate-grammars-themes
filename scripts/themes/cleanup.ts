import { objectPick } from '../shared/utils'

export function cleanupTheme(lang: any) {
  return objectPick(
    lang,
    [
      'name',
      'displayName',
      'type',
      'colors',
      'fg',
      'bg',
      'include',
      'settings',
      'tokenColors',
      'semanticHighlighting',
      'semanticTokenColors',
    ],
    // (_, key, value) => console.log('lang key removal', key, '|', value),
  )
}
