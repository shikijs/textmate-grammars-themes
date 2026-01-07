import type { GrammarInfo } from '../../packages/tm-grammars/index'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import type { GrammarSource } from '../grammars/types'
import type { ThemeSource } from '../themes/types'
import YAML from 'js-yaml'
import { hash as getHash } from 'ohash'
import { octokit } from './octokit'

interface CommitInfo {
  sha: string
  date: string
}

/** https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository */
interface FundingInfo {
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

interface FundingLink {
  name: string
  handle?: string
  url: string
}

const _cacheGetLicenseUrl = new Map<string, ReturnType<typeof _getLicenseUrl>>()
const _cacheGetFundingLinks = new Map<string, ReturnType<typeof _getFundingLinks>>()
const _cacheGetCommit = new Map<string, Promise<CommitInfo>>()

function _getLicenseUrl(repo: string) {
  return octokit.request('GET /repos/{owner}/{repo}/license', { owner: repo.split('/')[0], repo: repo.split('/')[1] }).then((r: any) => {
    return r.data
  })
}

function _getFundingLinks(ownerAndRepo: string): Promise<FundingLink[]> {
  const [owner, repo] = ownerAndRepo.split('/')
  // Set Accept to receive raw file contents
  const headers = { Accept: 'application/vnd.github.raw+json' }

  return octokit.request('GET /repos/{owner}/{repo}/contents/.github/FUNDING.yml', { owner, repo, headers }).catch((err: any) => {
    // If there is no repo-specific .github folder, there may be an owner-level one that is used as a fallback
    if (err.status === 404) {
      return octokit.request('GET /repos/{owner}/.github/contents/FUNDING.yml', { owner, headers })
    }
    else {
      throw err
    }
  }).then((r: any) => {
    const funding = YAML.load(r.data) as Record<string, unknown>
    const nonnullEntries = Object.entries(funding).filter(([, value]) => value != null)
    return nonnullEntries.length > 0 ? Object.fromEntries(nonnullEntries) : undefined
  }, (r: any) => {
    if (r.status === 404) {
      return undefined
    }
    else {
      throw r
    }
  }).then(fundingInfoToLinks)
}

function _getCommit(repo: string, branch: string, path: string): Promise<CommitInfo> {
  return octokit.request(`GET /repos/{owner}/{repo}/commits?path=${encodeURIComponent(decodeURI(path))}&per_page=1&sha=${branch}`, {
    owner: repo.split('/')[0],
    repo: repo.split('/')[1],
  }).then((r: any) => {
    if (!r.data.length) {
      console.error(r, path)
      throw new Error(`Failed to resolve sha for ${JSON.stringify({ repo, branch, path })}}`)
    }
    return {
      sha: r.data[0].sha,
      date: r.data[0].commit.author.date,
    }
  })
}

function getLicenseUrl(repo: string) {
  if (!_cacheGetLicenseUrl.has(repo))
    _cacheGetLicenseUrl.set(repo, _getLicenseUrl(repo))
  return _cacheGetLicenseUrl.get(repo)!
}

function getFundingInfo(repo: string) {
  if (!_cacheGetFundingLinks.has(repo))
    _cacheGetFundingLinks.set(repo, _getFundingLinks(repo))
  return _cacheGetFundingLinks.get(repo)!
}

function getCommit(repo: string, branch: string, path: string) {
  const key = `${repo}|${branch}|${path}`
  if (!_cacheGetCommit.has(key))
    _cacheGetCommit.set(key, _getCommit(repo, branch, path))
  return _cacheGetCommit.get(key)!
}

function fundingInfoToLinks(funding: FundingInfo | undefined): FundingLink[] {
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

export async function resolveSourceGitHub(source: GrammarSource, old?: GrammarInfo): Promise<GrammarInfo>
export async function resolveSourceGitHub(source: ThemeSource, old?: ThemeInfo): Promise<ThemeInfo>
export async function resolveSourceGitHub(source: GrammarSource | ThemeSource, old?: GrammarInfo | ThemeInfo) {
  try {
    const {
      patch: _, // exclude keys
      marketplace: __,
      ...rest
    } = source
    const info = rest as any
    const { repo, branch, path } = parseGitHubUrl(source.source as string)!

    const commit = await getCommit(repo, branch, path)
    if (!commit)
      throw new Error(`Failed to resolve commit for ${source.name} from ${source.source}`)

    const hash = getHash({
      source,
      sha: commit.sha,
    })
    if (old?.sha === commit.sha && old?.hash === hash)
      return old

    info.sha = commit.sha
    info.hash = hash
    info.lastUpdate = commit.date

    info.funding = await getFundingInfo(repo)
      .catch(() => [])

    if (!info.licenseUrl) {
      const license = await getLicenseUrl(repo)
        .catch(() => undefined)
      if (license) {
        info.licenseUrl = license.download_url!
        info.license = license.license!.spdx_id!
      }
    }

    info.source = `https://github.com/${repo}/blob/${info.sha || branch}/${path}`
    info.sourceApi = `https://api.github.com/repos/${repo}/contents/${path}?ref=${encodeURIComponent(info.sha || branch)}`

    return info
  }
  catch (e) {
    console.error(`Failed to resolve source for ${source.name} from ${source.source}`)
    throw e
  }
}

export function parseGitHubUrl(url: string): { repo: string, path: string, branch: string } {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.+)/)
    || url.match(/api\.github\.com\/repos\/([^/]+\/[^/]+)\/contents\/(.+)/)
  if (!m)
    throw new Error(`Invalid GitHub URL: ${url}`)
  return {
    repo: m[1],
    branch: m[2],
    path: m[3],
  }
}
