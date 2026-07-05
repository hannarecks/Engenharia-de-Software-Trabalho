import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

export class ExtractionError extends Error {
  constructor(message, cause) {
    super(message)
    this.name = 'ExtractionError'
    this.cause = cause
  }
}

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]

export function validateFile(file) {
  if (!file) {
    throw new ExtractionError('Nenhum arquivo selecionado.')
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ExtractionError(
      'Formato não suportado. Envie um arquivo PDF ou DOCX.'
    )
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ExtractionError('Arquivo excede o limite de 20MB.')
  }
  if (file.size === 0) {
    throw new ExtractionError('Arquivo vazio ou corrompido.')
  }
}

async function extractFromPdf(file) {
  try {
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

    if (pdf.numPages === 0) {
      throw new ExtractionError('PDF não contém páginas legíveis.')
    }

    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(' ')
      fullText += pageText + '\n'
    }

    if (!fullText.trim()) {
      throw new ExtractionError(
        'Não foi possível extrair texto do PDF. Pode ser um documento escaneado (imagem).'
      )
    }

    return fullText.trim()
  } catch (err) {
    if (err instanceof ExtractionError) throw err
    throw new ExtractionError('Arquivo PDF corrompido ou inválido.', err)
  }
}

async function extractFromDocx(file) {
  try {
    const buffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })

    if (!result.value.trim()) {
      throw new ExtractionError('DOCX não contém texto extraível.')
    }

    return result.value.trim()
  } catch (err) {
    if (err instanceof ExtractionError) throw err
    throw new ExtractionError('Arquivo DOCX corrompido ou inválido.', err)
  }
}

export async function extractText(file) {
  validateFile(file)

  if (file.type === 'application/pdf') {
    return extractFromPdf(file)
  }
  return extractFromDocx(file)
}