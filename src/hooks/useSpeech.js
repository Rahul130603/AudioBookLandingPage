import { useCallback, useEffect, useRef, useState } from 'react'

const LANG_LOCALES = {
  en: 'en-US',
  ta: 'ta-IN',
  ur: 'ur-PK',
}

export default function useSpeech() {
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const [speakingId, setSpeakingId] = useState(null)
  const [notice, setNotice] = useState('')
  const utteranceRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setSpeakingId(null)
  }, [])

  const speak = useCallback(
    ({ text, langCode = 'en', rate = 1, id = 'sample', onNotice }) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        const message = 'Voice preview is not available in this browser. The full Chaptera player uses rendered audio.'
        setNotice(message)
        onNotice?.(message)
        return false
      }

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const locale = LANG_LOCALES[langCode] || 'en-US'
      const matching = voices.filter((voice) => voice.lang.toLowerCase().startsWith(langCode))

      if (matching.length > 0) {
        utterance.voice = matching[0]
      } else if (langCode !== 'en') {
        const message = `Your browser does not have a native ${
          langCode === 'ta' ? 'Tamil' : 'Urdu'
        } voice installed. The rendered Chaptera voice will be available through the conversion API.`
        setNotice(message)
        onNotice?.(message)
        return false
      }

      utterance.lang = utterance.voice?.lang || locale
      utterance.rate = rate
      utterance.pitch = 0.94
      utterance.volume = 1
      utterance.onstart = () => {
        setSpeaking(true)
        setSpeakingId(id)
      }
      utterance.onend = () => {
        setSpeaking(false)
        setSpeakingId(null)
      }
      utterance.onerror = () => {
        setSpeaking(false)
        setSpeakingId(null)
        const message = 'The browser voice preview was interrupted. Try again, or listen to the rendered sample below.'
        setNotice(message)
        onNotice?.(message)
      }
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      return true
    },
    [voices],
  )

  return { speak, stop, speaking, speakingId, notice, setNotice, voices }
}
