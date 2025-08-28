import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag, unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string } }
) {
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  let cacheHit = true
  const getCachedSite = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(token, `/teams/${teamId}/sites/${siteId}`, 'GET')
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-site-${teamId}-${siteId}`],
    { revalidate: 60, tags: ['site'] }
  )
  const { data: responseData, shouldCache } = await getCachedSite()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(async () => null, [`${token.accessToken}-site-${teamId}-${siteId}`], {
      revalidate: false,
      tags: ['site']
    })()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response as NextResponse
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const apiResponse = await fetchAPIwithToken(token, `/teams/${teamId}/sites/${siteId}`, 'DELETE')
  revalidateTag('sites')
  revalidateTag('site')
  return apiResponse
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const siteData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}`,
    'PUT',
    JSON.stringify(siteData)
  )
  revalidateTag('sites')
  revalidateTag('site')
  return apiResponse
}
