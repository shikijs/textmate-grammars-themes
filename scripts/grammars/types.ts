import type { GrammarCategory } from '../../packages/tm-grammars'

export interface GrammarSource {
  name: string
  displayName?: string
  categories?: GrammarCategory[]
  source: string
  aliases?: string[]

  /**
   * Download from marketplace.
   */
  marketplace?: {
    name: string
    grammar: string
  }

  /**
   * The grammar is embedded in another grammar but not listed directly in the themes.
   */
  embeddedIn?: string[]

  /**
   * @see https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#injection-grammars
   */
  injectTo?: string[]

  /**
   * Custom patching function for the grammar.
   */
  patch?: (grammar: any) => any | void
}
