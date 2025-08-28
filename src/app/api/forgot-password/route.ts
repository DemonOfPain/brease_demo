import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const data = await req.formData()
  try {
    const forgotPasswordRes = await fetch(process.env.API_URL + '/forgot-password', {
      method: 'POST',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      body: data
    })
    const res = await forgotPasswordRes.json()
    const formatedResponse = {
      message: res.message,
      statusCode: forgotPasswordRes.status,
      ok: forgotPasswordRes.ok
    } as BreaseAPIResponse
    return NextResponse.json(formatedResponse)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error)
  }
}
