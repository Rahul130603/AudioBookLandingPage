/**
 * Frontend-only conversion adapter.
 *
 * The UI calls this single function so the simulated pipeline can be replaced
 * with a real backend without touching the Studio component. A production
 * implementation would POST multipart/form-data to `/api/convert`, subscribe to
 * job progress (SSE or websocket), and return the rendered audio manifest.
 */
export const CONVERSION_ENDPOINT = '/api/convert'

export const STAGES = [
  { key: 'read', label: 'Reading manuscript', detail: 'Pages, chapters, and punctuation mapped', at: 0 },
  { key: 'structure', label: 'Building the chapter map', detail: 'Preserving the architecture of the book', at: 22 },
  { key: 'voice', label: 'Synthesising the voice', detail: 'Intonation, breath, and pause placed', at: 44 },
  { key: 'master', label: 'Mastering the audio', detail: 'Chapter markers and playback data', at: 79 },
]

export function getStageIndex(progress) {
  if (progress >= 100) return STAGES.length
  let index = 0
  STAGES.forEach((stage, i) => {
    if (progress >= stage.at) index = i
  })
  return index
}

export function simulateConversion({ file, language, voice, speed, onProgress, signal, duration = 5600 }) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Conversion cancelled', 'AbortError'))
      return
    }

    const start = performance.now()
    let frame

    const tick = (now) => {
      if (signal?.aborted) {
        cancelAnimationFrame(frame)
        reject(new DOMException('Conversion cancelled', 'AbortError'))
        return
      }

      const raw = Math.min(1, (now - start) / duration)
      // Ease the conversion forward with a gentle pause near the mastering step.
      const eased = raw < 0.82 ? 1 - Math.pow(1 - raw / 0.82, 2.4) : 0.92 + ((raw - 0.82) / 0.18) * 0.08
      const percent = Math.min(100, Math.round(eased * 100))
      onProgress?.(percent)

      if (raw < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        resolve({
          demo: true,
          manifest: {
            source: file?.name ?? 'Untitled manuscript',
            format: file?.ext ?? 'txt',
            language: language?.label ?? 'English',
            languageCode: language?.code ?? 'en',
            voice: voice?.name ?? 'Aria',
            speed,
            createdAt: new Date().toISOString(),
          },
          previewAudio: voice?.sampleAudio ?? '/audio/samples/voice-en-aria.mp3',
          downloadName: `chaptera-${(file?.name ?? 'manuscript')
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-z0-9]+/gi, '-')
            .toLowerCase()}-${(voice?.name ?? 'aria').toLowerCase()}-demo.mp3`,
        })
      }
    }

    frame = requestAnimationFrame(tick)
  })
}
