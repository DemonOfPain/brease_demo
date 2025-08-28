'use client'

import React from 'react'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { GenericAvatar } from '../generic/GenericAvatar'

interface AssistantChatAvatarProps {
  role: 'user' | 'assistant'
}

const AssistantChatAvatar = React.memo(({ role }: AssistantChatAvatarProps) => {
  const user = useUserStore((state) => state.user)
  if (role === 'user') {
    return (
      <GenericAvatar
        className="w-8 h-8"
        size={32}
        image={user.avatar as string}
        fallbackInitials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
      />
    )
  }

  return (
    <div className="w-8 h-8 p-2 rounded-full flex items-center justify-center bg-white border border-brease-primary">
      <Image src={breaseLogo} alt="AI Assistant" width={24} height={24} />
    </div>
  )
})

AssistantChatAvatar.displayName = 'AssistantChatAvatar'

export default AssistantChatAvatar
