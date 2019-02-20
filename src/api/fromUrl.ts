import request, {prepareOptions} from './request'
import {Settings} from '../types'
import {RequestOptions} from './request'
import {FileInfo, ResponseInterface} from './types'

export type UrlData = {
  sourceUrl: string,
  checkForUrlDuplicates?: boolean,
  saveUrlForRecurrentUploads?: boolean
}

type TokenResponse = {
  type: string,
  token: string,
}

type InfoResponse = FileInfo & {
  type: string,
}

export type FromUrlResponse = TokenResponse | InfoResponse | ResponseInterface

/**
 * Uploading files from URL.
 *
 * @param {UrlData} urlData – Source file URL, which should be a public HTTP or HTTPS link.
 * @param {Settings} settings
 * @return {Promise<FromUrlResponse>}
 */
export default function fromUrl(
  {sourceUrl, checkForUrlDuplicates, saveUrlForRecurrentUploads}: UrlData, settings: Settings = {}
): Promise<FromUrlResponse> {
  const options: RequestOptions = prepareOptions({
    method: 'POST',
    path: '/from_url/',
    query: {
      pub_key: settings.publicKey || '',
      source_url: sourceUrl,
      store: settings.doNotStore ? settings.doNotStore : true,
      filename: settings.fileName || '',
      check_URL_duplicates: checkForUrlDuplicates ? 1 : 0,
      save_URL_duplicates: saveUrlForRecurrentUploads ? 1 : 0,
      signature: settings.secureSignature || '',
      expire: settings.secureExpire || '',
    },
  }, settings)

  return request(options)
    .then(response => response.data)
}
