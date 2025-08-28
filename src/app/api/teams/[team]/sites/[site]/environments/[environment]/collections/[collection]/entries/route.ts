import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag, unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const localeCode = req.nextUrl.searchParams.get('locale')
  let cacheHit = true
  const getCachedAllEntries = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}/entries?locale=${localeCode}`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-entries-${teamId}-${siteId}-${envId}-${collectionId}-${localeCode}`],
    { revalidate: 600, tags: ['entries'] }
  )
  const { data: responseData, shouldCache } = await getCachedAllEntries()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-entries-${teamId}-${siteId}-${envId}-${collectionId}-${localeCode}`],
      {
        revalidate: false,
        tags: ['entries']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response
}

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const entryData = await req.formData()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}/entries`,
    'POST',
    entryData
  )
  revalidateTag('entries')
  revalidateTag('all-entries')
  return apiResponse
}
