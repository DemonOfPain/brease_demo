import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  const apiResponse = await fetchAPIwithToken(token, '/teams', 'GET')
  return apiResponse
}
