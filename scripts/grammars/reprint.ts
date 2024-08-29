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

      // Open bracket
      if (char === '(' && stack[0] !== '[') {
        stack.unshift(char)
        output += char
        // Group modifiers
        if (input[i + 1] === '?') {
          output += input[i + 1] + input[i + 2]
          i += 3
        }
        else {
          i += 1
        }
        continue
      }

      // Close bracket
      if (char === ')' && stack[0] !== '[') {
        const end = stack[0]
        if (end === '(')
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
            if (stack[0] === '[')
              output += resolved
            else
              output += `[${resolved}]`
            continue
          }
        }

        // Prepend to the stack when not in a character class
        if (stack[0] !== '[') {
          stack.unshift(char)
        }

        output += char
        i += 1
        continue
      }

      // Alternation close bracket
      if (char === ']') {
        const end = stack[0]
        if (end === '[')
          stack.shift()
        output += char
        i += 1
        continue
      }

      // Literals
      output += char
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
