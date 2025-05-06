export interface FundingLink {
  name: string
  handle?: string
  url: string
}

export interface ThemeInfo {
  name: string
  type: 'dark' | 'light'
  displayName: string
  source: string
  sourceApi: string
  licenseUrl?: string
  license?: string
  funding?: FundingLink[]
  sha: string
  lastUpdate: string
  embedded?: string[]
  byteSize: number
  hash: string
}

const themes: ThemeInfo[]

export { themes }
