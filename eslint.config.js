// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'packages/tm-grammars/grammars/**',
    ],
  },
  {
    rules: {
      // overrides
    },
  },
)
