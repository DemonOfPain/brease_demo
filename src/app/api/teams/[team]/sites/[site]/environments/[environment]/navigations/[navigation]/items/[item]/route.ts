import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  {
    params
  }: {
    params: { team: string; site: string; environment: string; navigation: string; item: string }
  }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const navItemId = params.item
  const localeCode = req.nextUrl.searchParams.get('locale')
  const navItemData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}/items/${navItemId}?locale=${localeCode}`,
    'PUT',
    JSON.stringify(navItemData)
  )
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  {
    params
  }: {
    params: { team: string; site: string; environment: string; navigation: string; item: string }
  }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const navItemId = params.item
  const localeCode = req.nextUrl.searchParams.get('locale')
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}/items/${navItemId}?locale=${localeCode}`,
    'DELETE'
  )
  return apiResponse
}
