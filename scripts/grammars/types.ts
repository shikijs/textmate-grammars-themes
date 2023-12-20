export type GrammarCategory = 'frontend' | 'backend' | 'common' | 'data' | 'other'

export interface GrammarSource {
  name: string
  displayName?: string
  category?: GrammarCategory
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
   * Custom patching function for the grammar.
   */
  patch?: (grammar: any) => any | void
}
