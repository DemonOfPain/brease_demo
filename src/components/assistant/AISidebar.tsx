'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Minimize2, Maximize2, Bot } from 'lucide-react'
import { DemoChat } from '../demo/DemoChat'

export function AISidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Persist state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('ai-sidebar-state')
    if (savedState) {
      const { isOpen, isMinimized } = JSON.parse(savedState)
      setIsOpen(isOpen)
      setIsMinimized(isMinimized)
    }
    setIsMounted(true) // Mount chat once on initial load
  }, [])

  useEffect(() => {
    localStorage.setItem('ai-sidebar-state', JSON.stringify({ isOpen, isMinimized }))
  }, [isOpen, isMinimized])

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all group"
        title="Open AI Assistant (Ctrl+K)"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant (Ctrl+K)
        </div>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar - Always in DOM but translated when closed */}
      <div className={`
        fixed right-0 top-0 h-full z-[9998] 
        transition-all duration-300 ease-in-out
        ${isMinimized ? 'w-[60px]' : 'w-[420px]'}
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
            {!isMinimized && (
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">AI Assistant</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">V1 Demo</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title={isMinimized ? "Expand" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition"
                title="Close (Ctrl+K)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Container - Always rendered but hidden when minimized */}
          <div className={`flex-1 overflow-hidden ${isMinimized ? 'hidden' : ''}`}>
            {isMounted && <DemoChat />}
          </div>

          {/* Minimized State */}
          {isMinimized && (
            <div className="flex-1 flex flex-col items-center justify-center p-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="p-3 hover:bg-gray-100 rounded-lg transition"
              >
                <MessageSquare className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}