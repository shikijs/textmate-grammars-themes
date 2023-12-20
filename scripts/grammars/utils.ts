import type { ParseError } from 'jsonc-parser'
import { parse as jsoncParse } from 'jsonc-parser'
import { parse as parsePlist } from 'fast-plist'
import CSON from 'cson'
import YAML from 'js-yaml'

export function parseJsonc(jsonc: string) {
  const errors: ParseError[] = []
  const result = jsoncParse(jsonc, errors, { allowTrailingComma: true })
  if (errors.length)
    throw errors[0]
  return result
}

export function parseCson(cson: string) {
  return CSON.parse(cson)
}

export function parseYaml(yaml: string) {
  return YAML.load(yaml)
}

export { parsePlist }

export function parseGrammar(url: string, raw: string) {
  if (url.endsWith('.cson')) {
    return parseCson(raw)
  }
  else if (url.endsWith('.json')) {
    return parseJsonc(raw)
  }
  else if (url.endsWith('.plist')) {
    return parsePlist(raw)
  }
  else if (url.endsWith('.yml') || url.endsWith('.yaml')) {
    return parseYaml(raw)
  }
  else {
    if (raw[0] === '{')
      return parseJsonc(raw)
    else if (raw[0] === '<')
      return parsePlist(raw)
    else
      return parseYaml(raw)
  }
}

export function objectPick<T extends Record<any, any>>(
  obj: T,
  keys: (keyof T)[],
  onRemoval?: (obj: T, key: string, value: any) => void,
): T {
  return Object.fromEntries(
    Array.from(
      Object.entries(obj)
        .filter((i) => {
          if (keys.includes(i[0]))
            return true
          onRemoval?.(obj, ...i)
          return false
        }),
    ),
  ) as T
}

export function cleanupLanguageReg(lang: any) {
  return objectPick(
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
}

export function parseGitHubUrl(url: string): { repo: string, path: string, branch: string } {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.+)/)
  if (!m)
    throw new Error(`Invalid GitHub URL: ${url}`)
  return {
    repo: m[1],
    branch: m[2],
    path: m[3],
  }
}
