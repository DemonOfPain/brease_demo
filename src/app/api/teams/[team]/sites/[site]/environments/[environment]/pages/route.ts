import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache, revalidateTag } from 'next/cache'

//The parts commented out are a template to check if the caching is implemented properly
//Feel free to use it elsewhere for debugging (you'll need it) ;)
//Important!! Test the caching on prod build, running in dev will give you faulty results
//since in dev mode the server restarts on page reloads, hence dropping the cache. In prod the server
//does not restart, hence the cache will be available.

//let requestCounter = 0

export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  //const requestId = ++requestCounter
  //const startTime = Date.now()
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  // Get locale from query params or default to 'en'
  const url = new URL(req.url)
  const locale = url.searchParams.get('locale') || 'en'
  let cacheHit = true
  //console.log(`📥 [${requestId}] GET request for pages: ${teamId}/${siteId}/${envId}/${locale}`)
  //let cacheHit = true
  const getCachedPages = unstable_cache(
    async () => {
      //cacheHit = false
      //console.log(`🔄 [${requestId}] CACHE MISS: Fetching pages from API for ${teamId}/${siteId}/${envId}/${locale}`)
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages?locale=${locale}`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-pages-${teamId}-${siteId}-${envId}-${locale}`],
    {
      revalidate: 600,
      tags: ['pages']
    }
  )
  const { data: responseData, shouldCache } = await getCachedPages()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-pages-${teamId}-${siteId}-${envId}-${locale}`],
      {
        revalidate: false,
        tags: ['pages']
      }
    )()
  }
  // const endTime = Date.now()
  // const duration = endTime - startTime
  // if (cacheHit) {
  //   console.log(`✅ [${requestId}] CACHE HIT: Returned cached data in ${duration}ms`)
  // } else {
  //   console.log(`⏱️ [${requestId}] Completed API request in ${duration}ms`)
  // }
  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response as NextResponse
}

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const newPageData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages`,
    'POST',
    newPageData
  )
  revalidateTag('pages')
  return apiResponse
}
