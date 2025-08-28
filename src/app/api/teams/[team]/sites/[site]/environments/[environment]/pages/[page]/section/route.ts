import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; page: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const pageId = params.page
  const syncData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/pages/${pageId}/section`,
    'POST',
    JSON.stringify(syncData)
  )
  revalidateTag('page-content')
  return apiResponse
}
