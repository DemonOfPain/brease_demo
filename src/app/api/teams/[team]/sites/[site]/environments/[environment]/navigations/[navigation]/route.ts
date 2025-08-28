import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; navigation: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const navData = await req.formData()
  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}`,
    'POST',
    navData
  )
  revalidateTag('navigations')
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; navigation: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const navId = params.navigation
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/navigations/${navId}`,
    'DELETE'
  )
  revalidateTag('navigations')
  return apiResponse
}
