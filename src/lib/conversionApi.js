/**
 * Frontend-only conversion adapter.
 *
 * Prepares extracted manuscript text and playback settings for device speech.
 * Audio-file generation can be added by posting the manuscript to a backend
 * and returning its rendered audio manifest.
 */
export const CONVERSION_ENDPOINT = '/api/convert'

export const STAGES = [
  { key: 'read', label: 'Reading manuscript', detail: 'Uploaded document text extracted', at: 0 },
  { key: 'structure', label: 'Preparing document narration', detail: 'Using the complete extracted manuscript', at: 22 },
  { key: 'voice', label: 'Preparing playback settings', detail: 'Language and reading speed selected', at: 44 },
  { key: 'master', label: 'Ready to read aloud', detail: 'Device speech starts when you press Play', at: 79 },
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
    if (!file?.text?.trim()) {
      reject(new Error('No readable manuscript text is available.'))
      return
    }
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
          text: file.text,
          manifest: {
            source: file?.name ?? 'Untitled manuscript',
            format: file?.ext ?? 'txt',
            language: language?.label ?? 'English',
            languageCode: language?.code ?? 'en',
            voice: voice?.name ?? 'Aria',
            speed,
            createdAt: new Date().toISOString(),
          },
        })
      }
    }

    frame = requestAnimationFrame(tick)
  })
}
