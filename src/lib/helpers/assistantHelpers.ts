/**
 * Assistant Helper Functions
 *
 * This file contains utility functions for handling assistant operations,
 * including OpenRouter API communication, error handling, and JSON parsing.
 */

import { AssistantMessage } from '@/interface/assistant'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { ProcessedFile, buildMessageContentWithFiles } from './fileProcessingHelpers'

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | any[] // Support both text and structured content
}

// Structured output formats
export interface ActionAgentOutput {
  more_info: boolean
  actions: Array<{
    targetType: 'PAGE' | 'PAGE_CONTENT' | 'ENTRY'
    targetName: string | null
    targetUuid: string | null
    operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'ORDER'
  }>
  message: string
}

export interface PayloadAgentOutput {
  payload: Record<string, any>
  error: string | null
}

export interface ConversationAgentOutput {
  needs_action: boolean
  message: string
}

export type StructuredOutputFormat = 'action_agent' | 'payload_agent' | 'conversation_agent'

export interface OpenRouterOptions {
  model?: string
  preset?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  tools?: any[]
  toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
  structuredOutput?: StructuredOutputFormat
  disableReasoning?: boolean
}

export interface OpenRouterRequest {
  userPrompt: string
  systemPrompt?: string
  additionalInfo?: string
  conversationHistory?: OpenRouterMessage[]
  options?: OpenRouterOptions
  environmentData?: any
  processedFiles?: ProcessedFile[] // New: Support for processed files
}

export interface OpenRouterResponse {
  success: boolean
  content: string
  fullResponse?: any
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  structuredOutput?: ActionAgentOutput | PayloadAgentOutput | ConversationAgentOutput
  outputFormat?: StructuredOutputFormat
}

// JSON Schema definitions for structured output
const SCHEMAS = {
  action_agent: {
    type: 'object',
    properties: {
      more_info: { type: 'boolean' },
      actions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            targetType: { type: 'string', enum: ['PAGE', 'PAGE_CONTENT', 'ENTRY'] },
            targetName: { type: ['string', 'null'] },
            targetUuid: { type: ['string', 'null'] },
            operationType: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE', 'ORDER'] }
          },
          required: ['targetType', 'targetName', 'targetUuid', 'operationType'],
          additionalProperties: false
        }
      },
      message: { type: 'string' }
    },
    required: ['more_info', 'actions', 'message'],
    additionalProperties: false
  },
  payload_agent: {
    type: 'object',
    properties: {
      payload: { type: 'object', additionalProperties: true },
      error: { type: ['string', 'null'] }
    },
    required: ['payload', 'error'],
    additionalProperties: false
  },
  conversation_agent: {
    type: 'object',
    properties: {
      needs_action: { type: 'boolean' },
      message: { type: 'string' }
    },
    required: ['needs_action', 'message'],
    additionalProperties: false
  }
}

/**
 * Main OpenRouter API communication function
 */
