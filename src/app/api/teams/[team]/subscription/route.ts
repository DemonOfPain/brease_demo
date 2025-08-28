import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { team: string } }) {
  const token = await getToken({ req })
  const teamId = params.team
  const apiResponse = await fetchAPIwithToken(token, `/teams/${teamId}/subscription`, 'GET')
  return apiResponse
}

export async function DELETE(req: NextRequest, { params }: { params: { team: string } }) {
  const token = await getToken({ req })
  const teamId = params.team
  const apiResponse = await fetchAPIwithToken(token, `/teams/${teamId}/subscription`, 'DELETE')
  return apiResponse
}
