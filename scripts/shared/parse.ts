import type { ParseError } from 'jsonc-parser'
import CSON from 'cson'
import { parse as parsePlist } from 'fast-plist'
import YAML from 'js-yaml'
import { parse as jsoncParse } from 'jsonc-parser'

export function parseJsonc(jsonc: string) {
  const errors: ParseError[] = []
  const result = jsoncParse(jsonc, errors, { allowTrailingComma: true })
  if (errors.length)
    throw new Error(`Failed to parse JSONC:\n${jsonc.slice(0, 100)}\n${errors[0]}`)
  return result
}

export function parseCson(cson: string) {
  return CSON.parse(cson)
}

export function parseYaml(yaml: string) {
  return YAML.load(yaml)
}

export { parsePlist }

export function parseFile(url: string, raw: string) {
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
