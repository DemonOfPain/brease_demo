'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { DemoSearchResults } from './DemoSearchResults'
import { DemoDocumentUpload } from './DemoDocumentUpload'
import { DemoPreviewModalPortal } from './DemoPreviewModalPortal'
import { DemoPageRename } from './DemoPageRename'
import { DemoSeoEditor } from './DemoSeoEditor'
import { DemoScriptEmbed } from './DemoScriptEmbed'
import { getDemoResponse, DemoTrigger } from './demoResponses'
import { mockData } from '@/lib/mockData'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  component?: React.ReactNode
}

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m the Brease AI Assistant. I can help you update content, process documents, and all changes are previewed before applying. What would you like to do?'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateTyping = async (response: any, trigger: DemoTrigger) => {
    setIsTyping(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsTyping(false)
    
    const newMessage: Message = {
      role: 'assistant',
      content: response.message
    }

    // Add component based on trigger
    if (trigger === 'semantic_search') {
      newMessage.component = (
        <DemoSearchResults 
          onSelect={(item) => handleSearchSelect(item)}
        />
      )
    } else if (trigger === 'document_upload') {
      newMessage.component = (
        <DemoDocumentUpload 
          onComplete={() => handleDocumentComplete()}
        />
      )
    } else if (trigger === 'page_rename') {
      newMessage.component = (
        <DemoPageRename 
          onRename={(changes) => handlePageRename(changes)}
        />
      )
    } else if (trigger === 'seo_update') {
      newMessage.component = (
        <DemoSeoEditor 
          onUpdate={(changes) => handleSeoUpdate(changes)}
        />
      )
    } else if (trigger === 'script_embed') {
      newMessage.component = (
        <DemoScriptEmbed 
          onEmbed={(script) => handleScriptEmbed(script)}
        />
      )
    } else if (trigger === 'remove_content') {
      // For remove content, show search results for confirmation
      const results = mockData.searchContent('john doe')
      newMessage.component = (
        <DemoSearchResults 
          onSelect={(item) => handleRemoveContent(item)}
          actionLabel="Remove"
        />
      )
    }

    setMessages(prev => [...prev, newMessage])

    // Store pending changes for preview
    if (response.changes) {
      setPendingChanges(response.changes)
    }
  }

  const handleSearchSelect = (item: any) => {
    console.log('Selected item:', item)
    
    // Get current bio if it's a team member
    let currentBio = item.preview || 'Software Developer with 5 years of experience'
    if (item.type === 'team_member') {
      const member = mockData.getTeamMember(item.id)
      if (member) {
        currentBio = member.bio
      }
    }
    
    const newBio = 'Senior Software Developer with 10+ years of experience in building scalable web applications and leading development teams.'
    
    // Set pending changes
    const changes = {
      type: 'content_update',
      target: item.path,
      field: 'bio',
      oldValue: currentBio,
      newValue: newBio,
      confidence: item.confidence,
      applyChanges: () => {
        console.log('Applying change to:', item.id, 'with new bio:', newBio)
        // Actually update the data in mock store
        if (item.type === 'team_member') {
          const result = mockData.updateTeamMember(item.id, {
            bio: newBio
          })
          console.log('Update result:', result)
        }
      }
    }
    setPendingChanges(changes)
    
    // Add message about what's happening
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `I'll update the bio field in ${item.path}. Opening preview for your approval...`
    }])
    
    // Automatically show preview after a short delay
    setTimeout(() => {
      setShowPreview(true)
    }, 1000)
  }

  const handleDocumentComplete = () => {
    // Set pending changes for document
    const changes = {
      type: 'page_creation',
      pageName: 'Company Profile',
      sections: [
        { type: 'hero', title: 'Welcome to Our Company' },
        { type: 'text', title: 'About Us' },
        { type: 'text', title: 'Our Services' },
        { type: 'team', title: 'Meet the Team' },
        { type: 'contact', title: 'Get in Touch' }
      ],
      description: 'Creating a new page "Company Profile" with 5 sections from your uploaded document',
      applyChanges: () => {
        // Actually create the page in mock store
        mockData.createPage({
          name: 'Company Profile',
          slug: 'company-profile',
          path: '/company-profile',
          title: 'Company Profile',
          sections: [
            { id: 'section-new-1', type: 'hero', title: 'Welcome to Our Company' },
            { id: 'section-new-2', type: 'text', title: 'About Us' },
            { id: 'section-new-3', type: 'text', title: 'Our Services' },
            { id: 'section-new-4', type: 'team', title: 'Meet the Team' },
            { id: 'section-new-5', type: 'contact', title: 'Get in Touch' }
          ],
          siteId: 'site-001' // Add to current site
        })
      }
    }
    setPendingChanges(changes)
    
    // Don't add a message here - the DemoDocumentUpload component already shows the success message
    // Just open the preview after a delay
    setTimeout(() => {
      setShowPreview(true)
    }, 1500) // Slightly longer delay to let user see the upload complete UI
  }

  const handlePageRename = (changes: any) => {
    setPendingChanges({
      type: 'page_rename',
      ...changes,
      applyChanges: () => {
        // Apply page rename
        const page = mockData.getPage(changes.pageId)
        if (page) {
          mockData.updatePage(changes.pageId, {
            name: changes.newName,
            slug: changes.newSlug
          })
        }
      }
    })
    setTimeout(() => setShowPreview(true), 1000)
  }

  const handleSeoUpdate = (changes: any) => {
    setPendingChanges({
      type: 'seo_update',
      ...changes,
      applyChanges: () => {
        // Apply SEO changes to page
        mockData.updatePage(changes.pageId, {
          title: changes.title,
          metaDescription: changes.metaDescription,
          keywords: changes.keywords
        })
      }
    })
    setTimeout(() => setShowPreview(true), 1000)
  }

  const handleScriptEmbed = (script: any) => {
    setPendingChanges({
      type: 'script_embed',
      ...script,
      applyChanges: () => {
        // Add script to site
        mockData.addScript('site-001', script)
      }
    })
    setTimeout(() => setShowPreview(true), 1000)
  }

  const handleRemoveContent = (item: any) => {
    setPendingChanges({
      type: 'content_removal',
      target: item,
      applyChanges: () => {
        // Remove the content
        if (item.type === 'team_member') {
          mockData.removeTeamMember(item.id)
        }
      }
    })
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `I'll remove ${item.title} from your site. Opening preview for your approval...`
    }])
    setTimeout(() => setShowPreview(true), 1000)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    
    const response = getDemoResponse(input.toLowerCase())
    
    if (response) {
      await simulateTyping(response, response.trigger)
    } else {
      // Default response for unrecognized input
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I understand you want to: "' + input + '". I can help with updating content, uploading documents, and more. All changes are previewed before applying. Try one of the example commands!'
      }])
    }

    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleApprove = () => {
    // Apply the actual changes
    console.log('Approving changes:', pendingChanges)
    if (pendingChanges?.applyChanges) {
      console.log('Calling applyChanges function')
      pendingChanges.applyChanges()
    } else {
      console.log('No applyChanges function found!')
    }
    
    setShowPreview(false)
    setPendingChanges(null)
    setMessages(prev => [...prev, {
      role: 'system',
      content: '✅ Changes applied successfully! The content has been updated.'
    }])
    
    // Force a page refresh for team member changes
    if (pendingChanges?.type === 'content_removal' || pendingChanges?.type === 'content_update') {
      // Trigger refresh event
      setTimeout(() => {
        window.dispatchEvent(new Event('demo-data-updated'))
      }, 100)
    }
  }

  const handleReject = (showMessage = true) => {
    setShowPreview(false)
    setPendingChanges(null)
    if (showMessage) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: '❌ Changes cancelled. No modifications were made.'
      }])
    }
  }

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.role !== 'system' && (
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-600 ml-2' : 'bg-purple-600 mr-2'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                )}
                <div className="min-w-0 max-w-full">
                  <div className={`px-4 py-2 rounded-lg break-words ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.role === 'system'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.content}
                  </div>
                  {message.component && (
                    <div className="mt-2 w-full overflow-x-auto overflow-y-hidden">
                      {message.component}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a command or question..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={showPreview} // Disable input when preview is open
            />
            <button
              onClick={handleSend}
              disabled={showPreview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal - Auto opens after selection */}
      {showPreview && pendingChanges && (
        <DemoPreviewModalPortal
          changes={pendingChanges}
          onClose={() => handleReject(false)} // Don't show cancel message on auto-close
          onApprove={handleApprove}
        />
      )}
    </>
  )
}