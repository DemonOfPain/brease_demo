import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

// TODO: talk to BE why the requests only works when data is in URL params and not in req body

export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  const code = await req.json()
  const apiResponse = await fetchAPIwithToken(token, `/2fa-confirm?code=${code}`, 'POST')
  return apiResponse
}
