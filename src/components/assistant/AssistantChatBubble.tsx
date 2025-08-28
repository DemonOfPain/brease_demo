'use client'

import React from 'react'
import { Badge } from '@/components/shadcn/ui/badge'
import { AssistantMessage } from '@/interface/assistant'
import { useAssistantThinking } from '@/lib/hooks/useAssistantThinking'
import { Paperclip, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { useUserStore } from '@/lib/hooks/useUserStore'

interface AssistantChatBubbleProps {
  message: AssistantMessage
}

const AssistantChatBubble = ({ message }: AssistantChatBubbleProps) => {
  const isUser = message.role === 'user'
  const { user } = useUserStore()

  // Use thinking hook for assistant messages that are in thinking state
  const { thinkingText } = useAssistantThinking({
    isLoading: !isUser && (message.thinking || false),
    intervalRange: { min: 2000, max: 4000 }
  })

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Use thinking text if message is thinking and we have thinking text, otherwise use message content
  const displayContent = message.thinking && thinkingText ? thinkingText : message.content

  const getActionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-brease-success" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-brease-error" />
      case 'processing':
        return <Loader2 className="w-4 h-4 text-brease-secondary-blue animate-spin" />
      case 'pending':
      default:
        return <Clock className="w-4 h-4 text-brease-gray-7" />
    }
  }

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-brease-success-light border-brease-success'
      case 'failed':
        return 'bg-brease-error-light border-brease-error'
      case 'processing':
        return 'bg-brease-secondary-light-blue border-brease-secondary-blue'
      case 'pending':
      default:
        return 'bg-brease-gray-2 border-brease-gray-5'
    }
  }

  return (
    <div className={`flex flex-col max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <span className="text-t-xs text-brease-gray-7 font-golos-medium">
          {isUser ? user.firstName : 'Assistant'}
        </span>
        <span className="text-t-xs text-brease-gray-5">{formatTime(message.timestamp)}</span>
      </div>
      <div
        className={`p-3 rounded-lg shadow-brease-xs ${
          isUser ? 'bg-brease-green-11' : 'bg-brease-gray-3'
        } ${message.thinking ? 'animate-pulse' : ''}`}
      >
        <p
          className={`text-t-sm font-golos-regular whitespace-pre-wrap ${
            isUser ? 'text-white' : 'text-brease-gray-10'
          } ${message.thinking ? 'text-brease-gray-7' : ''}`}
        >
          {message.thinking && '🤔 '}
          {displayContent}
        </p>

        {message.files && message.files.length > 0 && (
          <div className="mt-3 pt-3 border-t border-current border-opacity-20">
            <div className="space-y-2">
              {message.files.map((file, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 flex-shrink-0" />
                  <span className="text-t-xs truncate">{file.name}</span>
                  {file.size && (
                    <Badge variant="secondary" className="text-t-xxs">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Section */}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brease-gray-6">
            <div className="space-y-2">
              {message.actions.map((action) => (
                <div
                  key={action.id}
                  className={`flex items-center gap-3 p-2 rounded-md border ${getActionStatusColor(action.status)}`}
                >
                  {getActionStatusIcon(action.status)}
                  <div className="flex-1 min-w-0">
                    <span className="text-t-xs font-golos-medium text-brease-gray-9">
                      {action.operationType} {action.targetType}
                    </span>
                    {action.status === 'failed' && action.error && (
                      <p className="text-t-xxs text-brease-error mt-1">Error: {action.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssistantChatBubble
