import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag, unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; page: string } }
) {
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const pageId = params.page
  const localeCode = req.nextUrl.searchParams.get('locale')
  let cacheHit = true
  const getCachedPageContent = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}/contents?locale=${localeCode}`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-content-${teamId}-${siteId}-${envId}-${pageId}-${localeCode}`],
    {
      revalidate: 600,
      tags: ['page-content']
    }
  )
  const { data: responseData, shouldCache } = await getCachedPageContent()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-content-${teamId}-${siteId}-${envId}-${pageId}-${localeCode}`],
      {
        revalidate: false,
        tags: ['page-content']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; page: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const pageId = params.page
  const localeCode = req.nextUrl.searchParams.get('locale')
  const syncData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}/contents?locale=${localeCode}`,
    'POST',
    JSON.stringify(syncData)
  )
  revalidateTag('page-content')
  return apiResponse
}
