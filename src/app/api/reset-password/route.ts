import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  try {
    const resetPasswordRes = await fetch(process.env.API_URL + '/reset-password', {
      method: 'POST',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      body: data
    })
    const res = await resetPasswordRes.json()
    const formatedResponse = {
      message: res.message,
      statusCode: resetPasswordRes.status,
      ok: resetPasswordRes.ok
    } as BreaseAPIResponse
    return NextResponse.json(formatedResponse)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error)
  }
}
