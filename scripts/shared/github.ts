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

const _cacheGetLicenseUrl = new Map<string, ReturnType<typeof _getLicenseUrl>>()
const _cacheGetFundingInfo = new Map<string, ReturnType<typeof _getFundingInfo>>()
const _cacheGetCommit = new Map<string, Promise<CommitInfo>>()

function _getLicenseUrl(repo: string) {
  return octokit.request('GET /repos/{owner}/{repo}/license', { owner: repo.split('/')[0], repo: repo.split('/')[1] }).then((r: any) => {
    return r.data
  })
}

function _getFundingInfo(ownerAndRepo: string) {
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
  })
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
  if (!_cacheGetFundingInfo.has(repo))
    _cacheGetFundingInfo.set(repo, _getFundingInfo(repo))
  return _cacheGetFundingInfo.get(repo)!
}

function getCommit(repo: string, branch: string, path: string) {
  const key = `${repo}|${branch}|${path}`
  if (!_cacheGetCommit.has(key))
    _cacheGetCommit.set(key, _getCommit(repo, branch, path))
  return _cacheGetCommit.get(key)!
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

    const license = await getLicenseUrl(repo)
      .catch(() => undefined)

    info.funding = await getFundingInfo(repo)
      .catch(() => undefined)

    if (license) {
      info.licenseUrl = license.download_url!
      info.license = license.license!.spdx_id!
    }

    info.source = `https://github.com/${repo}/blob/${info.sha || branch}/${path}`

    return info
  }
  catch (e) {
    console.error(`Failed to resolve source for ${source.name} from ${source.source}`)
    throw e
  }
}

export function parseGitHubUrl(url: string): { repo: string, path: string, branch: string } {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)\/blob\/([^/]+)\/(.+)/)
  if (!m)
    throw new Error(`Invalid GitHub URL: ${url}`)
  return {
    repo: m[1],
    branch: m[2],
    path: m[3],
  }
}
