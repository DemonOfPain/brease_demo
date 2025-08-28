import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  const code = await req.json()
  const formattedBody = { invitation_code: code }
  const apiResponse = await fetchAPIwithToken(
    token,
    '/accept-invite',
    'POST',
    JSON.stringify(formattedBody)
  )
  return apiResponse
}
