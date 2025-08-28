import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; navigation: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  //TODO: add locale on BE
  //const localeCode = req.nextUrl.searchParams.get('locale')
  const sync = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}/sync`,
    'POST',
    JSON.stringify(sync)
  )
  return apiResponse
}
