export interface ThemeInfo {
  name: string
  type: 'dark' | 'light'
  displayName?: string
  source: string
  licenseUrl?: string
  license?: string
  sha?: string
  embedded?: string[]
}

const themes: ThemeInfo[]

export { themes }
