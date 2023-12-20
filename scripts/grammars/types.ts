export type GrammarCategory = 'frontend' | 'backend' | 'common' | 'data' | 'other'

export interface GrammarSource {
  name: string
  displayName?: string
  category?: GrammarCategory
  source: string
  alias?: string[]
  /**
   * Download from marketplace.
   */
  marketplace?: {
    name: string
    grammar: string
  }
  /**
   * Custom patching function for the grammar.
   */
  patch?: (grammar: any) => any | void
}
