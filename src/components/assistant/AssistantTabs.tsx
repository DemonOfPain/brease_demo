'use client'

import React, { useEffect } from 'react'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'
import { Plus, X } from 'lucide-react'

const AssistantTabs = () => {
  const { getEnvironmentTabs, activeTabIndex, switchTab, addTab, removeTab, ensureEnvironmentTab } =
    useAssistantStore()

  // Get environment-specific tabs
  const environmentTabs = getEnvironmentTabs()

  // Ensure we have at least one tab for the current environment
  useEffect(() => {
    ensureEnvironmentTab()
  }, [ensureEnvironmentTab])

  const getTabName = (tab: any) => {
    if (tab.messages?.length > 0) {
      const firstMessage = tab.messages[0]
      return firstMessage.content.length > 20
        ? `${firstMessage.content.substring(0, 20)}...`
        : firstMessage.content
    }
    return tab.name || 'New Chat'
  }

  const handleTabClick = (index: number) => {
    switchTab(index)
  }

  return (
    <div className="flex items-end gap-0 px-4 pt-2 h-[44px] bg-brease-gray-2">
      <div className="flex items-center gap-1 flex-1 overflow-x-auto">
        {environmentTabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md rounded-b-none cursor-pointer transition-colors min-w-0 flex-shrink-0 relative ${
              index === activeTabIndex
                ? 'bg-white shadow-brease-xs text-brease-gray-10'
                : 'text-brease-gray-7 hover:text-brease-gray-9 hover:bg-brease-gray-2'
            }`}
            onClick={() => handleTabClick(index)}
          >
            <span className="text-t-xs font-golos-medium truncate">{getTabName(tab)}</span>

            {environmentTabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeTab(index)
                }}
                className="p-0.5 rounded hover:bg-brease-gray-3 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addTab}
        className="flex items-center justify-center p-1.5 rounded-md hover:bg-brease-gray-3 transition-colors ml-2"
        title="Add new tab"
      >
        <Plus className="w-4 h-4 text-brease-gray-7" />
      </button>
    </div>
  )
}

export default AssistantTabs
