export type GrammarCategory
  = | 'web'
    | 'markup'
    | 'general'
    | 'scripting'
    | 'data'
    | 'dsl'
    | 'utility'
    | 'config'
    | 'lisp'

export interface FundingLink {
  name: string
  handle?: string
  url: string
}

export interface GrammarInfo {
  name: string
  displayName: string
  categories?: GrammarCategory[]
  scopeName: string
  source: string
  sourceApi: string
  aliases?: string[]
  licenseUrl?: string
  license?: string
  funding?: FundingLink[]
  sha: string
  lastUpdate: string
  embedded?: string[]
  embeddedIn?: string[]
  byteSize: number
  hash: string
}

const grammars: GrammarInfo[]
const injections: GrammarInfo[]

export {
  grammars,
  injections,
}
