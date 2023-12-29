import { objectPick } from '../shared/utils'

export function cleanupTheme(lang: any) {
  const cleaned = objectPick(
    lang,
    [
      'name',
      'displayName',
      'type',
      'colors',
      'fg',
      'bg',
      'settings',
      'tokenColors',
      'semanticHighlighting',
      'semanticTokenColors',
    ],
    // (_, key, value) => console.log('lang key removal', key, '|', value),
  )
  cleaned.tokenColors ||= cleaned.settings
  delete cleaned.settings

  cleaned.tokenColors = (cleaned.tokenColors || []).map((setting: any) => {
    return {
      scope: setting.scope,
      settings: setting.settings,
    }
  })

  return cleaned
}
