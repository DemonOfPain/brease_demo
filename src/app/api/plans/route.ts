import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// GET all elements for editor/builder
export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  
  // DEMO MODE: Return mock plans if no token
  if (!token) {
    return NextResponse.json({
      ok: true,
      status: 'success',
      message: 'Plans fetched',
      data: {
        plans: [
          {
            id: 'plan-001',
            name: 'Free',
            price: 0,
            features: ['1 Site', '10 Pages', '1GB Storage']
          },
          {
            id: 'plan-002',
            name: 'Pro',
            price: 29,
            features: ['Unlimited Sites', 'AI Assistant'],
            recommended: true
          }
        ]
      },
      cached: false
    })
  }
  let cacheHit = true
  const getCachedElements = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(token, `/plans`, 'GET')
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-plans-list`],
    { revalidate: false, tags: ['plans'] }
  )
  const { data: responseData, shouldCache } = await getCachedElements()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(async () => null, [`${token.accessToken}-plans-list`], {
      revalidate: false,
      tags: ['plans']
    })()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}
