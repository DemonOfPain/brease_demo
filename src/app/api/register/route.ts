import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const userData = await req.formData()
  try {
    const registerUser = await fetch(process.env.API_URL + '/register', {
      method: 'POST',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      body: userData
    })
    const res = await registerUser.json()
    return NextResponse.json(res)
  } catch (error) {
    console.error(error)
    return NextResponse.json(error)
  }
}
