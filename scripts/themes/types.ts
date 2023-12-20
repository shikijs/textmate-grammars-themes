export interface ThemeSource {
  name: string
  displayName?: string
  source: string
  type?: 'dark' | 'light'
  /**
   * Download from marketplace.
   */
  marketplace?: {
    name: string
    theme: string
  }
  /**
   * Custom patching function for the theme.
   */
  patch?: (theme: any) => any | void
}
