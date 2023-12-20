import 'dotenv/config'
import process from 'node:process'
import { Octokit } from 'octokit'

if (!process.env.GITHUB_TOKEN)
  throw new Error('GITHUB_TOKEN is required. Get one from https://github.com/settings/tokens, with Fine-grained personal access tokens, the default public repo permissions are enough.')

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})
