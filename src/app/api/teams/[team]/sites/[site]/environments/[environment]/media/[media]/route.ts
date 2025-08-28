import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

// GET single media
export async function GET(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; media: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const mediaId = params.media
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/media/${mediaId}`,
    'GET'
  )
  return apiResponse
}

// DELETE media
export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; media: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const mediaId = params.media
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/media/${mediaId}`,
    'DELETE'
  )
  revalidateTag('media-lib')
  return apiResponse
}

// UPDATE media
export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; media: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const mediaId = params.media
  const mediaData = await req.formData()
  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/media/${mediaId}`,
    'POST',
    mediaData
  )
  revalidateTag('media-lib')
  return apiResponse
}
