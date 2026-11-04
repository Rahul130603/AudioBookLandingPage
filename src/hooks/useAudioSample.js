import { useCallback, useEffect, useId, useRef, useState } from 'react'

/**
 * Small shared audio engine for voice audition samples.
 * Only one sample can play at a time across the page, and starting a sample
 * pauses the main audiobook player.
 */
export default function useAudioSample() {
  const instanceId = useId()
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.volume = 0.9

    const onEnded = () => setPlayingId(null)
    const onPause = () => setPlayingId(null)
    const onError = () => {
      setPlayingId(null)
      setError('The voice sample could not load. Please try again.')
    }
    const onOtherSample = (event) => {
      if (event.detail !== instanceId) {
        audio.pause()
      }
    }
    const onMainPlayer = () => {
      audio.pause()
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    window.addEventListener('chaptera:sample-play', onOtherSample)
    window.addEventListener('chaptera:main-play', onMainPlayer)
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      window.removeEventListener('chaptera:sample-play', onOtherSample)
      window.removeEventListener('chaptera:main-play', onMainPlayer)
      audio.removeAttribute('src')
      audio.load()
    }
  }, [instanceId])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setPlayingId(null)
  }, [])

  const toggle = useCallback(
    async (src, id) => {
      const audio = audioRef.current
      if (!audio || !src) return false
      setError('')

      if (playingId === id) {
        if (audio.paused) {
          try {
            await audio.play()
            setPlayingId(id)
          } catch {
            setError('Your browser could not resume the voice sample.')
          }
        } else {
          audio.pause()
          setPlayingId(null)
        }
        return true
      }

      if (audio.dataset.src !== src) {
        audio.dataset.src = src
        audio.src = src
        audio.load()
      }

      window.dispatchEvent(new CustomEvent('chaptera:sample-play', { detail: instanceId }))
      try {
        audio.currentTime = 0
        await audio.play()
        setPlayingId(id)
        return true
      } catch {
        setPlayingId(null)
        setError('Your browser could not start the voice sample. Try again or press play on the audiobook player.')
        return false
      }
    },
    [instanceId, playingId],
  )

  return { toggle, stop, playingId, error, setError }
}
