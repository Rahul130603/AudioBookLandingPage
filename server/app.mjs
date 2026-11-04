import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'

const NARRATORS = {
  aria: { name: 'en-US-AriaNeural', language: 'en' },
  atlas: { name: 'en-US-BrianNeural', language: 'en' },
  kavya: { name: 'ta-IN-PallaviNeural', language: 'ta' },
  arun: { name: 'ta-IN-ValluvarNeural', language: 'ta' },
  noor: { name: 'ur-PK-UzmaNeural', language: 'ur' },
  rayan: { name: 'ur-PK-AsadNeural', language: 'ur' },
}
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
}

function sendError(response, status, message) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify({ error: message }))
}

function readBody(request) {
  return new Promise((resolveBody, reject) => {
    let size = 0
    let oversized = false
    const chunks = []
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > 64 * 1024) {
        oversized = true
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      if (oversized) {
        reject(Object.assign(new Error('The request is too large.'), { status: 413 }))
        return
      }
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(Object.assign(new Error('Send a valid JSON request.'), { status: 400 }))
      }
    })
    request.on('error', reject)
  })
}

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character])
}

export function createChapteraServer({
  speechKey = process.env.AZURE_SPEECH_KEY,
  speechRegion = process.env.AZURE_SPEECH_REGION,
  fetchSpeech = fetch,
  staticDirectory = resolve('dist'),
} = {}) {
  const root = resolve(staticDirectory)
  let activeRequests = 0
  let windowStart = Date.now()
  let requestCount = 0

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost')
      if (url.pathname === '/api/convert') {
        if (request.method !== 'POST') {
          sendError(response, 405, 'Use POST to generate narration.')
          return
        }
        if (!speechKey || !speechRegion || !/^[a-z0-9]+$/.test(speechRegion)) {
          sendError(response, 503, 'Speech service is not configured. Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION on the server.')
          return
        }
        if (!request.headers['content-type']?.startsWith('application/json')) {
          sendError(response, 415, 'Send the manuscript as JSON.')
          return
        }
        const body = await readBody(request)
        const narrator = Object.hasOwn(NARRATORS, body?.voiceId) ? NARRATORS[body.voiceId] : null
        if (!narrator || narrator.language !== body?.languageCode) {
          sendError(response, 400, 'Choose a supported narrator for the selected language.')
          return
        }
        if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > 5000) {
          sendError(response, 400, 'Upload an excerpt containing 1 to 5,000 characters.')
          return
        }
        if (typeof body.speed !== 'number' || !Number.isFinite(body.speed) || body.speed < 0.75 || body.speed > 2) {
          sendError(response, 400, 'Reading speed must be between 0.75 and 2.')
          return
        }
        if (activeRequests >= 2) {
          sendError(response, 429, 'Two narrations are already generating. Please try again shortly.')
          return
        }
        if (Date.now() - windowStart >= 60 * 60 * 1000) {
          windowStart = Date.now()
          requestCount = 0
        }
        if (requestCount >= 30) {
          sendError(response, 429, 'The demo generation limit has been reached. Please try again in an hour.')
          return
        }
        activeRequests += 1
        requestCount += 1
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 90_000)
        const onDisconnect = () => {
          if (!response.writableEnded) controller.abort()
        }
        response.on('close', onDisconnect)
        try {
          const locale = narrator.name.split('-').slice(0, 2).join('-')
          const rate = Math.round((body.speed - 1) * 100)
          const text = body.text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
          const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${narrator.name}"><prosody rate="${rate}%">${escapeXml(text)}</prosody></voice></speak>`
          const audioResponse = await fetchSpeech(
            `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`,
            {
              method: 'POST',
              headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/ssml+xml',
                'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
                'User-Agent': 'Chaptera',
              },
              body: ssml,
              signal: controller.signal,
            },
          )
          if (!audioResponse.ok) {
            const message = audioResponse.status === 429
              ? 'Azure Speech quota is busy or exhausted. Please try again later.'
              : 'Azure could not generate the selected voice. Check the resource key, region, and voice availability.'
            sendError(response, 502, message)
            return
          }
          const audio = Buffer.from(await audioResponse.arrayBuffer())
          if (!audio.length) {
            sendError(response, 502, 'The speech service returned empty audio. Please try again.')
            return
          }
          response.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audio.length,
            'Cache-Control': 'no-store',
            'X-Chaptera-Voice': narrator.name,
          })
          response.end(audio)
        } catch {
          if (!response.destroyed) sendError(response, 504, 'Speech generation could not finish. Please try again.')
        } finally {
          clearTimeout(timeout)
          response.removeListener('close', onDisconnect)
          activeRequests -= 1
        }
        return
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        sendError(response, 405, 'Method not allowed.')
        return
      }
      const pathname = decodeURIComponent(url.pathname)
      const file = resolve(root, pathname === '/' ? 'index.html' : '.' + pathname)
      if (!file.startsWith(root + sep)) {
        sendError(response, 404, 'File not found.')
        return
      }
      const details = await stat(file).catch(() => null)
      if (!details?.isFile()) {
        sendError(response, 404, 'File not found.')
        return
      }
      response.writeHead(200, {
        'Content-Type': MIME_TYPES[extname(file)] || 'application/octet-stream',
        'Content-Length': details.size,
        'Cache-Control': pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      })
      if (request.method === 'HEAD') response.end()
      else createReadStream(file).on('error', () => response.destroy()).pipe(response)
    } catch (error) {
      if (!response.headersSent) sendError(response, error.status || 400, error.status ? error.message : 'The request could not be processed.')
      else response.destroy()
    }
  })
}
