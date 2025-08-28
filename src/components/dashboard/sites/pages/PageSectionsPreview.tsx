'use client'

import { Text } from '@/components/generic/Text'
import { Globe, FileText, Users, Mail, Layout } from 'lucide-react'
import { mockData } from '@/lib/mockData'

interface Props {
  pageId: string
}

export function PageSectionsPreview({ pageId }: Props) {
  const page = mockData.getPage(pageId)
  
  if (!page?.sections || page.sections.length === 0) {
    return null
  }

  const getIconForSection = (type: string) => {
    switch(type) {
      case 'hero': return <Globe className="w-4 h-4" />
      case 'text': return <FileText className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      case 'contact': return <Mail className="w-4 h-4" />
      default: return <Layout className="w-4 h-4" />
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
    <div className="w-full flex flex-col border-t border-brease-gray-4 pt-6">
      <div className="px-6 pb-4">
        <Text size="lg" style="semibold" className="mb-2">
          Page Sections
        </Text>
        <Text size="sm" style="regular" className="text-brease-gray-6">
          Content blocks created from the uploaded document
        </Text>
      </div>
      
      <div className="px-6 space-y-2">
        {page.sections.map((section: any, index: number) => (
          <div 
            key={section.id} 
            className="flex items-center justify-between p-3 bg-brease-gray-2 rounded-lg border border-brease-gray-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brease-secondary-light-green rounded flex items-center justify-center text-sm font-golos-medium">
                {index + 1}
              </div>
              <div className="flex items-center gap-2 text-brease-gray-10">
                {getIconForSection(section.type)}
                <Text size="sm" style="medium">
                  {getSectionTypeLabel(section.type)}
                </Text>
              </div>
              <Text size="sm" style="regular" className="text-brease-gray-6">
                {section.title}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-golos-medium">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Text size="sm" style="medium" className="text-blue-900 mb-1">
          💡 AI-Generated Content
        </Text>
        <Text size="xs" style="regular" className="text-blue-700">
          These sections were automatically created from your uploaded document. 
          Each section contains structured content that can be edited in the Page Builder.
        </Text>
      </div>
    </div>
  )
}