import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function PUT(
  req: NextRequest,
  {
    params
  }: {
    params: { team: string; site: string; environment: string; collection: string; entry: string }
  }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const entryId = params.entry
  const localeCode = req.nextUrl.searchParams.get('locale')
  const entryData = await req.formData()
  // using 'POST' but reqMethod in formData has the correct method so BE will not fail
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}/entries/${entryId}?locale=${localeCode}`,
    'POST',
    entryData
  )
  revalidateTag('entries')
  revalidateTag('all-entries')
  return apiResponse
}

export async function DELETE(
  req: NextRequest,
  {
    params
  }: {
    params: { team: string; site: string; environment: string; collection: string; entry: string }
  }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const entryId = params.entry
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}/entries/${entryId}`,
    'DELETE'
  )
  revalidateTag('entries')
  revalidateTag('all-entries')
  return apiResponse
}
