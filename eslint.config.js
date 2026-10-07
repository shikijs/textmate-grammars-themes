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
    pnpm: true,
    vue: true,
  },
  {
    files: ['sources-grammars.ts', 'sources-themes.ts'],
    rules: {
      'perfectionist/sort-objects': ['error', {
        groups: keysOrders,
        customGroups: keysOrders.map(key => ({
          groupName: key,
          elementNamePattern: `^${key}$`,
        })),
      }],
    },
  },
)
