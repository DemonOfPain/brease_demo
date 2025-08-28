import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { OpenRouterMessage } from '@/lib/helpers/assistantHelpers'
import { ProcessedFile } from '@/lib/helpers/fileProcessingHelpers'

export interface AssistantStore {
  loading: boolean
  isOpen: boolean
  activeTabIndex: number
  tabs: AssistantTab[]
  // eslint-disable-next-line no-unused-vars
  setLoading: (isLoading: boolean) => void
  // eslint-disable-next-line no-unused-vars
  setOpen: (isOpen: boolean) => void
  // eslint-disable-next-line no-unused-vars
  sendMessage: (message: string, files?: File[]) => Promise<void>
  clearMessages: () => void
  // eslint-disable-next-line no-unused-vars
  addMessage: (message: AssistantMessage) => void
  // eslint-disable-next-line no-unused-vars
  addMessageToCurrentTab: (message: AssistantMessage) => void
  // eslint-disable-next-line no-unused-vars
  updateMessage: (messageId: string, updates: Partial<AssistantMessage>) => void
  // eslint-disable-next-line no-unused-vars
  switchTab: (index: number) => void
  addTab: () => void
  // eslint-disable-next-line no-unused-vars
  removeTab: (index: number) => void
  removeAllTabs: () => void
  // eslint-disable-next-line no-unused-vars
  getConversationHistory: (tabIndex?: number, environmentData?: any) => Promise<OpenRouterMessage[]>
  // New environment-specific methods
  getEnvironmentTabs: () => AssistantTab[]
  ensureEnvironmentTab: () => void
}

export interface AssistantTab {
  id: string
  name: string
  messages: AssistantMessage[]
  environmentId: string
}

export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  files?: AssistantFile[]
  processedFiles?: ProcessedFile[] // New: Files processed through media library
  agentType?: 'interpreter' | 'action' | string
  thinking?: boolean
  actions?: AssistantAction[]
  isProcessingActions?: boolean
}

export interface AssistantAction {
  id: string
  targetType: 'PAGE' | 'PAGE_CONTENT' | 'ENTRY'
  targetName: string | null
  targetUuid: string | null
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'ORDER'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  result?: any
  payload?: any
  warning?: string
}

export interface AssistantFile {
  name: string
  url: string // Local blob URL for display
  type: string
  size?: number
}

export interface AssistantRequest {
  message: string
  files?: AssistantFile[]
  processedFiles?: ProcessedFile[] // New: Processed files for agents
}

export interface AssistantResponse extends BreaseAPIResponse {
  data: {
    message: string
    actions?: AssistantAction[]
  }
}
