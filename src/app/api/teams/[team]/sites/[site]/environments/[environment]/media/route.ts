import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag, unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// GET all media libary items (with cache)
export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  let cacheHit = true
  const getCachedMediaLib = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/media`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-media-lib-${teamId}-${siteId}-${envId}`],
    { revalidate: 600, tags: ['media-lib'] }
  )
  const { data: responseData, shouldCache } = await getCachedMediaLib()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-media-lib-${teamId}-${siteId}-${envId}`],
      {
        revalidate: false,
        tags: ['media-lib']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}

// POST media libary item
export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const mediaData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/media`,
    'POST',
    mediaData
  )
  revalidateTag('media-lib')
  return apiResponse
}
