'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/shadcn/ui/dialog'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'
import AssistantChatWindow from './AssistantChatWindow'
import AssistantInput from './AssistantInput'
import AssistantTabs from './AssistantTabs'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
import { X } from 'lucide-react'

const AssistantDialog = () => {
  const { isOpen, setOpen } = useAssistantStore()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col !gap-0 p-0 border border-brease-gray-5 bg-white shadow-brease-lg focus:outline-none focus:ring-0 focus-within:outline-none focus-within:ring-0">
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-4 border-b border-brease-gray-3 relative">
          <DialogTitle className="flex items-center gap-2 text-brease-gray-10 font-golos-medium">
            <div className="w-8 h-8 p-2 rounded-full flex items-center justify-center bg-white border border-brease-green-11">
              <Image src={breaseLogo} alt="AI Assistant" width={24} height={24} />
            </div>
            Assistant
          </DialogTitle>
          <DialogDescription className="sr-only">
            Start a conversation with the AI assistant. Ask questions, upload files, and get help
            with your project.
          </DialogDescription>
          <DialogClose className="p-2 rounded-md hover:bg-brease-gray-3 transition-colors">
            <X className="w-4 h-4 text-brease-gray-7" />
          </DialogClose>
        </DialogHeader>
        <AssistantTabs />
        <div className="flex-1 flex flex-col min-h-0">
          <AssistantChatWindow />
          <AssistantInput />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AssistantDialog
