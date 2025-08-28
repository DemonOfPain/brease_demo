import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// GET list of all locals
export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  
  // DEMO MODE: Return mock locales if no token
  if (!token) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      message: 'Locales fetched',
      data: {
        locales: [
          { code: 'en', name: 'English', flag: '🇺🇸' },
          { code: 'es', name: 'Spanish', flag: '🇪🇸' },
          { code: 'fr', name: 'French', flag: '🇫🇷' }
        ]
      },
      cached: false
    })
  }
  let cacheHit = true
  const getCachedAllLocales = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(token, `/locales`, 'GET')
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-all-locales-list`],
    { revalidate: false, tags: ['all-locales'] }
  )
  const { data: responseData, shouldCache } = await getCachedAllLocales()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(async () => null, [`${token.accessToken}-all-locales-list`], {
      revalidate: false,
      tags: ['all-locales']
    })()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}
