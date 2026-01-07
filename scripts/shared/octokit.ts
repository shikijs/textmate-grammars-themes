import process from 'node:process'
import { Octokit } from 'octokit'
import 'dotenv/config'

if (!process.env.GITHUB_TOKEN)
  throw new Error('GITHUB_TOKEN is required. Get one from https://github.com/settings/tokens, with Fine-grained PAT, the default public repo permissions are enough, also note that the expiration date should not be longer than 1 year.')

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})
