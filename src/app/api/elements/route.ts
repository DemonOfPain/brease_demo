import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// GET all elements for editor/builder
export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  
  // DEMO MODE: Return mock elements if no token
  if (!token) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      message: 'Elements fetched',
      data: {
        elements: [
          { id: 'text', name: 'Text', icon: 'Type' },
          { id: 'image', name: 'Image', icon: 'Image' },
          { id: 'button', name: 'Button', icon: 'Button' },
          { id: 'form', name: 'Form', icon: 'Form' }
        ]
      },
      cached: false
    })
  }
  let cacheHit = true
  const getCachedElements = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(token, `/elements`, 'GET')
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-elements-list`],
    { revalidate: false, tags: ['elements'] }
  )
  const { data: responseData, shouldCache } = await getCachedElements()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(async () => null, [`${token.accessToken}-elements-list`], {
      revalidate: false,
      tags: ['elements']
    })()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}
