import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { fetchSummarizationAgentWithPreset } from '@/lib/helpers/assistantHelpers'
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

    const requestBody = await req.json()
    const {
      conversationText,
      environmentData
    }: {
      conversationText: string
      environmentData: any
    } = requestBody

    const userPrompt = `Summarize the following conversation history into a concise summary that captures the key points, decisions, and context. This summary will be used to provide context for continuing the conversation.
                        Conversation to summarize:
                        ${conversationText}
                        Please provide a comprehensive but concise summary.`

    const summaryResponse = await fetchSummarizationAgentWithPreset(userPrompt, environmentData)

    console.log('Summarization Agent Response:', summaryResponse)

    if (!summaryResponse.success) {
      breaseResponse.message = `Summarization agent error: ${summaryResponse.error}`
      breaseResponse.statusCode = 500
      return NextResponse.json(breaseResponse, { status: 500 })
    }

    breaseResponse.data = {
      summary: summaryResponse.data?.message || ''
    }
    breaseResponse.message = 'Summary generated successfully'
    breaseResponse.statusCode = 200
    breaseResponse.ok = true
    return NextResponse.json(breaseResponse, { status: 200 })
  } catch (error: any) {
    console.error('❌ Summarization route error:', error)
    breaseResponse.message = error?.message || 'Internal server error'
    breaseResponse.statusCode = 500
    breaseResponse.ok = false
    return NextResponse.json(breaseResponse, { status: 500 })
  }
}
