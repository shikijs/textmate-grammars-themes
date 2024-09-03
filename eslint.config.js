// @ts-check
import antfu from '@antfu/eslint-config'

const keysOrders = [
  'name',
  'displayName',
  'aliases',
  'source',
  'marketplace',
  'embeddedIn',
  'injectTo',
]

export default antfu(
  {
    ignores: [
      'packages/tm-grammars/grammars/**',
      'packages/tm-grammars/raw/**',
      'packages/tm-themes/themes/**',
    ],
    vue: true,
  },
  {
    files: ['sources-grammars.ts', 'sources-themes.ts'],
    rules: {
      'perfectionist/sort-objects': ['error', {
        groups: keysOrders,
        customGroups: Object.fromEntries(keysOrders.map(key => [key, [key]])),
      }],
    },
  },
)
