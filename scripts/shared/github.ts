import { octokit } from './octokit'
import type { GrammarInfo } from '../../packages/tm-grammars/index'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import type { GrammarSource } from '../grammars/types'
import type { ThemeSource } from '../themes/types'

interface CommitInfo {
  sha: string
  date: string
}

const _cacheGetLicenseUrl = new Map<string, ReturnType<typeof _getLicenseUrl>>()
const _cacheGetCommit = new Map<string, Promise<CommitInfo>>()

function _getLicenseUrl(repo: string) {
  return octokit.request('GET /repos/{owner}/{repo}/license', { owner: repo.split('/')[0], repo: repo.split('/')[1] }).then((r: any) => {
    return r.data
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

    if (old?.sha === commit.sha)
      return old

    info.sha = commit.sha
    info.lastUpdate = commit.date

    const license = await getLicenseUrl(repo)
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
