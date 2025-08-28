'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'
import { useAssistantThinking } from '@/lib/hooks/useAssistantThinking'
import AssistantChatAvatar from './AssistantChatAvatar'
import AssistantChatBubble from './AssistantChatBubble'
import { Sparkles } from 'lucide-react'
import { useSiteStore } from '@/lib/hooks/useSiteStore'

const AssistantChatWindow = () => {
  const { tabs, activeTabIndex, loading, ensureEnvironmentTab, isOpen } = useAssistantStore()
  const environmentTabs = useMemo(() => {
    const currentEnvId = useSiteStore.getState().environment?.uuid || 'default'
    return tabs.filter((tab) => tab.environmentId === currentEnvId)
  }, [tabs])

  const messages = useMemo(() => {
    return environmentTabs[activeTabIndex]?.messages || []
  }, [environmentTabs, activeTabIndex])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [previousTabIndex, setPreviousTabIndex] = useState(activeTabIndex)

  useEffect(() => {
    ensureEnvironmentTab()
  }, [ensureEnvironmentTab])

  const { thinkingText, isThinking } = useAssistantThinking({
    isLoading: loading
  })

  const lastMessage = messages[messages.length - 1]
  const hasThinkingMessage = lastMessage?.thinking || false

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Handle tab switching - scroll instantly when tab changes
  useEffect(() => {
    if (activeTabIndex !== previousTabIndex) {
      setPreviousTabIndex(activeTabIndex)
      scrollToBottom('auto')
    }
  }, [activeTabIndex, previousTabIndex])

  // Handle new messages - smooth scroll for new messages in the same tab
  useEffect(() => {
    if (activeTabIndex === previousTabIndex) {
      scrollToBottom('smooth')
    }
  }, [messages, loading, isThinking, activeTabIndex, previousTabIndex])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom('auto')
      }, 0)
    }
  }, [isOpen])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-brease-gray-7">
          <div className="w-16 h-16 bg-brease-primary rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-brease-gray-1" />
          </div>
          <h3 className="text-t-md font-golos-medium text-brease-gray-9 mb-2">
            Hi! I&apos;m your Assistant
          </h3>
          <p className="text-t-sm text-brease-gray-7 max-w-sm">
            Ask me anything about your project, and I&apos;ll help you get things done faster and
            easier!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && <AssistantChatAvatar role={message.role} />}
              <AssistantChatBubble message={message} />
              {message.role === 'user' && <AssistantChatAvatar role={message.role} />}
            </div>
          ))}

          {loading && !hasThinkingMessage && isThinking && (
            <div className="flex gap-3 justify-start">
              <AssistantChatAvatar role="assistant" />
              <div className="flex flex-col max-w-[80%] mr-auto">
                <div className="flex items-center gap-2 mb-1 justify-start">
                  <span className="text-t-xs text-brease-gray-7 font-golos-medium">Assistant</span>
                  <span className="text-t-xs text-brease-gray-5">
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="p-3 rounded-lg shadow-brease-xs bg-brease-gray-3">
                  <p className="text-t-sm text-brease-gray-7 font-golos-regular whitespace-pre-wrap animate-pulse">
                    {thinkingText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default AssistantChatWindow
