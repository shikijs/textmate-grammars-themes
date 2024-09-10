import { Buffer } from 'node:buffer'
import AdmZip from 'adm-zip'
import { $fetch } from 'ofetch'

const cache = new Map<string, ReturnType<typeof _downloadFromMarketplace>>()

async function _downloadFromMarketplace(name: string) {
  const url = getMarketplaceLink(name)
  const binary = await $fetch(url, { responseType: 'arrayBuffer' })
  const zip = new AdmZip(Buffer.from(binary))
  const json = JSON.parse(String(zip.getEntry('extension/package.json')?.getData()))
  return {
    json,
    zip,
  }
}

export function downloadFromMarketplace(name: string) {
  if (cache.has(name))
    return cache.get(name)!
  const promise = _downloadFromMarketplace(name)
  cache.set(name, promise)
  return promise
}

function getMarketplaceLink(publisherDotExtId: string) {
  const [publisher, extId] = publisherDotExtId.split('.')

  return (
    `https://${publisher}.gallery.vsassets.io`
    + `/_apis/public/gallery/publisher/${publisher}`
    + `/extension/${extId}/latest`
    + `/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`
  )
}