export async function fetchOpenRouter({
  userPrompt,
  systemPrompt,
  additionalInfo,
  conversationHistory = [],
  options = {},
  environmentData,
  processedFiles
}: OpenRouterRequest): Promise<OpenRouterResponse> {
  try {
    const messages = buildMessages({
      systemPrompt,
      environmentData,
      conversationHistory,
      additionalInfo,
      userPrompt,
      options,
      processedFiles
    })

    const requestBody = buildRequestBody(messages, options)
    const response = await callOpenRouterAPI(requestBody)

    return await handleResponse(response, options.structuredOutput)
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Build messages array for OpenRouter request
 */
function buildMessages({
  systemPrompt,
  environmentData,
  conversationHistory,
  additionalInfo,
  userPrompt,
  options,
  processedFiles
}: {
  systemPrompt?: string
  environmentData?: any
  conversationHistory: OpenRouterMessage[]
  additionalInfo?: string
  userPrompt: string
  options: OpenRouterOptions
  processedFiles?: ProcessedFile[]
}): OpenRouterMessage[] {
  const messages: OpenRouterMessage[] = []

  // Add environment data for presets
  if (options.preset && environmentData) {
    messages.push({
      role: 'system',
      content: `Current site environment data: ${JSON.stringify(environmentData, null, 2)}`
    })
    // Add JSON-only instructions for structured output
    if (options.structuredOutput) {
      messages.push({
        role: 'system',
        content: `CRITICAL: You must respond with ONLY valid JSON in the exact format specified. Do not include any natural language explanations, introductions, or additional text outside the JSON structure. Your entire response must be parseable JSON. Do not include any fields not specified in the schema, including reasoning, explanation, or similar fields.`
      })
    }
  }

  // Add system prompt for non-preset usage
  if (systemPrompt && !options.preset) {
    messages.push({ role: 'system', content: systemPrompt })
  }

  // Add conversation history
  messages.push(...conversationHistory)

  // Add additional context
  if (additionalInfo) {
    messages.push({ role: 'user', content: `Additional context: ${additionalInfo}` })
  }

  // Build the main user message with files
  let messageContent: string | any[] = userPrompt

  if (processedFiles && processedFiles.length > 0) {
    // Build structured content for OpenRouter
    messageContent = buildMessageContentWithFiles(userPrompt, processedFiles)
  }

  // Add main user message
  messages.push({ role: 'user', content: messageContent })

  return messages
}

/**
 * Build request body for OpenRouter API
 */
function buildRequestBody(messages: OpenRouterMessage[], options: OpenRouterOptions): any {
  // Transform messages to handle structured content
  const transformedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content // OpenRouter handles both string and structured content
  }))

  const requestBody: any = {
    model: options.preset,
    messages: transformedMessages,
    ...(options.temperature && { temperature: options.temperature }),
    ...(options.maxTokens && { max_tokens: options.maxTokens }),
    ...(options.topP && { top_p: options.topP }),
    ...(options.frequencyPenalty && { frequency_penalty: options.frequencyPenalty }),
    ...(options.presencePenalty && { presence_penalty: options.presencePenalty }),
    ...(options.stop && { stop: options.stop }),
    ...(options.tools && { tools: options.tools }),
    ...(options.toolChoice && { tool_choice: options.toolChoice })
  }

  // Add structured output schema
  if (options.structuredOutput) {
    requestBody.response_format = {
      type: 'json_schema',
      json_schema: {
        name: options.structuredOutput,
        strict: true,
        schema: SCHEMAS[options.structuredOutput]
      }
    }
  }

  return requestBody
}

/**
 * Call OpenRouter API
 */
async function callOpenRouterAPI(requestBody: any): Promise<Response> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
  }

  return response
}

/**
 * Handle OpenRouter response and parse structured output
 */
async function handleResponse(
  response: Response,
  structuredOutputFormat?: StructuredOutputFormat
): Promise<OpenRouterResponse> {
  try {
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    const usage = data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        }
      : undefined

    let structuredOutput:
      | ActionAgentOutput
      | PayloadAgentOutput
      | ConversationAgentOutput
      | undefined
    let outputFormat: StructuredOutputFormat | undefined

    if (structuredOutputFormat && content) {
      const parseResult = parseStructuredOutput(content, structuredOutputFormat)
      structuredOutput = parseResult.output
      outputFormat = parseResult.format
    }

    return {
      success: true,
      content,
      fullResponse: data,
      usage,
      structuredOutput,
      outputFormat
    }
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Failed to parse response'
    }
  }
}

/**
 * Parse structured output from content
 */
