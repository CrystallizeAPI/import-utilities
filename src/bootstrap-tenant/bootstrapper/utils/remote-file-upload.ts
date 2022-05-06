import fs from 'fs'
import slug from 'slugify'
import FormData from 'form-data'
import fetch from 'node-fetch'
import xmlJS from 'xml-js'
import download from 'download'
import fileType, { FileTypeResult } from 'file-type'
import { v4 as uuid } from 'uuid'
// @ts-ignore
import m3u8ToMp4 from 'm3u8-to-mp4'

import execa from 'execa'
import { BootstrapperContext } from '.'
import gql from 'graphql-tag'

export const ffmpegAvailable = new Promise(async (resolve) => {
  try {
    await execa('ffmpeg', ['--help'])
    resolve(true)
  } catch (e) {
    resolve(false)
  }
})

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

async function downloadRemoteOrLocal(fileURL: string) {
  try {
    await fs.promises.access(fileURL)
    return fs.promises.readFile(fileURL)
  } catch (e) {
    return download(fileURL)
  }
}

async function downloadFile(fileURL: string) {
  const urlSafeFilename = getUrlSafeFileName(
    fileURL.split('/')[fileURL.split('/').length - 1].split('.')[0]
  )

  // Videos
  if (fileURL.endsWith('.m3u8')) {
    const canConvert = await ffmpegAvailable
    if (!canConvert) {
      throw new Error('No support for video conversion')
    }

    const tmpFile = `./tmp-${uuid()}.mp4`

    const converter = new m3u8ToMp4()
    await converter.setInputFile(fileURL).setOutputFile(tmpFile).start()

    const fileBuffer = await fs.promises.readFile(tmpFile)

    await fs.promises.unlink(tmpFile)

    return {
      filename: `${urlSafeFilename}.mp4`,
      contentType: 'video/mp4',
      file: fileBuffer,
    }
  }

  const fileBuffer = await downloadRemoteOrLocal(fileURL)

  let { ext, contentType } = await handleFileBuffer(fileBuffer)

  // Override for SVG files that somtimes get wrong mime type back
  if (fileURL.endsWith('.svg')) {
    ext = 'svg'
    contentType = 'image/svg+xml'
  }

  if (!ext || !contentType) {
    throw new Error(`Cannot determine filetype for "${fileURL}"`)
  }

  if (!contentType) {
    throw new Error(`Unsupported mime type "${contentType}"`)
  }

  const completeFilename = `${urlSafeFilename}.${ext}`

  return {
    filename: completeFilename,
    contentType,
    file: fileBuffer,
  }
}

async function handleFileBuffer(fileBuffer: Buffer) {
  const fType = await fileType.fromBuffer(fileBuffer)
  const contentType: MimeType | undefined | string = fType?.mime
  const ext = fType?.ext as string

  return {
    contentType,
    ext,
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

export async function remoteFileUpload({
  fileUrl,
  fileBuffer,
  fileName = '',
  contentType,
  context,
}: {
  fileUrl?: string
  fileBuffer?: Buffer
  fileName?: string
  contentType?: string
  context: BootstrapperContext
}): Promise<RemoteFileUploadResult | null> {
  try {
    let file: Buffer | null = fileBuffer || null

    if (fileUrl) {
      const downloadResult = await downloadFile(fileUrl)
      file = downloadResult.file
      fileName = downloadResult.filename
      contentType = downloadResult.contentType
    } else if (file && !contentType) {
      const result = await handleFileBuffer(file)

      contentType = result.contentType
    }

    if (!file) {
      throw new Error(
        'Could not handle file ' + JSON.stringify({ fileUrl, fileName })
      )
    }

    // Create the signature required to do an upload
    const signedUploadResponse = await context.callPIM({
      variables: {
        tenantId: context.tenantId,
        fileName,
        contentType,
      },
      query: gql`
        mutation generatePresignedRequest(
          $tenantId: ID!
          $fileName: String!
          $contentType: String!
        ) {
          fileUpload {
            generatePresignedRequest(
              tenantId: $tenantId
              filename: $fileName
              contentType: $contentType
            ) {
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
  } catch (e) {
    context.emitError(`Could not upload ${fileUrl}`)
    return null
  }
}
