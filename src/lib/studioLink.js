export const audiobookAppUrl = import.meta.env.VITE_AUDIOBOOK_APP_URL?.trim()
  || (import.meta.env.DEV ? 'http://localhost:3000/#audiobook' : '')

export const studioHref = audiobookAppUrl || '#studio'