function parseStructuredOutput(
  content: string,
  expectedFormat: StructuredOutputFormat
): {
  output?: ActionAgentOutput | PayloadAgentOutput | ConversationAgentOutput
  format?: StructuredOutputFormat
} {
  try {
    // Extract JSON from content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const jsonContent = jsonMatch ? jsonMatch[0] : content
    const parsed = JSON.parse(jsonContent)

    // Validate and return based on expected format
    if (expectedFormat === 'action_agent' && validateActionOutput(parsed)) {
      return { output: parsed, format: 'action_agent' }
    } else if (expectedFormat === 'payload_agent' && validatePayloadOutput(parsed)) {
      return { output: parsed, format: 'payload_agent' }
    } else if (expectedFormat === 'conversation_agent' && validateConversationOutput(parsed)) {
      return { output: parsed, format: 'conversation_agent' }
    }

    // Try to fix invalid structures
    return attemptStructureFix(parsed, expectedFormat, content)
  } catch (error) {
    console.warn('⚠️ Failed to parse structured output:', error)
    return {}
  }
}

/**
 * Validation functions
 */
function validateActionOutput(output: any): output is ActionAgentOutput {
  return (
    output &&
    typeof output.more_info === 'boolean' &&
    Array.isArray(output.actions) &&
    typeof output.message === 'string'
  )
}

function validatePayloadOutput(output: any): output is PayloadAgentOutput {
  return (
    output &&
    typeof output.payload === 'object' &&
    (typeof output.error === 'string' || output.error === null)
  )
}

function validateConversationOutput(output: any): output is ConversationAgentOutput {
  return output && typeof output.needs_action === 'boolean' && typeof output.message === 'string'
}

/**
 * Attempt to fix invalid structures
 */
function attemptStructureFix(
  parsed: any,
  expectedFormat: StructuredOutputFormat,
  content: string
): {
  output?: ActionAgentOutput | PayloadAgentOutput | ConversationAgentOutput
  format?: StructuredOutputFormat
} {
  if (expectedFormat === 'conversation_agent') {
    // Try to extract natural text as fallback
    const naturalTextPart = content.split('{')[0]?.trim()
    if (naturalTextPart) {
      return {
        output: {
          needs_action: parsed.needs_action || false,
          message: naturalTextPart
        },
        format: 'conversation_agent'
      }
    }
  }

  console.warn('⚠️ Could not fix invalid structure for format:', expectedFormat)
  return {}
}

/**
 * Centralized assistant API helper to eliminate URL construction redundancy
 */
