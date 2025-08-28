'use client'

import { useState, useEffect } from 'react'
import { FileEdit, ArrowRight, CheckCircle } from 'lucide-react'

interface DemoPageRenameProps {
  onRename: (changes: any) => void
}

export function DemoPageRename({ onRename }: DemoPageRenameProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState('Get in Touch')

  // Auto-populate the rename after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRenaming(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRename = () => {
    onRename({
      action: 'rename',
      pageId: 'page-004',
      oldName: 'Contact',
      newName: 'Get in Touch',
      oldSlug: 'contact',
      newSlug: 'get-in-touch',
      description: 'Renaming "Contact" page to "Get in Touch" and updating the URL slug'
    })
  }

  return (
    <div className="bg-white border rounded-lg p-4 mt-2 w-full">
      <div className="flex items-center gap-2 mb-3">
        <FileEdit className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium">Page Rename</h3>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p className="mb-3">I found the "Contact" page. Let me rename it for you:</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Current name</p>
              <div className="px-3 py-2 bg-white border rounded-md text-sm font-medium">
                Contact
              </div>
              <p className="text-xs text-gray-500 mt-1">URL: /contact</p>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400" />
            
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">New name</p>
              <div className={`px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                isRenaming 
                  ? 'bg-blue-50 border-blue-300 text-blue-900' 
                  : 'bg-white'
              }`}>
                {isRenaming ? newName : '...'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                URL: {isRenaming ? '/get-in-touch' : '...'}
              </p>
            </div>
          </div>
        </div>

        {isRenaming && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-900 font-medium mb-1">What will be updated:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Page title in CMS</li>
                <li>✓ URL slug (with automatic redirect from old URL)</li>
                <li>✓ Navigation menu text</li>
                <li>✓ Any internal links pointing to this page</li>
              </ul>
            </div>

            <button
              onClick={handleRename}
              className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              <CheckCircle className="w-5 h-5" />
              Apply Page Rename
            </button>
          </div>
        )}
      </div>
    </div>
  )
}