import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { fetchPayloadAgentWithPreset } from '@/lib/helpers/assistantHelpers'

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request })
    if (!token) {
      const response: BreaseAPIResponse = {
        data: null,
        cached: null,
        message: 'Unauthorized',
        statusCode: 401,
        ok: false
      }
      return NextResponse.json(response, { status: 401 })
    }

    // Handle JSON request (files are now processed through media library)
    const body = await request.json()
    const { userPrompt, environmentData, payloadStructure, payloadObjects, processedFiles } = body

    // Use preset-based payload agent
    const payloadResponse = await fetchPayloadAgentWithPreset(
      userPrompt,
      environmentData,
      payloadStructure,
      payloadObjects,
      {
        processedFiles: processedFiles
      }
    )

    console.log('Payload Agent Response:', payloadResponse)

    if (!payloadResponse.success) {
      const response: BreaseAPIResponse = {
        data: null,
        cached: null,
        message: `Payload agent error: ${payloadResponse.error}`,
        statusCode: 500,
        ok: false
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: BreaseAPIResponse = {
      data: payloadResponse.data,
      cached: null,
      message: 'Success',
      statusCode: 200,
      ok: true
    }
    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('Route error:', error)
    const response: BreaseAPIResponse = {
      data: null,
      cached: null,
      message: error?.message || 'Internal server error',
      statusCode: 500,
      ok: false
    }
    return NextResponse.json(response, { status: 500 })
  }
}
