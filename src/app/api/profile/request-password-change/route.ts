import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  const apiResponse = await fetchAPIwithToken(token, '/profile/request-password-change', 'POST')
  return apiResponse
}
