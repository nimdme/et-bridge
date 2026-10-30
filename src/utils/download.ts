import { etlabClient } from '../api/client'

/**
 * Downloads a protected file from ETLab by fetching it with the student's
 * Authorization Bearer token and Institute ID headers, then creating a local
 * Blob download.
 */
export async function downloadFileWithAuth(url: string, suggestedFilename?: string): Promise<void> {
  if (!url || url === '#') {
    throw new Error('No valid download URL provided')
  }

  // Handle Demo Mode
  if (etlabClient.isDemo()) {
    const filename = suggestedFilename || 'document.pdf'
    const demoBlob = new Blob(
      [`%PDF-1.4 Demo Document: ${filename}\nGenerated for offline / demo mode.`],
      { type: 'application/pdf' }
    )
    triggerBlobDownload(demoBlob, filename)
    return
  }

  // Ensure absolute URL to ETLab API
  const fullUrl = url.startsWith('http')
    ? url
    : `https://api.students.etlab.app${url.startsWith('/') ? '' : '/'}${url}`

  const session = etlabClient.getSession()
  const headers: Record<string, string> = {
    'Accept': 'application/pdf, application/octet-stream, */*'
  }

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`
  }

  if (session?.instituteId) {
    headers['X-Institute-ID'] = session.instituteId
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error(`Server returned error ${response.status}: Failed to download file`)
  }

  const blob = await response.blob()

  // Clean filename: strip leading server IDs (e.g., 128_59_1887_65124_...)
  let filename = suggestedFilename
  if (!filename) {
    const rawName = fullUrl.split('/').pop()?.split('?')[0] || 'attachment.pdf'
    // Decode URI
    const decoded = decodeURIComponent(rawName)
    // If it has pattern like digits_digits_..._filename.pdf, take the recognizable portion
    const cleaned = decoded.replace(/^(\d+_)+/, '')
    filename = cleaned || decoded
  }

  triggerBlobDownload(blob, filename)
}

/**
 * Opens a protected file in a new tab by fetching the blob with auth headers
 * and creating a local object URL.
 */
export async function viewFileWithAuth(url: string): Promise<void> {
  if (!url || url === '#') return

  if (etlabClient.isDemo()) {
    window.alert('Viewing documents is available in live authenticated sessions.')
    return
  }

  const fullUrl = url.startsWith('http')
    ? url
    : `https://api.students.etlab.app${url.startsWith('/') ? '' : '/'}${url}`

  const session = etlabClient.getSession()
  const headers: Record<string, string> = {
    'Accept': 'application/pdf, application/octet-stream, */*'
  }

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`
  }

  if (session?.instituteId) {
    headers['X-Institute-ID'] = session.instituteId
  }

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers
  })

  if (!response.ok) {
    throw new Error(`Failed to load file (${response.status})`)
  }

  const blob = await response.blob()
  const blobUrl = window.URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl)
  }, 60000)
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl)
  }, 10000)
}
