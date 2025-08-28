import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { team: string; site: string; token: string } }
) {
  const token = await getToken({ req })
  const teamId = params.team
  const siteId = params.site
  const tokenId = params.token
  const apiResponse = await fetchAPIwithToken(
    token,
    `/teams/${teamId}/sites/${siteId}/tokens/${tokenId}`,
    'DELETE'
  )
  revalidateTag('tokens')
  return apiResponse
}
