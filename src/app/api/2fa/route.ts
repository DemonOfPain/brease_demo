import { fetchAPIwithToken } from '@/lib/helpers/fetchAPIwithToken'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

// this request retrives the QR-code to scan with the authenticator app
export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (token) {
    try {
      const fetch2FACode = await fetch(process.env.API_URL + '/2fa-qrcode', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`
        }
      })
      const qrCode = await fetch2FACode.text()
      if (qrCode) {
        return NextResponse.json({
          data: qrCode.split(',')[1],
          message: 'QR code retrived.',
          status: 200,
          ok: true
        })
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

// this request deletes the has2fa attr from user when provided the code from the authenticator app
export async function DELETE(req: NextRequest) {
  const token = await getToken({ req })
  const code = await req.json()
  const apiResponse = await fetchAPIwithToken(token, `/2fa?code=${code}`, 'DELETE')
  return apiResponse
}

// this request must be called before the GET request in order to retrive the QR-code
export async function POST(req: NextRequest) {
  const token = await getToken({ req })
  const apiResponse = await fetchAPIwithToken(token, `/2fa`, 'POST')
  return apiResponse
}
