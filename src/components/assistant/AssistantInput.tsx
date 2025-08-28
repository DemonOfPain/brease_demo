'use client'

import React, { useState, useRef } from 'react'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { Badge } from '@/components/shadcn/ui/badge'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'
import Button from '@/components/generic/Button'
import { Paperclip, X } from 'lucide-react'
import { MEDIA_LIB_ALLOWED_MIME_TYPES } from '@/components/media-library/MEDIA_LIB_ALLOWED_MIME_TYPES'

// Only allow file types that can be processed by AI agents
// Images: Direct visual processing, PDFs: Content analysis via OpenRouter
const AGENT_ALLOWED_MIME_TYPES = MEDIA_LIB_ALLOWED_MIME_TYPES.filter((type) => {
  // Exclude archive types
  const archiveTypes = ['zip', 'rar', 'tar', 'gzip', '7z']
  if (archiveTypes.some((archiveType) => type.includes(archiveType))) {
    return false
  }

  // Exclude video and audio types (cannot be meaningfully processed by agents)
  if (type.startsWith('video/') || type.startsWith('audio/')) {
    return false
  }

  // Only include images and PDFs
  return type.startsWith('image/') || type === 'application/pdf'
})

const AssistantInput = () => {
  const { sendMessage, loading } = useAssistantStore()
  const [message, setMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return
    const messageToSend = message
    const filesToSend = selectedFiles
    setMessage('')
    setSelectedFiles([])
    await sendMessage(messageToSend, filesToSend)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t border-brease-gray-3 p-4 space-y-3">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span className="truncate max-w-20">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-1 hover:text-brease-error transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon="Paperclip"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex-shrink-0"
        />
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="resize-none min-h-[44px] max-h-32 pr-12"
            disabled={loading}
            rows={1}
          />
          <Button
            variant="primary"
            size="sm"
            icon="Send"
            onClick={handleSendMessage}
            disabled={loading || (!message.trim() && selectedFiles.length === 0)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
          />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept={AGENT_ALLOWED_MIME_TYPES.join(',')}
      />
    </div>
  )
}

export default AssistantInput