export async function callAssistantAPI(
  endpoint: 'environment' | 'conversation' | 'action' | 'schema' | 'payload' | 'summary',
  data: any,
  method: 'GET' | 'POST' | 'PUT' = 'POST'
): Promise<any> {
  const userState = useUserStore.getState()
  const siteState = useSiteStore.getState()

  const baseUrl = `/api/teams/${userState.user.currentTeam.uuid}/sites/${siteState.site.uuid}/environments/${siteState.environment.uuid}/assistant/${endpoint}`

  // Check if data has files and convert to FormData if needed
  let requestBody: FormData | string
  let isFormData = false
  if (data instanceof FormData) {
    requestBody = data
    isFormData = true
  } else if (data && data.files && data.files.length > 0) {
    // Convert to FormData when files are present
    const formData = new FormData()
    // Add files first
    data.files.forEach((file: File, index: number) => {
      formData.append(`files[${index}]`, file)
    })
    // Add other data fields
    Object.keys(data).forEach((key) => {
      if (key !== 'files') {
        const value = data[key]
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })
    requestBody = formData
    isFormData = true
  } else {
    requestBody = JSON.stringify(data)
    isFormData = false
  }

  const requestOptions: RequestInit = {
    method,
    ...(isFormData
      ? { body: requestBody }
      : {
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        })
  }

  const response = await fetch(baseUrl, requestOptions)
  const result = await response.json()

  if (!result.ok) {
    throw new Error(result.message || `${endpoint} request failed`)
  }

  return result
}

/**
 * Convert AssistantMessage to OpenRouter format
 */
export function convertToOpenRouterMessages(
  messages: AssistantMessage[],
  maxMessages = 20
): OpenRouterMessage[] {
  // Get recent messages and filter out system messages, only keep user/assistant
  const recentMessages = messages
    .slice(-maxMessages)
    .filter((msg) => msg.role === 'user' || msg.role === 'assistant')

  return recentMessages.map((msg) => {
    let content: string | any[] = msg.content

    // For user messages with processed files, build structured content
    if (msg.role === 'user' && msg.processedFiles && msg.processedFiles.length > 0) {
      // Build structured content for OpenRouter
      content = buildMessageContentWithFiles(msg.content, msg.processedFiles)
    } else if (msg.role === 'user' && msg.files && msg.files.length > 0) {
      // Fallback for legacy file handling (display only)
      const fileNames = msg.files.map((file) => file.name).join(', ')
      content = `${msg.content}\n[Attached files: ${fileNames}]`
    }

    return {
      role: msg.role,
      content: content,
      actions: msg?.actions || null
    }
  })
}

/**
 * Preset-based agent functions
 */
const PRESET_CONFIGS = {
  conversation: '@preset/brease-conversation-agent',
  action: '@preset/brease-action-agent',
  payload: '@preset/brease-payload-agent',
  summarization: '@preset/brease-summarization-agent'
}

/**
 * Summarize conversation history to a concise format
 */
export async function summarizeConversationHistory(
  messages: AssistantMessage[],
  environmentData: any
): Promise<{
  success: boolean
  summary?: string
  error?: string
}> {
  if (messages.length <= 20) {
    return { success: true, summary: '' } // No need to summarize
  }

  try {
    // Convert ALL messages to readable format (not just older ones)
    const conversationText = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n')

    // Use the summary API route to maintain consistency with other endpoints
    const result = await callAssistantAPI('summary', {
      conversationText,
      environmentData
    })

    if (result.data && result.data.summary) {
      return {
        success: true,
        summary: result.data.summary
      }
    } else {
      return {
        success: false,
        error: result.message || 'Failed to generate summary'
      }
    }
  } catch (error) {
    console.error('Error in summarizeConversationHistory:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get conversation history with summarization (sends only summary if >20 messages)
 */
export async function getConversationHistoryWithSummary(
  messages: AssistantMessage[],
  environmentData: any
): Promise<OpenRouterMessage[]> {
  // If we have 20 or fewer messages, just return them as-is
  if (messages.length <= 20) {
    return convertToOpenRouterMessages(messages)
  }

  try {
    // Get summary of ALL messages (since we have >20)
    const summaryResult = await summarizeConversationHistory(messages, environmentData)

    // If summarization was successful, return ONLY the summary
    if (summaryResult.success && summaryResult.summary) {
      return [
        {
          role: 'system',
          content: `Previous conversation summary: ${summaryResult.summary}`
        }
      ]
    }

    // If summarization failed, fall back to last 20 messages
    console.warn('Summarization failed, falling back to last 20 messages:', summaryResult.error)
    return convertToOpenRouterMessages(messages.slice(-20))
  } catch (error) {
    console.error('Error in getConversationHistoryWithSummary:', error)
    // Fallback to last 20 messages if anything goes wrong
    return convertToOpenRouterMessages(messages.slice(-20))
  }
}

/**
 * Updated Generic preset-based agent function with conversation history
 */
async function fetchAgentWithPreset<T>(
  agentType: 'conversation' | 'action' | 'payload',
  userPrompt: string,
  environmentData: any,
  options: {
    conversationHistory?: OpenRouterMessage[]
    openRouterOptions?: Omit<OpenRouterOptions, 'structuredOutput' | 'preset'>
    processedFiles?: ProcessedFile[]
  } = {}
): Promise<{
  success: boolean
  data: T | null
  error?: string
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
}> {
  try {
    const request: OpenRouterRequest = {
      userPrompt,
      environmentData,
      conversationHistory: options.conversationHistory || [],
      processedFiles: options.processedFiles,
      options: {
        ...options.openRouterOptions,
        preset: PRESET_CONFIGS[agentType],
        structuredOutput: `${agentType}_agent` as StructuredOutputFormat,
        disableReasoning: true
      }
    }

    const response = await fetchOpenRouter(request)

    if (!response.success) {
      return { success: false, data: null, error: response.error }
    }

    // Extract structured output
    if (response.structuredOutput && response.outputFormat === `${agentType}_agent`) {
      return {
        success: true,
        data: response.structuredOutput as T,
        usage: response.usage
      }
    }

    // Handle fallbacks
    if (agentType === 'conversation') {
      return {
        success: true,
        data: {
          needs_action: false,
          message:
            response.content || 'I apologize, but I encountered an issue processing your request.'
        } as T,
        usage: response.usage
      }
    }

    return {
      success: false,
      data: null,
      error: `Failed to get structured ${agentType} output`
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

/**
 * Specific agent functions using the generic implementation
 */
export const fetchConversationAgentWithPreset = (
  userPrompt: string,
  environmentData: any,
  options?: {
    conversationHistory?: OpenRouterMessage[]
    openRouterOptions?: Omit<OpenRouterOptions, 'structuredOutput' | 'preset'>
    processedFiles?: ProcessedFile[]
  }
) =>
  fetchAgentWithPreset<ConversationAgentOutput>(
    'conversation',
    userPrompt,
    environmentData,
    options
  )

export const fetchActionAgentWithPreset = (
  userPrompt: string,
  environmentData: any,
  options?: {
    conversationHistory?: OpenRouterMessage[]
    openRouterOptions?: Omit<OpenRouterOptions, 'structuredOutput' | 'preset'>
    processedFiles?: ProcessedFile[]
  }
) => fetchAgentWithPreset<ActionAgentOutput>('action', userPrompt, environmentData, options)

export async function fetchPayloadAgentWithPreset(
  userPrompt: string,
  environmentData: any,
  payloadStructure: any,
  payloadObjects: any,
  options: {
    conversationHistory?: OpenRouterMessage[]
    openRouterOptions?: Omit<OpenRouterOptions, 'structuredOutput' | 'preset'>
    processedFiles?: ProcessedFile[]
  } = {}
): Promise<{
  success: boolean
  data: PayloadAgentOutput | null
  error?: string
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
}> {
  let enhancedUserPrompt = `
    Original user request: ${userPrompt}
    Payload Structure: ${JSON.stringify(payloadStructure, null, 2)}
    Objects: ${JSON.stringify(payloadObjects, null, 2)}`

  return fetchAgentWithPreset<PayloadAgentOutput>(
    'payload',
    enhancedUserPrompt,
    environmentData,
    options
  )
}
/**
 * Summarize conversation history to a concise format
 */
export async function fetchSummarizationAgentWithPreset(
  userPrompt: string,
  environmentData: any,
  options?: {
    conversationHistory?: OpenRouterMessage[]
    openRouterOptions?: Omit<OpenRouterOptions, 'structuredOutput' | 'preset'>
  }
): Promise<{
  success: boolean
  data: ConversationAgentOutput | null
  error?: string
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number }
}> {
  try {
    const request: OpenRouterRequest = {
      userPrompt,
      environmentData,
      conversationHistory: options?.conversationHistory || [],
      options: {
        ...options?.openRouterOptions,
        preset: PRESET_CONFIGS.summarization,
        structuredOutput: 'conversation_agent' as StructuredOutputFormat,
        disableReasoning: true
      }
    }

    const response = await fetchOpenRouter(request)

    if (!response.success) {
      return { success: false, data: null, error: response.error }
    }

    // Extract structured output
    if (response.structuredOutput && response.outputFormat === 'conversation_agent') {
      return {
        success: true,
        data: response.structuredOutput as ConversationAgentOutput,
        usage: response.usage
      }
    }

    // Handle fallbacks
    if (response.content) {
      return {
        success: true,
        data: {
          needs_action: false,
          message: response.content
        } as ConversationAgentOutput,
        usage: response.usage
      }
    }

    return {
      success: false,
      data: null,
      error: 'Failed to get structured summarization output'
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
