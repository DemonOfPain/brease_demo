import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from '@/components/shadcn/ui/use-toast'
import { useSiteStore } from './useSiteStore'
import {
  AssistantMessage,
  AssistantStore,
  AssistantTab,
  AssistantAction
} from '@/interface/assistant'
import { appendDataToFormData } from '../helpers/appendDataToFormData'
import { callAssistantAPI, getConversationHistoryWithSummary } from '../helpers/assistantHelpers'
import { executeOperation } from '../helpers/assistantOperationMap'
import { processFilesForAgents, ProcessedFile } from '../helpers/fileProcessingHelpers'

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set, get) => ({
      loading: false,
      isOpen: false,
      activeTabIndex: 0,
      tabs: [],

      setLoading: (isLoading) => set({ loading: isLoading }),

      setOpen: (isOpen) => {
        set({ isOpen })
        if (isOpen) {
          get().ensureEnvironmentTab()
        }
      },

      getEnvironmentTabs: () => {
        const currentEnvId = useSiteStore.getState().environment?.uuid || 'default'
        return get().tabs.filter((tab) => tab.environmentId === currentEnvId)
      },

      ensureEnvironmentTab: () => {
        const currentEnvId = useSiteStore.getState().environment?.uuid || 'default'
        const environmentTabs = get().getEnvironmentTabs()
        if (environmentTabs.length === 0) {
          const newTab: AssistantTab = {
            id: `tab_${currentEnvId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            name: 'New Chat',
            messages: [],
            environmentId: currentEnvId
          }
          set((state) => ({
            tabs: [...state.tabs, newTab],
            activeTabIndex: 0
          }))
        }
      },

      getConversationHistory: async (tabIndex?: number, environmentData?: any) => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeIndex = tabIndex ?? get().activeTabIndex
        const currentTab = environmentTabs[activeIndex]
        if (!currentTab) return []

        // If environmentData is not provided, fetch it (fallback for other calls)
        if (!environmentData) {
          const environmentResult = await callAssistantAPI('environment', new FormData())
          environmentData = environmentResult.data
        }

        return await getConversationHistoryWithSummary(
          currentTab.messages.slice(0, -1),
          environmentData
        )
      },

      updateMessage: (messageId: string, updates: Partial<AssistantMessage>) => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex
        const currentTab = environmentTabs[activeTabIndex]
        if (!currentTab) return

        const messageIndex = currentTab.messages.findIndex((msg) => msg.id === messageId)
        if (messageIndex !== -1) {
          const updatedTabs = get().tabs.map((tab) =>
            tab.id === currentTab.id
              ? {
                  ...tab,
                  messages: tab.messages.map((msg: AssistantMessage, index: number) =>
                    index === messageIndex ? { ...msg, ...updates } : msg
                  )
                }
              : tab
          )
          set({ tabs: updatedTabs })
        }
      },

      addMessageToCurrentTab: (message: AssistantMessage) => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex
        const currentTab = environmentTabs[activeTabIndex]
        if (!currentTab) return
        const updatedTabs = get().tabs.map((tab) =>
          tab.id === currentTab.id
            ? {
                ...tab,
                // Only keep the last 20 messages to prevent infinite growth
                messages: [...tab.messages, message].slice(-20)
              }
            : tab
        )
        set({ tabs: updatedTabs })
      },

      sendMessage: async (message: string, files?: File[]) => {
        get().ensureEnvironmentTab()
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex
        const currentTab = environmentTabs[activeTabIndex]
        if (!currentTab) return

        set({ loading: true })
        let processedFiles: ProcessedFile[] = []

        try {
          // Process files through media library if present
          if (files && files.length > 0) {
            processedFiles = await processFilesForAgents(files)
          }

          const userMessage: AssistantMessage = {
            id: `msg_user_${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date(),
            files: files?.map((file) => ({
              name: file.name,
              url: URL.createObjectURL(file),
              type: file.type,
              size: file.size
            })),
            processedFiles: processedFiles
          }
          get().addMessageToCurrentTab(userMessage)

          const requestData: any = { message: message }
          const formData = new FormData()
          appendDataToFormData(requestData, formData, 'POST', { arrayFormat: 'brackets' })

          const envResult = await callAssistantAPI('environment', formData)
          const environmentData = envResult.data
          const conversationHistory = await get().getConversationHistory(
            activeTabIndex,
            environmentData
          )

          // STEP 1: Call conversation route with conversation history and processed files
          const conversationPayload: any = {
            message: message,
            environmentData: environmentData,
            conversationHistory: conversationHistory,
            processedFiles: processedFiles
          }

          const conversationResult = await callAssistantAPI('conversation', conversationPayload)

          if (conversationResult.data.needs_action) {
            // STEP 2: Call action route with latest conversation response, user message, and processed files for context
            const assistantMessages = conversationHistory.filter((m) => m.role === 'assistant')
            const actionPayload: any = {
              message: `User: ${message}, Latest agent response: ${assistantMessages[assistantMessages.length - 1]?.content}`,
              environmentData: environmentData,
              processedFiles: processedFiles
            }

            const actionResult = await callAssistantAPI('action', actionPayload)

            const actions: AssistantAction[] =
              actionResult.data.actions?.map((action: any) => ({
                id: `action_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                targetType: action.targetType,
                targetName: action.targetName,
                targetUuid: action.targetUuid,
                operationType: action.operationType,
                status: 'pending' as const
              })) || []

            const assistantMessage: AssistantMessage = {
              id: `msg_assistant_${Date.now()}`,
              role: 'assistant',
              content: actionResult.data.message,
              timestamp: new Date(),
              agentType: 'action',
              actions: actions,
              isProcessingActions: actions.length > 0
            }

            get().addMessageToCurrentTab(assistantMessage)

            // STEP 3: Process actions (schema + payload)
            if (actions.length > 0) {
              for (const action of actions) {
                const currentMessageForProcessing = get()
                  .getEnvironmentTabs()
                  [get().activeTabIndex]?.messages.find((m) => m.id === assistantMessage.id)

                get().updateMessage(assistantMessage.id, {
                  actions: currentMessageForProcessing?.actions?.map((a) =>
                    a.id === action.id ? { ...a, status: 'processing' as const } : a
                  )
                })
                try {
                  const schemaResult = await callAssistantAPI('schema', {
                    target: action.targetType,
                    operation: action.operationType,
                    targetId: action.targetUuid || '',
                    targetName: action.targetName || ''
                  })

                  if (!schemaResult.data) {
                    throw new Error(schemaResult.message)
                  }

                  let payloadResult: any
                  if (action.operationType !== 'DELETE' || action.targetType === 'PAGE_CONTENT') {
                    const payloadPayload: any = {
                      userPrompt: message,
                      environmentData: environmentData,
                      payloadStructure: schemaResult.data.payload_structure,
                      payloadObjects: schemaResult.data.objects,
                      processedFiles: processedFiles
                    }

                    payloadResult = await callAssistantAPI('payload', payloadPayload)
                    if (payloadResult.data?.error) {
                      get().updateMessage(assistantMessage.id, {
                        actions: assistantMessage.actions?.map((a) =>
                          a.id === action.id
                            ? {
                                ...a,
                                status: 'failed' as const,
                                error:
                                  payloadResult.data?.error ||
                                  'AI response parsing failed - operation marked as failed'
                              }
                            : a
                        )
                      })
                      continue
                    }
                  }

                  try {
                    const operationResult = await executeOperation(
                      action.operationType,
                      action.targetType,
                      action.operationType !== 'DELETE' || action.targetType === 'PAGE_CONTENT'
                        ? payloadResult.data.payload
                        : null,
                      action.targetUuid || undefined,
                      schemaResult.data.url
                    )

                    const currentMessageForSuccess = get()
                      .getEnvironmentTabs()
                      [get().activeTabIndex]?.messages.find((m) => m.id === assistantMessage.id)

                    get().updateMessage(assistantMessage.id, {
                      actions: currentMessageForSuccess?.actions?.map((a) =>
                        a.id === action.id
                          ? {
                              ...a,
                              status: 'completed' as const,
                              result: {
                                ...schemaResult,
                                operationResult: operationResult
                              },
                              payload: payloadResult
                            }
                          : a
                      )
                    })
                  } catch (operationError) {
                    const errorMsg =
                      operationError instanceof Error ? operationError.message : 'Operation failed'

                    const currentMessageForOpError = get()
                      .getEnvironmentTabs()
                      [get().activeTabIndex]?.messages.find((m) => m.id === assistantMessage.id)

                    get().updateMessage(assistantMessage.id, {
                      actions: currentMessageForOpError?.actions?.map((a) =>
                        a.id === action.id
                          ? {
                              ...a,
                              status: 'failed' as const,
                              error: errorMsg,
                              result: schemaResult,
                              payload: payloadResult
                            }
                          : a
                      )
                    })
                  }
                } catch (actionError) {
                  const errorMsg =
                    actionError instanceof Error ? actionError.message : 'Unknown error occurred'

                  const currentMessageForError = get()
                    .getEnvironmentTabs()
                    [get().activeTabIndex]?.messages.find((m) => m.id === assistantMessage.id)

                  get().updateMessage(assistantMessage.id, {
                    actions: currentMessageForError?.actions?.map((a) =>
                      a.id === action.id
                        ? {
                            ...a,
                            status: 'failed' as const,
                            error: errorMsg
                          }
                        : a
                    )
                  })
                }
              }
            }
            get().updateMessage(assistantMessage.id, {
              isProcessingActions: false
            })
          } else {
            // No action needed, just display conversation response
            const assistantMessage: AssistantMessage = {
              id: `msg_assistant_${Date.now()}`,
              role: 'assistant',
              content: conversationResult.data.message,
              timestamp: new Date(),
              agentType: 'conversation'
            }
            get().addMessageToCurrentTab(assistantMessage)
          }
        } catch (error) {
          console.error('Assistant error:', error)
          const assistantMessage: AssistantMessage = {
            id: `msg_assistant_${Date.now()}`,
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date()
          }
          get().addMessageToCurrentTab(assistantMessage)
          toast({
            variant: 'error',
            title: 'Failed to send message. Please try again.'
          })
        } finally {
          set({ loading: false })
        }
      },

      clearMessages: () => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex
        const currentTab = environmentTabs[activeTabIndex]

        if (!currentTab) return

        const updatedTabs = get().tabs.map((tab) =>
          tab.id === currentTab.id
            ? {
                ...tab,
                messages: []
              }
            : tab
        )
        set({ tabs: updatedTabs })
      },

      addMessage: (message: AssistantMessage) => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex
        const currentTab = environmentTabs[activeTabIndex]

        if (!currentTab) return

        const updatedTabs = get().tabs.map((tab) =>
          tab.id === currentTab.id
            ? {
                ...tab,
                messages: [...tab.messages, message]
              }
            : tab
        )
        set({ tabs: updatedTabs })
      },

      switchTab: (index: number) => {
        const environmentTabs = get().getEnvironmentTabs()
        if (index >= 0 && index < environmentTabs.length) {
          set({ activeTabIndex: index })
        }
      },

      addTab: () => {
        const environmentTabs = get().getEnvironmentTabs()
        if (environmentTabs.length < 3) {
          const currentEnvId = useSiteStore.getState().environment?.uuid || 'default'
          const newTab: AssistantTab = {
            id: `tab_${currentEnvId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            name: 'New Chat',
            messages: [],
            environmentId: currentEnvId
          }
          const updatedTabs = [...get().tabs, newTab]
          set({
            tabs: updatedTabs,
            activeTabIndex: environmentTabs.length
          })
        } else {
          toast({
            variant: 'error',
            title: 'Maximum 3 chat tabs allowed'
          })
        }
      },

      removeTab: (index: number) => {
        const environmentTabs = get().getEnvironmentTabs()
        const activeTabIndex = get().activeTabIndex

        if (environmentTabs.length > 1) {
          const tabToRemove = environmentTabs[index]
          const updatedTabs = get().tabs.filter((tab) => tab.id !== tabToRemove.id)
          let newActiveIndex = activeTabIndex
          if (index <= activeTabIndex && activeTabIndex > 0) {
            newActiveIndex = activeTabIndex - 1
          } else if (index < activeTabIndex) {
            newActiveIndex = activeTabIndex - 1
          } else if (index === activeTabIndex && activeTabIndex >= environmentTabs.length - 1) {
            newActiveIndex = environmentTabs.length - 2
          }
          set({
            tabs: updatedTabs,
            activeTabIndex: newActiveIndex
          })
        } else {
          get().clearMessages()
        }
      },

      removeAllTabs: () => {
        const currentEnvId = useSiteStore.getState().environment?.uuid || 'default'
        const newTab: AssistantTab = {
          id: `tab_${currentEnvId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          name: 'New Chat',
          messages: [],
          environmentId: currentEnvId
        }
        const otherEnvironmentTabs = get().tabs.filter((tab) => tab.environmentId !== currentEnvId)
        set({
          tabs: [...otherEnvironmentTabs, newTab],
          activeTabIndex: 0
        })
      }
    }),
    {
      name: 'brease-assistant-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabIndex: state.activeTabIndex
      })
    }
  )
)
