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

function _getSha(repo: string, branch = 'main') {
  return octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', { owner: repo.split('/')[0], repo: repo.split('/')[1], ref: branch })
    .then(r => r.data.sha)
}

function getLicenseUrl(repo: string) {
  if (!_cacheGetLicenseUrl.has(repo))
    _cacheGetLicenseUrl.set(repo, _getLicenseUrl(repo))
  return _cacheGetLicenseUrl.get(repo)!
}

function getSha(repo: string, branch = 'main') {
  const key = `${repo}#${branch}`
  if (!_cacheGetSha.has(key))
    _cacheGetSha.set(key, _getSha(repo, branch))
  return _cacheGetSha.get(key)!
}

export async function resolveSourceGitHub(source: GrammarSource): Promise<GrammarInfo>
export async function resolveSourceGitHub(source: ThemeSource): Promise<ThemeInfo>
export async function resolveSourceGitHub(source: GrammarSource | ThemeSource) {
  try {
    const {
      patch: _, // exclude keys
      marketplace: __,
      ...rest
    } = source
    const info = rest as any
    const { repo, branch, path } = parseGitHubUrl(source.source as string)!

    await Promise.all([
      getLicenseUrl(repo)
        .catch(() => undefined)
        .then((license) => {
          if (!license)
            return
          info.licenseUrl = license.download_url!
          info.license = license.license!.spdx_id!
        }),
      getSha(repo, branch)
        .then(sha => info.sha = sha),
    ])

    if (!info.sha)
      throw new Error(`Failed to resolve sha for ${source.name} from ${source.source}`)

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
