export type GrammarCategory = 'frontend' | 'backend' | 'common' | 'data' | 'other'

export interface GrammarSource {
  name: string
  displayName?: string
  category?: GrammarCategory
  source: string
  alias?: string[]
}

export interface GrammarInfo extends GrammarSource {
  licenseUrl?: string
  license?: string
  sha?: string
}
