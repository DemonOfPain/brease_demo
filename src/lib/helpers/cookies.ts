export type CookieConsentType = 'all' | 'essential' | 'none' | null

export interface CookieSettings {
  essential: boolean // Required for app functionality
  analytics: boolean // Google Analytics, etc.
  preferences: boolean // User preferences, theme, etc.
}

export function getCookieConsent(): CookieConsentType {
  if (typeof window === 'undefined') return null

  const cookies = document.cookie.split(';')
  const consentCookie = cookies.find((cookie) => cookie.trim().startsWith('cookie-consent='))

  if (!consentCookie) return null

  const [, value] = consentCookie.split('=')
  return value.trim() as CookieConsentType
}

export function setCookieConsent(type: CookieConsentType) {
  const settings: CookieSettings = {
    essential: type !== 'none',
    analytics: type === 'all',
    preferences: type === 'all'
  }

  document.cookie = `cookie-consent=${type}; max-age=31536000; path=/`
  document.cookie = `cookie-settings=${JSON.stringify(settings)}; max-age=31536000; path=/`
}

export function checkStorageAccess(): boolean {
  const consent = getCookieConsent()
  return consent === 'all' || consent === 'essential'
}

// Wrapper for localStorage
// TODO: not in use in dev (v2)
export const safeStorage = {
  getItem(key: string): string | null {
    if (!checkStorageAccess()) {
      throw new Error('Storage access denied. Please enable essential cookies to use this feature.')
    }
    return localStorage.getItem(key)
  },

  setItem(key: string, value: string): void {
    if (!checkStorageAccess()) {
      throw new Error('Storage access denied. Please enable essential cookies to use this feature.')
    }
    localStorage.setItem(key, value)
  },

  removeItem(key: string): void {
    if (!checkStorageAccess()) {
      throw new Error('Storage access denied. Please enable essential cookies to use this feature.')
    }
    localStorage.removeItem(key)
  }
}
