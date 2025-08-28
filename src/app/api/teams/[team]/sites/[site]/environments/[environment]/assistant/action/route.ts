import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { fetchActionAgentWithPreset } from '@/lib/helpers/assistantHelpers'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  let breaseResponse: BreaseAPIResponse = {
    data: null,
    cached: null,
    message: '',
    statusCode: 500,
    ok: false
  }

  try {
    const token = await getToken({ req })
    if (!token) {
      breaseResponse.message = 'Unauthorized'
      breaseResponse.statusCode = 401
      return NextResponse.json(breaseResponse, { status: 401 })
    }

    // Handle JSON request (files are now processed through media library)
    const requestBody = await req.json()
    const { message, environmentData, processedFiles } = requestBody

    const actionResponse = await fetchActionAgentWithPreset(message, environmentData, {
      processedFiles: processedFiles
    })

    console.log('Action Agent Response:', JSON.stringify(actionResponse, null, 2))

    if (!actionResponse.success) {
      breaseResponse.message = `Action agent error: ${actionResponse.error}`
      breaseResponse.statusCode = 500
      return NextResponse.json(breaseResponse, { status: 500 })
    }

    breaseResponse.data = actionResponse.data
    breaseResponse.message = 'Success'
    breaseResponse.statusCode = 200
    breaseResponse.ok = true
    return NextResponse.json(breaseResponse, { status: 200 })
  } catch (error: any) {
    console.error('Route error:', error)
    breaseResponse.message = error?.message || 'Internal server error'
    breaseResponse.statusCode = 500
    breaseResponse.ok = false
    return NextResponse.json(breaseResponse, { status: 500 })
  }
}
