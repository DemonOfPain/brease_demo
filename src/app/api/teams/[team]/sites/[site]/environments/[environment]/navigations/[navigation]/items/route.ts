import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; navigation: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const localeCode = req.nextUrl.searchParams.get('locale')
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}/items?locale=${localeCode}`,
    'GET'
  )
  return apiResponse
}

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; navigation: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const localeCode = req.nextUrl.searchParams.get('locale')
  const navItemData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}/items?locale=${localeCode}`,
    'POST',
    JSON.stringify(navItemData)
  )
  return apiResponse
}
