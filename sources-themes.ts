import type { ThemeSource } from './scripts/themes/types'

// @keep-sorted { "keys": ["name"] }
export const sourcesVSCode: ThemeSource[] = [
  {
    name: 'andromeeda',
    displayName: 'Andromeeda',
    source: 'https://github.com/EliverLara/Andromeda/blob/master/themes/Andromeda-color-theme.json',
  },
  {
    name: 'aurora-x',
    displayName: 'Aurora X',
    source: 'https://github.com/marqu3ss/Aurora-X/blob/master/themes/Aurora%20X-color-theme.json',
  },
  {
    name: 'ayu-dark',
    displayName: 'Ayu Dark',
    source: 'https://github.com/ayu-theme/vscode-ayu/blob/master/ayu-dark.json',
  },
  {
    name: 'dark-plus',
    displayName: 'Dark Plus',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/dark_plus.json',
  },
  {
    name: 'light-plus',
    displayName: 'Light Plus',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-defaults/themes/light_plus.json',
  },
  {
    name: 'monokai',
    displayName: 'Monokai',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-monokai/themes/monokai-color-theme.json',
  },
  {
    name: 'night-owl',
    displayName: 'Night Owl',
    source: 'https://github.com/sdras/night-owl-vscode-theme/blob/main/themes/Night%20Owl-color-theme.json',
  },
  {
    name: 'red',
    displayName: 'Red',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-red/themes/Red-color-theme.json',
  },
  {
    name: 'solarized-dark',
    displayName: 'Solarized Dark',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-solarized-dark/themes/solarized-dark-color-theme.json',
  },
  {
    name: 'solarized-light',
    displayName: 'Solarized Light',
    source: 'https://github.com/microsoft/vscode/blob/main/extensions/theme-solarized-light/themes/solarized-light-color-theme.json',
  },
  {
    name: 'synthwave-84',
    displayName: 'Synthwave \'84',
    source: 'https://github.com/robb0wen/synthwave-vscode/blob/master/themes/synthwave-color-theme.json',
  },
  {
    name: 'tokyo-night',
    displayName: 'Tokyo Night',
    source: 'https://github.com/enkia/tokyo-night-vscode-theme/blob/master/themes/tokyo-night-color-theme.json',
  },
]

// @keep-sorted { "keys": ["name"] }
export const sourcesCommunity: ThemeSource[] = [
  {
    name: 'houston',
    displayName: 'Houston',
    source: 'https://github.com/withastro/houston-vscode/blob/main/themes/houston.json',
    type: 'dark',
  },
  {
    name: 'min-dark',
    source: 'https://github.com/misolori/min-theme/blob/master/themes/min-dark.json',
  },
  {
    name: 'min-light',
    source: 'https://github.com/misolori/min-theme/blob/master/themes/min-light.json',
  },
  {
    name: 'nord',
    source: 'https://github.com/arcticicestudio/nord-visual-studio-code/blob/develop/themes/nord-color-theme.json',
  },
  {
    name: 'one-dark-pro',
    source: 'https://github.com/Binaryify/OneDark-Pro/blob/master/themes/OneDark-Pro.json',
  },
  {
    name: 'one-light',
    displayName: 'One Light',
    source: 'https://github.com/akamud/vscode-theme-onelight/blob/master/themes/OneLight.json',
    type: 'light',
  },
  {
    name: 'poimandres',
    displayName: 'Poimandres',
    source: 'https://github.com/drcmda/poimandres-theme/blob/main/themes/poimandres-color-theme.json',
  },
  {
    name: 'rose-pine-dawn',
    source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-dawn-color-theme.json',
    type: 'light',
  },
  {
    name: 'rose-pine-moon',
    source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-moon-color-theme.json',
  },
  {
    name: 'rose-pine',
    source: 'https://github.com/rose-pine/vscode/blob/main/themes/rose-pine-color-theme.json',
  },
  {
    name: 'slack-dark',
    displayName: 'Slack Dark',
    source: 'https://github.com/slack-theme/visual-studio-code/blob/master/themes/dark-mode.json',
  },
  {
    name: 'slack-ochin',
    displayName: 'Slack Ochin',
    source: 'https://github.com/slack-theme/visual-studio-code/blob/master/themes/ochin.json',
    type: 'light',
  },
  {
    name: 'snazzy-light',
    displayName: 'Snazzy Light',
    source: 'https://github.com/loilo/vscode-snazzy-light/blob/master/themes/Snazzy-Light-color-theme.json',
    type: 'light',
  },
  {
    name: 'vesper',
    displayName: 'Vesper',
    source: 'https://github.com/raunofreiberg/vesper/blob/main/themes/Vesper-dark-color-theme.json',
    type: 'dark',
  },
  {
    name: 'vitesse-black',
    source: 'https://github.com/antfu/vscode-theme-vitesse/blob/main/themes/vitesse-black.json',
  },
  {
    name: 'vitesse-dark',
    source: 'https://github.com/antfu/vscode-theme-vitesse/blob/main/themes/vitesse-dark.json',
  },
  {
    name: 'vitesse-light',
    source: 'https://github.com/antfu/vscode-theme-vitesse/blob/main/themes/vitesse-light.json',
  },
]

export const sourcesMarketplace: ThemeSource[] = [
  ...generateMarketplaceSource(
    'equinusocio.vsc-material-theme',
    'https://github.com/material-theme/vsc-material-theme/blob/main/src/material.theme.config.ts',
    [
      'Material Theme',
      'Material Theme Darker',
      'Material Theme Lighter',
      'Material Theme Ocean',
      'Material Theme Palenight',
    ],
  ),
  ...generateMarketplaceSource(
    'dracula-theme.theme-dracula',
    'https://github.com/dracula/visual-studio-code/blob/master/src/dracula.yml',
    [
      'Dracula',
      'Dracula Soft',
    ],
  ),
  ...generateMarketplaceSource(
    'GitHub.github-vscode-theme',
    'https://github.com/primer/github-vscode-theme/blob/main/src/theme.js',
    [
      'GitHub Dark',
      'GitHub Dark Default',
      'GitHub Light',
      'GitHub Light Default',
      'GitHub Dark Dimmed',
    ],
  ),
  ...generateMarketplaceSource(
    'Catppuccin.catppuccin-vsc',
    'https://github.com/catppuccin/vscode/blob/main/packages/catppuccin-vsc/package.json',
    [
      'Catppuccin Mocha',
      'Catppuccin Macchiato',
      'Catppuccin Latte',
      'Catppuccin Frappé',
    ],
  ),
]

export const sources = [
  ...sourcesVSCode,
  ...sourcesCommunity,
  ...sourcesMarketplace,
]

function generateMarketplaceSource(name: string, source: string, themes: string[]): ThemeSource[] {
  return themes.map(theme => ({
    name: theme.toLowerCase().normalize('NFD').replace(/[\u0300-\u036F]/g, '').trim().replace(/\s+/g, '-'),
    displayName: theme,
    source,
    marketplace: {
      name,
      theme,
    },
  }))
}
