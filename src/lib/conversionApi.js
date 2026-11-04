/**
 * Neural narration API adapter.
 *
 * Sends extracted text to the server and receives the selected narrator as MP3.
 */
export const CONVERSION_ENDPOINT = '/api/convert'

export const STAGES = [
  { key: 'read', label: 'Reading manuscript', detail: 'Uploaded document text extracted', at: 0 },
  { key: 'structure', label: 'Synthesising selected voice', detail: 'Azure is generating your narrator audio', at: 22 },
  { key: 'voice', label: 'Generating MP3 audio', detail: 'Language and reading speed applied', at: 44 },
  { key: 'master', label: 'Preparing playback', detail: 'Your generated MP3 is ready to listen and download', at: 79 },
]

export function getStageIndex(progress) {
  if (progress >= 100) return STAGES.length
  let index = 0
  STAGES.forEach((stage, i) => {
    if (progress >= stage.at) index = i
  })
  return index
}

export async function convertManuscript({ file, language, voice, speed, onProgress, signal }) {
  if (!file?.text?.trim()) throw new Error('No readable manuscript text is available.')
  if (file.text.length > 5000) throw new Error('Upload a shorter excerpt of up to 5,000 characters for neural narration.')

  onProgress?.(22)
  const response = await fetch(CONVERSION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: file.text,
      languageCode: language.code,
      voiceId: voice.id,
      speed,
    }),
    signal,
  })
  if (!response.ok) {
    const failure = await response.json().catch(() => null)
    throw new Error(failure?.error || 'The narration server is unavailable. Deploy Chaptera as a Web Service with Azure Speech configured.')
  }
  if (!response.headers.get('content-type')?.includes('audio/mpeg')) {
    throw new Error('The narration endpoint did not return audio. Deploy the backend Web Service before converting.')
  }
  onProgress?.(79)
  const audio = await response.blob()
  if (signal?.aborted) throw new DOMException('Conversion cancelled', 'AbortError')
  if (!audio.size) throw new Error('No audio was returned. Please try again.')
  onProgress?.(100)
  return {
    previewAudio: URL.createObjectURL(audio),
    downloadName: 'chaptera-' + file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '-' + voice.id + '.mp3',
    manifest: {
      source: file.name,
      format: file.ext,
      language: language.label,
      languageCode: language.code,
      voice: voice.name,
      voiceId: voice.id,
      speed,
    },
  }
}
