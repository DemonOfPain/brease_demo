'use client'

import { AISidebar } from '@/components/assistant/AISidebar'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">AI Assistant Demo Test Page</h1>
        <p className="text-gray-600 mb-8">
          Click the bot button in the bottom-right corner or press Ctrl+K to open the AI assistant.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Try These Commands:</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blue-600 font-mono text-sm bg-blue-50 px-2 py-1 rounded">
                change john doe bio
              </span>
              <span className="ml-3 text-gray-600">- Updates content with preview</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-mono text-sm bg-blue-50 px-2 py-1 rounded">
                upload document
              </span>
              <span className="ml-3 text-gray-600">- Simulates document processing</span>
            </li>
          </ul>
        </div>
      </div>
      
      <AISidebar />
    </div>
  )
}