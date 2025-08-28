'use client'

import { Search, FileText, Users, Globe, Trash2, Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { mockData } from '@/lib/mockData'

interface SearchResult {
  id: string
  title?: string
  path: string
  type: string
  confidence: number
  icon?: React.ReactNode
  preview: string
}

interface Props {
  onSelect: (result: SearchResult) => void
  actionLabel?: string
}

export function DemoSearchResults({ onSelect, actionLabel = 'Select' }: Props) {
  const [results, setResults] = useState<SearchResult[]>([])
  
  useEffect(() => {
    // Get actual search results from mock data
    const searchResults = mockData.searchContent('john')
    const formattedResults = searchResults.map(r => ({
      ...r,
      icon: r.type === 'team_member' ? <Users className="w-4 h-4" /> : 
            r.type === 'page' ? <FileText className="w-4 h-4" /> :
            <Globe className="w-4 h-4" />
    }))
    setResults(formattedResults)
  }, [])
  
  // If no results from actual data, show placeholder
  if (results.length === 0) {
    const mockResults: SearchResult[] = [
      {
        id: 'member-001',
        title: 'John Doe',
        path: 'Team Members > John Doe',
        type: 'team_member',
        confidence: 0.95,
        icon: <Users className="w-4 h-4" />,
        preview: 'Software Developer with 5 years of experience'
      }
    ]
    setResults(mockResults)
  }
  
  const isRemoveAction = actionLabel === 'Remove'
  const ActionIcon = isRemoveAction ? Trash2 : Edit
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2 w-full">
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
        <Search className="w-4 h-4 flex-shrink-0" />
        <span className="break-words">
          {isRemoveAction 
            ? 'Select content to remove:' 
            : 'Semantic search results (sorted by relevance):'}
        </span>
      </div>
      
      {results.map((result) => (
        <button
          key={result.id}
          onClick={() => onSelect(result)}
          className={`w-full text-left p-3 rounded-lg border transition group overflow-hidden ${
            isRemoveAction 
              ? 'border-gray-200 hover:border-red-500 hover:bg-red-50'
              : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 flex-shrink-0">{result.icon}</span>
                <span className={`font-medium truncate ${
                  isRemoveAction
                    ? 'text-gray-900 group-hover:text-red-600'
                    : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  {result.title || result.path}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {result.preview}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  result.confidence >= 0.9 ? 'text-green-600' :
                  result.confidence >= 0.7 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {Math.round(result.confidence * 100)}%
                </div>
                <div className="text-xs text-gray-500">match</div>
              </div>
              <ActionIcon className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition ${
                isRemoveAction ? 'text-red-600' : 'text-blue-600'
              }`} />
            </div>
          </div>
        </button>
      ))}
      
      {!isRemoveAction && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Smart Search:</strong> Found variations of "John Doe" across different content types. 
            No exact match needed - AI understands context and relationships.
          </p>
        </div>
      )}
    </div>
  )
}