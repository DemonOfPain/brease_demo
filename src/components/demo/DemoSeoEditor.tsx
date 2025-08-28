'use client'

import { useState } from 'react'
import { Search, Hash, FileText } from 'lucide-react'

interface DemoSeoEditorProps {
  onUpdate: (changes: any) => void
}

export function DemoSeoEditor({ onUpdate }: DemoSeoEditorProps) {
  const [title, setTitle] = useState('Welcome to Our Company')
  const [description, setDescription] = useState('Leading provider of innovative solutions')
  const [keywords, setKeywords] = useState('innovation, technology, solutions')

  const handleUpdate = () => {
    onUpdate({
      pageId: 'page-001',
      pageName: 'Home',
      title: 'Your Trusted Technology Partner | Company Name',
      metaDescription: 'We deliver cutting-edge technology solutions that transform businesses. Expert consulting, development, and support services.',
      keywords: ['technology', 'consulting', 'software', 'development', 'innovation', 'digital transformation'],
      oldTitle: title,
      oldDescription: description
    })
  }

  return (
    <div className="bg-white border rounded-lg p-4 mt-2 max-w-full">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-5 h-5 text-purple-600" />
        <h3 className="font-medium">SEO Settings Editor</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          I've analyzed your home page and have some SEO improvements to suggest:
        </p>

        <div className="space-y-3">
          <div className="border-l-4 border-yellow-400 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium">Current Title:</p>
            </div>
            <p className="text-sm text-gray-600">{title}</p>
          </div>

          <div className="border-l-4 border-green-400 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium">Suggested Title:</p>
            </div>
            <p className="text-sm text-gray-900">Your Trusted Technology Partner | Company Name</p>
          </div>

          <div className="border-l-4 border-yellow-400 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium">Current Description:</p>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>

          <div className="border-l-4 border-green-400 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-medium">Suggested Description:</p>
            </div>
            <p className="text-sm text-gray-900">
              We deliver cutting-edge technology solutions that transform businesses. Expert consulting, development, and support services.
            </p>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Apply SEO Improvements
        </button>
      </div>
    </div>
  )
}