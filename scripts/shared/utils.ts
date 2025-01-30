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

interface FundingLink {
  name: string
  handle?: string
  url: string
}

export function getFundingLinks(funding: FundingInfo | undefined): FundingLink[] {
  if (!funding)
    return []

  const entries: FundingLink[] = []
  for (const untypedKey of Object.keys(funding)) {
    // Some TS hackery to improve refinement on `value`
    type ExtractFundingEntry<K> = K extends keyof FundingInfo ? [K, FundingInfo[K]] : never
    const [key, value] = [untypedKey, funding[untypedKey as keyof FundingInfo]] as ExtractFundingEntry<keyof FundingInfo>
    if (!value)
      continue

    switch (key) {
      case 'community_bridge':
        entries.push({ name: 'LFX', handle: value, url: `https://crowdfunding.lfx.linuxfoundation.org/projects/${value}` })
        break
      case 'github':
        entries.push(...(Array.isArray(value) ? value : [value]).map(v => ({
          name: 'GitHub Sponsors',
          handle: `@${v}`,
          url: `https://github.com/sponsors/${v}`,
        })))
        break
      case 'issuehunt':
        entries.push({ name: 'IssueHunt', handle: value, url: `https://issuehunt.io/r/${value}` })
        break
      case 'ko_fi':
        entries.push({ name: 'Ko-fi', handle: value, url: `https://ko-fi.com/${value}` })
        break
      case 'liberapay':
        entries.push({ name: 'Liberapay', handle: `@${value}`, url: `https://liberapay.com/${value}` })
        break
      case 'open_collective':
        entries.push({ name: 'Open Collective', handle: value, url: `https://opencollective.com/${value}` })
        break
      case 'patreon':
        entries.push({ name: 'Patreon', handle: value, url: `https://patreon.com/${value}` })
        break
      case 'tidelift':
        entries.push({ name: 'Tidelift', handle: value, url: `https://tidelift.com/funding/github/${value}` })
        break
      case 'polar':
        entries.push({ name: 'Polar', handle: `@${value}`, url: `https://polar.sh/${value}` })
        break
      case 'buy_me_a_coffee':
        entries.push({ name: 'Buy Me A Coffee', handle: value, url: `https://www.buymeacoffee.com/${value}` })
        break
      case 'thanks_dev':
        entries.push({ name: 'thanks.dev', handle: value, url: `https://thanks.dev/d/${value}` })
        break
      case 'custom':
        entries.push(...(Array.isArray(value) ? value : [value]).map((v) => {
          const url = v.includes('://') ? v : `https://${v}`
          return { name: new URL(url).hostname.replace(/^www\./, ''), url }
        }))
        break
      default:
        throw new Error(`Unhandled FUNDING.yml key: ${untypedKey}`)
    }
  }
  return entries
}

export function formatFunding(funding: FundingInfo | undefined): string {
  const entries = getFundingLinks(funding)
  return entries
    .map(entry => `[${entry.name}${entry.handle ? `: **${entry.handle}**` : ''}](${entry.url})`)
    .join(' ')
}
