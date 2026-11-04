import { useCallback, useEffect, useId, useRef, useState } from 'react'

export default function useManuscriptSpeech() {
  const instanceId = useId()
  const session = useRef(0)
  const utteranceRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState('')
  const [voiceName, setVoiceName] = useState('')
  const clearError = useCallback(() => setError(''), [])

  const stop = useCallback(() => {
    session.current += 1
    if (utteranceRef.current) window.speechSynthesis?.cancel()
    utteranceRef.current = null
    setPlaying(false)
    setVoiceName('')
  }, [])

  useEffect(() => {
    window.speechSynthesis?.getVoices()
    const onOtherSample = (event) => {
      if (event.detail !== instanceId) stop()
    }
    window.addEventListener('chaptera:sample-play', onOtherSample)
    window.addEventListener('chaptera:main-play', stop)
    return () => {
      window.removeEventListener('chaptera:sample-play', onOtherSample)
      window.removeEventListener('chaptera:main-play', stop)
      stop()
    }
  }, [instanceId, stop])

  const toggle = useCallback(({ text, languageCode, narratorName, speed }) => {
    if (utteranceRef.current) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
        setPlaying(true)
      } else {
        window.speechSynthesis.pause()
        setPlaying(false)
      }
      return
    }
    setError('')
    const synth = window.speechSynthesis
    if (!synth || !window.SpeechSynthesisUtterance) {
      setError('This browser does not support reading documents aloud.')
      return
    }
    const voices = synth.getVoices()
    const matching = voices.filter((voice) => voice.lang.toLowerCase().split(/[-_]/)[0] === languageCode)
    if (!matching.length) {
      setError(voices.length
        ? 'No device voice is available for this language. Install a matching text-to-speech voice in your device settings.'
        : 'Device voices are still loading. Try Play again once your device voices are ready.')
      return
    }
    const voice = matching.find((item) => item.name.toLowerCase().includes(narratorName.toLowerCase())) || matching[0]
    const chunks = text.match(/[\s\S]{1,180}(?:\s|$)|[\s\S]{1,180}/g) || []
    if (!chunks.length) return
    window.dispatchEvent(new CustomEvent('chaptera:sample-play', { detail: instanceId }))
    synth.cancel()
    const currentSession = ++session.current
    setVoiceName(voice.name)
    setPlaying(true)
    const speakChunk = (index) => {
      if (session.current !== currentSession) return
      if (index === chunks.length) {
        utteranceRef.current = null
        setPlaying(false)
        return
      }
      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.voice = voice
      utterance.lang = voice.lang
      utterance.rate = speed
      utterance.onend = () => speakChunk(index + 1)
      utterance.onerror = () => {
        if (session.current !== currentSession) return
        utteranceRef.current = null
        setPlaying(false)
        setError('Document playback stopped. Press Play to try again.')
      }
      utteranceRef.current = utterance
      synth.speak(utterance)
    }
    speakChunk(0)
  }, [instanceId])

  return { toggle, stop, playing, error, clearError, voiceName }
}
