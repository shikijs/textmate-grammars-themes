import { basename } from 'node:path'
import fg from 'fast-glob'

export async function checkSamples() {
  const samples = await fg('samples/*.sample', {
    onlyFiles: true,
  }).then(r => r.map(f => basename(f).replace(/\.sample$/, '')))

  const grammars = await import('../packages/tm-grammars/index.js')
    .then(m => m.grammars.map(i => i.name))

  const allGrammars = await import('../packages/tm-grammars/index.js')
    .then(m => m.grammars.flatMap(i => [i.name, ...i.aliases || []]))

  const missingSamples = grammars.filter(g => !samples.includes(g))
  const extraSamples = samples.filter(s => !allGrammars.includes(s))

  console.log({
    missingSamples,
    extraSamples,
  })
}

await checkSamples()
