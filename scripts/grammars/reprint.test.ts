import { expect, it } from 'vitest'
import { regexpReprint } from './reprint'

const input = '((?<![_$[:alnum:])\\]]|\\+\\+|--|}|\\*\\/)|((?<=^return|[^\\._$[:alnum:]]return|^case|[^\\._$[:alnum:]]case))\\s*)\\/(?![\\/*])(?=(?:[^\\/\\\\\\[]|\\\\.|\\[([^\\]\\\\]|\\\\.)*\\])+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))'

it('reprint', () => {
  expect(regexpReprint('[:alnum:]'))
    .toMatchInlineSnapshot(`"[0-9A-Za-z]"`)

  expect(regexpReprint('[:^alnum:]'))
    .toMatchInlineSnapshot(`"[^0-9A-Za-z]"`)

  expect(regexpReprint(input))
    .toMatchInlineSnapshot(`"((?<![_$0-9A-Za-z)\\]]|\\+\\+|--|}|\\*\\/)|((?<=^return|[^\\._$0-9A-Za-z]return|^case|[^\\._$0-9A-Za-z]case))\\s*)\\/(?![\\/*])(?=(?:[^\\/\\\\\\[]|\\\\.|\\[([^\\]\\\\]|\\\\.)*\\])+\\/([dgimsuy]+|(?![\\/\\*])|(?=\\/\\*))(?!\\s*[a-zA-Z0-9_$]))"`)
})
