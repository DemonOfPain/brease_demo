import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  try {
    const emailVerifyRes = await fetch(process.env.API_URL + '/resend', {
      method: 'POST',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      body: data
    })
    const res = await emailVerifyRes.json()
    const formatedResponse = {
      message: res.message,
      statusCode: emailVerifyRes.status,
      ok: emailVerifyRes.ok
    } as BreaseAPIResponse
    return NextResponse.json(formatedResponse)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error)
  }
}
