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
  const getCachedSections = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/sections`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-sections-${teamId}-${siteId}-${envId}`],
    { revalidate: 600, tags: ['sections'] }
  )
  const { data: responseData, shouldCache } = await getCachedSections()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-sections-${teamId}-${siteId}-${envId}`],
      {
        revalidate: false,
        tags: ['sections']
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
  const sectionData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/sections`,
    'POST',
    sectionData
  )
  revalidateTag('sections')
  return apiResponse
}
