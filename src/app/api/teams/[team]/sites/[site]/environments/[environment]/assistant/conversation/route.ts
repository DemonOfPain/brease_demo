import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { fetchConversationAgentWithPreset, OpenRouterMessage } from '@/lib/helpers/assistantHelpers'
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

    const {
      message,
      environmentData,
      conversationHistory,
      processedFiles
    }: {
      message: string
      environmentData: any
      conversationHistory?: OpenRouterMessage[]
      processedFiles?: any[]
    } = requestBody

    const conversationResponse = await fetchConversationAgentWithPreset(message, environmentData, {
      conversationHistory: conversationHistory || [],
      processedFiles: processedFiles
    })

    console.log('Conversation Agent Response:', JSON.stringify(conversationResponse, null, 2))

    if (!conversationResponse.success) {
      breaseResponse.message = `Conversation agent error: ${conversationResponse.error}`
      breaseResponse.statusCode = 500
      return NextResponse.json(breaseResponse, { status: 500 })
    }

    breaseResponse.data = conversationResponse.data
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
