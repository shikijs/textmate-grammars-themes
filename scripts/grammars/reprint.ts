const posixTable = {
  alnum: '0-9A-Za-z',
  alpha: 'A-Za-z',
  ascii: '\x00-\x7F',
  blank: ' \\t',
  cntrl: '\x00-\x1F\x7F',
  digit: '0-9',
  graph: '!-~',
  lower: 'a-z',
  print: ' -~',
  punct: '!-/:-@[-`{-~',
  space: '\\s',
  upper: 'A-Z',
  xdigit: '0-9A-Fa-f',
  word: '\\w',
} as Record<string, string>

/**
 * Read the regex and reprint it in a more JavaScript-friendly format.
 */
export function regexpReprint(input: string) {
  let output = ''

  // Stack of open brackets
  const stack: string[] = []
  const wsEscapeLocal: number[] = []

  let wsEscapeGlobal = false

  let i = 0

  try {
    while (i < input.length) {
      const char = input[i]

      // Escape sequences
      if (char === '\\') {
        output += char + input[i + 1]
        i += 2
        continue
      }

      while (wsEscapeLocal.length && wsEscapeLocal[0] > stack.length) {
        wsEscapeLocal.shift()
      }

      const head = stack[0]
      const wsEscape = wsEscapeGlobal || wsEscapeLocal.length

      // Comments
      if (char === '#' && wsEscape && input[i - 1].match(/\s/) && head !== '[') {
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

          if (input[i + 2] === 'x') {
            if (input[i + 3] === ')') {
              i += 4
              wsEscapeGlobal = true
              continue
            }
            else if (input[i + 3] === ':') {
              i += 4
              stack.unshift(char)
              wsEscapeLocal.unshift(stack.length)
              output += '(?:'
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
        // Look for posix classes like [:alnum:]
        if (input[i + 1] === ':') {
          let name = ''
          let negated = false
          if (input[i + 2] === '^') {
            negated = true
            i += 1
          }
          for (let j = i + 2; j < input.length; j++) {
            if (input[j] === ':') {
              i = j + 2
              break
            }
            if (!input[j].match(/[a-z]/i)) {
              name = ''
              break
            }
            name += input[j]
          }
          if (name) {
            let resolved = posixTable[name]
            if (!resolved)
              throw new Error(`Unknown posix class "${name}"`)
            if (negated)
              resolved = `^${resolved}`
            if (head === '[')
              output += resolved
            else
              output += `[${resolved}]`
            continue
          }
        }

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
        if (head === '[')
          stack.shift()
        output += char
        i += 1
        continue
      }

      if (!(wsEscape && head !== '[' && char.match(/\s/))) {
        // Literals
        output += char
      }
      i += 1
    }
  }
  catch (e) {
    console.error('Error reprinting regexp:')
    console.error(input)
    console.error(`${' '.repeat(i)}^`)
    throw e
  }

  return output
}
