import { Buffer } from 'node:buffer'
import { $fetch } from 'ofetch'
import AdmZip from 'adm-zip'

export async function downloadFromMarketplace(name: string) {
  const url = getMarketplaceLink(name)
  const binary = await $fetch(url, { responseType: 'arrayBuffer' })
  const zip = new AdmZip(Buffer.from(binary))
  const json = JSON.parse(String(zip.getEntry('extension/package.json')?.getData()))
  return {
    json,
    zip,
  }
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
