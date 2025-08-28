import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { team: string } }) {
  try {
    const token = await getToken({ req })
    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    const { priceId, successUrl, cancelUrl } = await req.json()
    if (!priceId) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Price ID is required'
        },
        { status: 400 }
      )
    }

    const teamId = params.team
    const requestBody = JSON.stringify({
      priceId: priceId,
      successUrl: successUrl,
      cancelUrl: cancelUrl
    })

    const apiResponse = await fetchAPIwithToken(
      token,
      `/teams/${teamId}/checkout`,
      'POST',
      requestBody
    )

    return apiResponse
  } catch (error) {
    console.error('Checkout API Error:', error)
    return NextResponse.json(
      {
        ok: false,
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
