export type GrammarCategory =
  | 'web'
  | 'markup'
  | 'general'
  | 'scripting'
  | 'data'
  | 'dsl'
  | 'utility'
  | 'config'
  | 'lisp'

/** https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository */
export interface FundingInfo {
  community_bridge?: string
  github?: string | string[]
  issuehunt?: string
  ko_fi?: string
  liberapay?: string
  open_collective?: string
  patreon?: string
  tidelift?: string
  polar?: string
  buy_me_a_coffee?: string
  thanks_dev?: string
  custom?: string | string[]
}

export interface GrammarInfo {
  name: string
  displayName: string
  categories?: GrammarCategory[]
  scopeName: string
  source: string
  aliases?: string[]
  licenseUrl?: string
  license?: string
  funding?: FundingInfo
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
