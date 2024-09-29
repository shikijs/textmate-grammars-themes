export interface ThemeInfo {
  name: string
  type: 'dark' | 'light'
  displayName: string
  source: string
  licenseUrl?: string
  license?: string
  sha: string
  lastUpdate: string
  embedded?: string[]
  byteSize: number
  hash: string
}

const themes: ThemeInfo[]

export { themes }
