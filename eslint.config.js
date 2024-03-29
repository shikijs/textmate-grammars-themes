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
    ],
    vue: true,
  },
  {
    files: ['sources-grammars.ts', 'sources-themes.ts'],
    rules: {
      'perfectionist/sort-objects': ['error', {
        'groups': keysOrders,
        'custom-groups': Object.fromEntries(keysOrders.map(key => [key, [key]])),
      }],
    },
  },
)
