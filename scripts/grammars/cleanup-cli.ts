import { promises as fs } from 'node:fs'
import { basename, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import stringify from 'json-stable-stringify'
import { cleanupGrammar } from './cleanup'

const files = fg.sync('*.json', {
  cwd: fileURLToPath(new URL('../../packages/tm-grammars/raw', import.meta.url)),
  absolute: true,
})

const errors: [string, unknown][] = []
for (const file of files) {
  const name = basename(file, '.json')
  try {
    console.log('Processing', name)
    const data = JSON.parse(await fs.readFile(file, 'utf-8'))
    const result = await cleanupGrammar(data)
    console.log('Writing', name)
    await fs.writeFile(resolve(file, '../../grammars', basename(file)), `${stringify(result, { space: 2 })}\n`, 'utf-8')
  }
  catch (e) {
    errors.push([name, e])
  }
}

if (errors.length) {
  console.error(`${errors.length} Errors: ${errors.map(([name]) => name).join(', ')}`)
  for (const e of errors) {
    console.error(e[1])
  }
  process.exit(1)
}
