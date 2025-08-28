'use client'
import { useState } from 'react'
import { mockData } from '@/lib/mockData'

// Simplified version of PageDetailsForm for demo pages
export function DemoPageDetailsWrapper({ page }: { page: any }) {
  const [loading, setLoading] = useState(false)
  
  // Just show the basic page info and sections
  return (
    <div className="w-full pb-4">
      <div className="w-full flex flex-col gap-4">
        {/* Page Info */}
        <div className="w-full flex flex-col bg-white rounded-lg border border-brease-gray-4 p-6">
          <h2 className="text-xl font-golos-semibold mb-4">Page Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-golos-medium text-gray-700 mb-1">Page Name</label>
              <input
                type="text"
                value={page.name}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-golos-medium text-gray-700 mb-1">URL Slug</label>
              <input
                type="text"
                value={page.slug}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            
            {page.metaDescription && (
              <div>
                <label className="block text-sm font-golos-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  value={page.metaDescription}
                  disabled
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sections Preview */}
        {page.uuid && page.uuid.startsWith('page-') && (
          <DemoPageSections pageId={page.uuid} />
        )}
      </div>
    </div>
  )
}

function DemoPageSections({ pageId }: { pageId: string }) {
  const page = mockData.getPage(pageId)
  
  if (!page?.sections || page.sections.length === 0) {
    return null
  }

  const getIconForSection = (type: string) => {
    switch(type) {
      case 'hero': return '🌐'
      case 'text': return '📝'
      case 'team': return '👥'
      case 'contact': return '📧'
      default: return '📄'
    }
  }

  const getSectionTypeLabel = (type: string) => {
    switch(type) {
      case 'hero': return 'Hero Section'
      case 'text': return 'Text Block'
      case 'team': return 'Team Section'
      case 'contact': return 'Contact Form'
      default: return type.charAt(0).toUpperCase() + type.slice(1) + ' Section'
    }
  }

  return (
    <div className="w-full flex flex-col bg-white rounded-lg border border-brease-gray-4 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-golos-semibold mb-2">Page Sections</h3>
        <p className="text-sm text-gray-600">Content blocks created from the uploaded document</p>
      </div>
      
      <div className="space-y-2">
        {page.sections.map((section: any, index: number) => (
          <div 
            key={section.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-golos-medium">
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                <span>{getIconForSection(section.type)}</span>
                <span className="font-golos-medium text-sm">{getSectionTypeLabel(section.type)}</span>
              </div>
              <span className="text-sm text-gray-600">{section.title}</span>
            </div>
            <div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-golos-medium">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-golos-medium text-blue-900 mb-1">💡 AI-Generated Content</p>
        <p className="text-xs text-blue-700">
          These sections were automatically created from your uploaded document. 
          Each section contains structured content that can be edited in the Page Builder.
        </p>
      </div>
    </div>
  )
}