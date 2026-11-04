const MAX_TEXT_LENGTH = 1_000_000

export async function extractManuscript(file, extension) {
  let text
  if (extension === 'txt') {
    text = await file.text()
  } else if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const { default: workerUrl } = await import('pdfjs-dist/legacy/build/pdf.worker.mjs?url')
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false })
    try {
      const document = await task.promise
      const pages = []
      let length = 0
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => item.str ?? '').join(' ')
        length += pageText.length
        if (length > MAX_TEXT_LENGTH) throw new Error('This manuscript is too long. Upload a smaller document.')
        pages.push(pageText)
        page.cleanup()
      }
      text = pages.join('\n\n')
    } finally {
      await task.destroy()
    }
  } else {
    const { unzipSync, strFromU8 } = await import('fflate')
    let expandedSize = 0
    const entries = unzipSync(new Uint8Array(await file.arrayBuffer()), {
      filter(entry) {
        if (!/\.(xml|opf|xhtml|html|htm)$/i.test(entry.name)) return false
        expandedSize += entry.originalSize
        if (expandedSize > 20 * 1024 * 1024) throw new Error('This document is too large to extract in the browser.')
        return true
      },
    })
    const parse = (name, type = 'application/xml') => {
      if (!entries[name]) throw new Error('The document is missing a required content file.')
      const document = new DOMParser().parseFromString(strFromU8(entries[name]), type)
      if (document.querySelector('parsererror')) throw new Error('The document content could not be read.')
      return document
    }
    if (extension === 'docx') {
      text = [...parse('word/document.xml').getElementsByTagNameNS('*', 'p')]
        .map((paragraph) => [...paragraph.getElementsByTagNameNS('*', 't')].map((node) => node.textContent).join(''))
        .join('\n')
    } else {
      const packagePath = parse('META-INF/container.xml').getElementsByTagNameNS('*', 'rootfile')[0]?.getAttribute('full-path')
      const packageDocument = parse(packagePath)
      const items = [...packageDocument.getElementsByTagNameNS('*', 'item')]
      const chapters = [...packageDocument.getElementsByTagNameNS('*', 'itemref')]
      text = chapters.map((chapter) => {
        const item = items.find((entry) => entry.getAttribute('id') === chapter.getAttribute('idref'))
        if (!item) throw new Error('The EPUB chapter order could not be read.')
        const path = decodeURIComponent(new URL(item.getAttribute('href'), 'https://book.local/' + packagePath).pathname.slice(1))
        const document = parse(path, 'text/html')
        document.querySelectorAll('script,style').forEach((node) => node.remove())
        return document.body.textContent
      }).join('\n\n')
    }
  }

  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (!cleaned) throw new Error('No readable text was found. Scanned PDFs need OCR. Upload a text-based PDF or TXT file.')
  if (cleaned.length > MAX_TEXT_LENGTH) throw new Error('This manuscript is too long. Upload a smaller document.')
  return cleaned
}
