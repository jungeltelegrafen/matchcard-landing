import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).href

export async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf' || file.type === 'application/pdf') {
    return extractPdfText(file)
  }
  if (ext === 'docx') {
    return extractDocxText(file)
  }
  if (ext === 'txt' || file.type === 'text/plain') {
    return file.text()
  }
  throw new Error(`Unsupported file type: .${ext}. Please upload a PDF, DOCX, or TXT file.`)
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const lines = content.items.map(item => item.str).join(' ')
    pages.push(lines)
  }
  return pages.join('\n')
}

async function extractDocxText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
