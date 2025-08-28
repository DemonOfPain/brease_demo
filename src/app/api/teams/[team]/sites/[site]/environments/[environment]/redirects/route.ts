import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag, unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

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
  const getCachedNavigations = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/redirects`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-redirects-${teamId}-${siteId}-${envId}`],
    {
      revalidate: 600,
      tags: ['redirects']
    }
  )
  const { data: responseData, shouldCache } = await getCachedNavigations()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-redirects-${teamId}-${siteId}-${envId}`],
      {
        revalidate: false,
        tags: ['redirects']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const redirectData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/redirects`,
    'POST',
    redirectData
  )
  revalidateTag('redirects')
  return apiResponse
}
