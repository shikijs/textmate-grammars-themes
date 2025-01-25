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

export interface ThemeInfo {
  name: string
  type: 'dark' | 'light'
  displayName: string
  source: string
  licenseUrl?: string
  license?: string
  funding?: FundingInfo
  sha: string
  lastUpdate: string
  embedded?: string[]
  byteSize: number
  hash: string
}

const themes: ThemeInfo[]

export { themes }
