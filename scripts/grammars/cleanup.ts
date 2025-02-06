import { objectPick } from '../shared/utils'
import { highlight } from './highlight'

export interface SyntaxLoweringResult {
  pattern: string
  flags: string
}

export function compressRegExp(
  input: string,
): string {
  let output = ''

  const stack: string[] = []
  const freeSpacingLocal: number[] = []
  let freeSpacingGlobal = false
  let isInNestedCharClass = false

  let i = 0
  while (i < input.length) {
    const char = input[i]

    while (freeSpacingLocal.length && freeSpacingLocal[0] > stack.length) {
      freeSpacingLocal.shift()
    }

    const head = stack[0]
    const freeSpacing = freeSpacingGlobal || freeSpacingLocal.length

    // Escape sequences
    if (char === '\\') {
      output += char + input[i + 1]
      i += 2
      continue
    }

    // Comments
    if (char === '#' && freeSpacing && input[i - 1].match(/\s/) && head !== '[') {
      for (let j = i + 1; j <= input.length; j++) {
        if (input[j] === '\n' || j === input.length) {
          i = j
          break
        }
      }
      continue
    }

    // Open bracket
    if (char === '(' && head !== '[') {
      // Group modifiers
      if (input[i + 1] === '?') {
        // (?#...) comment
        if (input[i + 2] === '#') {
          for (let j = i + 3; j < input.length; j++) {
            if (input[j] === ')' && input[j - 1] !== '\\') {
              i = j + 1
              break
            }
          }
          continue
        }

        // Extract flags
        if (['x'].includes(input[i + 2])) {
          let end = i + 3
          for (; end < input.length; end++) {
            if (!['x'].includes(input[end]))
              break
          }
          const flagStr = input.slice(i + 2, end)
          const hasX = flagStr.includes('x') && flagStr[0] !== '-'
          const remainFlags = [...flagStr].filter(x => x !== 'x').join('')

          if (input[end] === ')') {
            i = end + 1
            if (hasX) {
              freeSpacingGlobal = true
            }
            if (remainFlags.length) {
              output += `(?${remainFlags})`
            }
            continue
          }
          else if (input[end] === ':') {
            i = end + 1
            stack.unshift(char)
            if (hasX) {
              freeSpacingLocal.unshift(stack.length)
            }
            output += `(?${remainFlags}:`
            continue
          }
        }

        stack.unshift(char)
        output += char + input[i + 1] + input[i + 2]
        i += 3
      }
      else {
        stack.unshift(char)
        output += char
        i += 1
      }
      continue
    }

    // Close bracket
    if (char === ')' && head !== '[') {
      if (head === '(')
        stack.shift()
      output += char
      i += 1
      continue
    }

    // Alternation open bracket
    if (char === '[') {
      // Prepend to the stack when not in a character class
      if (head !== '[') {
        stack.unshift(char)
      }

      output += char
      i += 1
      continue
    }

    // Alternation close bracket
    if (char === ']') {
      if (isInNestedCharClass) {
        isInNestedCharClass = false
        i += 1
        continue
      }
      if (head === '[')
        stack.shift()
      output += char
      i += 1
      continue
    }

    // Ignore whitespace if Free-spacing mode is enabled
    if (!(freeSpacing && head !== '[' && char.match(/\s/))) {
      // Literals
      output += char
    }
    i += 1
  }

  return output
}

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
      // Rewrite Oniguruma patterns to more JS-friendly syntax
      // Also it would "compress" the regex to save some bytes
      const result = compressRegExp(pattern)
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
