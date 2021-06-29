import slug from 'slugify'
import fs from 'fs'
import FormData from 'form-data'
import fetch from 'node-fetch'
import xmlJS from 'xml-js'
import download from 'download'
import fileType, { FileTypeResult } from 'file-type'

import { callPIM } from './api'

function getUrlSafeFileName(fileName: string) {
  return slug(fileName, {
    replacement: '-', // replace spaces with replacement
    lower: false, // result in lower case
    // @ts-ignore
    charmap: slug.charmap, // replace special characters
    // @ts-ignore
    multicharmap: slug.multicharmap, // replace multi-characters
  })
}

async function downloadFile(fileURL: string) {
  const urlSafeFilename = getUrlSafeFileName(
    fileURL.split('/')[fileURL.split('/').length - 1].split('.')[0]
  )

  const fileBuffer = await download(fileURL)

  const fType = await fileType.fromBuffer(fileBuffer)
  let contentType: MimeType | undefined | string = fType?.mime
  let ext = fType?.ext as string

  // Override for SVG files that somtimes get wrong mime type back
  if (fileURL.endsWith('.svg')) {
    ext = 'svg'
    contentType = 'image/svg+xml'
  }

  if (!ext || !contentType) {
    throw new Error(`Cannot determine filetype for "${fileURL}"`)
  }

  if (!contentType || !(contentType in mimeArray)) {
    throw new Error(`Unsupported mime type "${contentType}"`)
  }

  const completeFilename = `${urlSafeFilename}.${ext}`

  return {
    filename: completeFilename,
    contentType,
    file: fileBuffer,
  }
}

const mimeArray = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/webp': '.webp',
  'image/avif': '.avif',
}

export interface RemoteFileUploadResult {
  mimeType: string
  key: string
} 

export async function remoteFileUpload(
  fileUrl: string,
  tenantId: string
): Promise<RemoteFileUploadResult> {
  const { file, contentType, filename } = await downloadFile(fileUrl)

  // Create the signature required to do an upload
  const signedUploadResponse = await callPIM({
    variables: {
      tenantId,
      filename,
      contentType,
    },
    query: `
      mutation generatePresignedRequest($tenantId: ID!, $filename: String!, $contentType: String!) {
        fileUpload {
          generatePresignedRequest(tenantId: $tenantId, filename: $filename, contentType: $contentType) {
            url
            fields {
              name
              value
            }
          }
        }
      }
    `,
  })

  if (!signedUploadResponse || !signedUploadResponse.data?.fileUpload) {
    throw new Error('Could not get presigned request fields')
  }

  // Extract what we need for upload
  const {
    fields,
    url,
  } = signedUploadResponse.data.fileUpload.generatePresignedRequest

  const formData = new FormData()
  fields.forEach((field: any) => formData.append(field.name, field.value))
  formData.append('file', file)

  // Upload the file
  const uploadResponse = await fetch(url, {
    method: 'post',
    body: formData,
  })

  if (uploadResponse.status !== 201) {
    throw new Error('Cannot upload ' + fileUrl)
  }

  const jsonResponse = JSON.parse(xmlJS.xml2json(await uploadResponse.text()))

  const attrs = jsonResponse.elements[0].elements.map((el: any) => ({
    name: el.name,
    value: el.elements[0].text,
  }))

  return {
    mimeType: contentType as string,
    key: attrs.find((a: any) => a.name === 'Key').value,
  }
}
