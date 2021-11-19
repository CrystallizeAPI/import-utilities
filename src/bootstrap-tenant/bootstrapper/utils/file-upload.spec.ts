import test from 'ava'
import { FileUploadManager, IcallAPI, IcallAPIResult } from '.'
import { RemoteFileUploadResult } from './remote-file-upload'

function getMockFileUploader() {
  const fileUploader = new FileUploadManager()

  fileUploader.remoteFileUpload = async (
    fileUrl
  ): Promise<RemoteFileUploadResult | null> => {
    return {
      mimeType: 'n/a',
      key: fileUrl,
    }
  }

  return fileUploader
}

test('It can upload a single file', async (t) => {
  const fileUploader = getMockFileUploader()

  const result = await fileUploader.uploadFromUrl('/some-external-file.jpg')

  t.is(result?.key, '/some-external-file.jpg', 'the uploaded url should match ')
})

test('It can upload 100k files', async (t) => {
  const fileUploader = getMockFileUploader()

  const urls: null[] = []
  urls.length = 100000
  urls.fill(null)

  const results = await Promise.all(
    urls.map(async (u, i) => {
      const url = `file-${i}.jpg`
      const result = await fileUploader.uploadFromUrl(url)

      return {
        url,
        urlUploaded: result?.key,
      }
    })
  )

  const expectedResults = urls.map((u, i) => ({
    url: `file-${i}.jpg`,
    urlUploaded: `file-${i}.jpg`,
  }))

  t.deepEqual(expectedResults, results, 'the uploaded urls should match ')
})
