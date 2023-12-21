import type { GrammarInfo } from '../../packages/tm-grammars/index'
import type { ThemeInfo } from '../../packages/tm-themes/index'
import type { GrammarSource } from '../grammars/types'
import type { ThemeSource } from '../themes/types'
import { octokit } from './octokit'

const _cacheGetLicenseUrl = new Map<string, ReturnType<typeof _getLicenseUrl>>()
const _cacheGetSha = new Map<string, ReturnType<typeof _getSha>>()

function _getLicenseUrl(repo: string) {
  return octokit.request('GET /repos/{owner}/{repo}/license', { owner: repo.split('/')[0], repo: repo.split('/')[1] })
    .then((r) => {
      return r.data
    })
}

function _getSha(repo: string, branch: string, path: string) {
  return octokit.request(`GET /repos/{owner}/{repo}/commits?path=${encodeURIComponent(decodeURI(path))}&per_page=1&sha=${branch}`, {
    owner: repo.split('/')[0],
    repo: repo.split('/')[1],
  })
    .then((r) => {
      if (!r.data.length) {
        console.error(r, path)
        throw new Error(`Failed to resolve sha for ${JSON.stringify({ repo, branch, path })}}`)
      }
      return r.data[0].sha
    })
}

function getLicenseUrl(repo: string) {
  if (!_cacheGetLicenseUrl.has(repo))
    _cacheGetLicenseUrl.set(repo, _getLicenseUrl(repo))
  return _cacheGetLicenseUrl.get(repo)!
}

function getSha(repo: string, branch: string, path: string) {
  const key = `${repo}|${branch}|${path}`
  if (!_cacheGetSha.has(key))
    _cacheGetSha.set(key, _getSha(repo, branch, path))
  return _cacheGetSha.get(key)!
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

    const sha = await getSha(repo, branch, path)
    if (!sha)
      throw new Error(`Failed to resolve sha for ${source.name} from ${source.source}`)

    if (old?.sha === sha)
      return old

    info.sha = sha

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
