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
  const getCachedPage = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}?locale=${localeCode}`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-page-${teamId}-${siteId}-${envId}-${pageId}-${localeCode}`],
    { revalidate: 600, tags: ['page'] }
  )
  const { data: responseData, shouldCache } = await getCachedPage()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-page-${teamId}-${siteId}-${envId}-${pageId}-${localeCode}`],
      {
        revalidate: false,
        tags: ['page']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response as NextResponse
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; page: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const pageId = params.page
  const localeCode = req.nextUrl.searchParams.get('locale')
  const updatedPageData = await req.formData()

  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}?locale=${localeCode}`,
    'POST',
    updatedPageData
  )
  revalidateTag('pages')
  revalidateTag('page')
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; page: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const pageId = params.page
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}`,
    'DELETE'
  )
  revalidateTag('pages')
  revalidateTag('page')
  return apiResponse
}
