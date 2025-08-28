import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { unstable_cache } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

//This route is to fetch all existing entries for the navigation target field
export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  if (!token) throw Error('Token does not exists!')
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  let cacheHit = true
  const getCachedAllEntries = unstable_cache(
    async () => {
      cacheHit = false
      const apiResponse = await fetchAPIwithToken(
        token,
        `/teams/${teamId}/sites/${siteId}/environments/${envId}/entries`,
        'GET'
      )
      const responseData = await apiResponse.json()
      return {
        data: responseData,
        shouldCache: responseData.ok
      }
    },
    [`${token.accessToken}-all-entries-${teamId}-${siteId}-${envId}`],
    { revalidate: 600, tags: ['all-entries'] }
  )
  const { data: responseData, shouldCache } = await getCachedAllEntries()
  if (!shouldCache) {
    // Force cache miss on next request with this key
    unstable_cache(
      async () => null,
      [`${token.accessToken}-all-entries-${teamId}-${siteId}-${envId}`],
      {
        revalidate: false,
        tags: ['all-entries']
      }
    )()
  }

  responseData.cached = shouldCache && cacheHit
  const response = NextResponse.json(responseData)
  return response as NextResponse
}
