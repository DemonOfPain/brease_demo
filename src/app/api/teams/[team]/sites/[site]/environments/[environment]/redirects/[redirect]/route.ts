import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; redirect: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const redirectId = params.redirect
  const redirectData = await req.formData()
  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/redirects/${redirectId}`,
    'POST',
    redirectData
  )
  revalidateTag('redirects')
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; redirect: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const redirectId = params.redirect
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/redirects/${redirectId}`,
    'DELETE'
  )
  revalidateTag('redirects')
  return apiResponse
}
