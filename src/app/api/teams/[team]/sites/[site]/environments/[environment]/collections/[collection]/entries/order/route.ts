import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { team: string; site: string; environment: string; collection: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const envId = params.environment
  const collectionId = params.collection
  const entriesData = await req.json()
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/environments/${envId}/collections/${collectionId}/entries/order`,
    'POST',
    JSON.stringify(entriesData)
  )
  revalidateTag('entries')
  return apiResponse
}
