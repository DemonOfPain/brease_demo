import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const collectionData = await req.formData()
  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}`,
    'POST',
    collectionData
  )
  revalidateTag('collections')
  revalidateTag('sections')
  revalidateTag('page-content')
  revalidateTag('entries')
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}`,
    'DELETE'
  )
  revalidateTag('collections')
  revalidateTag('sections')
  revalidateTag('page-content')
  revalidateTag('entries')
  return apiResponse
}
