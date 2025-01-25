import type { FundingInfo } from '../../packages/tm-grammars'

export function objectPick<T extends Record<any, any>>(
  obj: T,
  keys: (keyof T)[],
  onRemoval?: (obj: T, key: string, value: any) => void,
): T {
  return Object.fromEntries(
    Array.from(
      Object.entries(obj)
        .filter((i) => {
          if (keys.includes(i[0]))
            return true
          onRemoval?.(obj, ...i)
          return false
        }),
    ),
  ) as T
}

export function fileSizeToHuman(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return `${(size / 1024 ** i).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`
}

export function formatTableRow(columns: string[]) {
  return `| ${columns.join(' | ')} |`
}

export function formatFunding(funding: FundingInfo | undefined): string {
  if (!funding)
    return ''
  const entries: string[] = []
  for (const key of Object.keys(funding)) {
    const value = funding[key as keyof FundingInfo]
    if (!value)
      continue

    switch (key as keyof FundingInfo) {
      case 'community_bridge':
        entries.push(`[❤️ LFX: **${value}**](https://crowdfunding.lfx.linuxfoundation.org/projects/${value})`)
        break
      case 'github':
        entries.push(...(Array.isArray(value) ? value : [value]).map(v => `[❤️ GitHub Sponsors: **@${v}**](https://github.com/sponsors/${v})`))
        break
      case 'issuehunt':
        entries.push(`[❤️ IssueHunt: **${value}**](https://issuehunt.io/r/${value})`)
        break
      case 'ko_fi':
        entries.push(`[❤️ Ko-fi: **${value}**](https://ko-fi.com/${value})`)
        break
      case 'liberapay':
        entries.push(`[❤️ Liberapay: **@${value}**](https://liberapay.com/${value})`)
        break
      case 'open_collective':
        entries.push(`[❤️ Open Collective: **${value}**](https://opencollective.com/${value})`)
        break
      case 'patreon':
        entries.push(`[❤️ Patreon: **${value}**](https://patreon.com/${value})`)
        break
      case 'tidelift':
        entries.push(`[❤️ Tidelift: **${value}**](https://tidelift.com/funding/github/${value})`)
        break
      case 'polar':
        entries.push(`[❤️ Polar: **@${value}**](https://polar.sh/${value})`)
        break
      case 'buy_me_a_coffee':
        entries.push(`[❤️ Buy Me A Coffee: **${value}**](https://www.buymeacoffee.com/${value})`)
        break
      case 'thanks_dev':
        entries.push(`[❤️ thanks.dev: **${value}**](https://thanks.dev/d/${value})`)
        break
      case 'custom':
        entries.push(...(Array.isArray(value) ? value : [value]).map((v) => {
          const url = value.includes('://') ? v : `https://${v}`
          return `[❤️ ${new URL(url).hostname.replace(/^www\./, '')}](${url})`
        }))
        break
      default:
        throw new Error(`Unhandled FUNDING.yml key: ${key}`)
    }
  }
  // Use <br> instead of \n since this is placed into the middle of a table row
  return entries.map(entry => `<br><sub>${entry}</sub>`).join('')
}
