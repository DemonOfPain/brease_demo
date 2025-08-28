'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Users, FileText, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { mockData } from '@/lib/mockData'

export default function SiteDashboard() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.site as string
  const [site, setSite] = useState<any>(null)
  const [pages, setPages] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])

  useEffect(() => {
    // Load site data from mock store
    const siteData = mockData.getSite(siteId)
    if (siteData) {
      setSite(siteData)
      setPages(mockData.getPages(siteId))
      setTeamMembers(mockData.getTeamMembers())
    }
  }, [siteId])

  if (!site) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/sites')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{site.name}</h1>
              <p className="text-sm text-gray-600">{site.domain}</p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${
              site.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {site.status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              Preview
            </button>
            <button 
              onClick={() => router.push(`/dashboard/sites/${siteId}/pages`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Edit Pages
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold">{pages.length}</span>
            </div>
            <p className="text-gray-600">Pages</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold">{teamMembers.length}</span>
            </div>
            <p className="text-gray-600">Team Members</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-gray-600">Collections</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Settings className="w-8 h-8 text-gray-600" />
              <span className="text-sm text-gray-500">Last update</span>
            </div>
            <p className="text-gray-900 font-medium">Just now</p>
          </div>
        </div>

        {/* Demo Content Area */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recent Pages</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pages.map((page) => (
                <div 
                  key={page.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => router.push(`/dashboard/sites/${siteId}/pages/${page.id}`)}
                >
                  <div>
                    <h3 className="font-medium">{page.name}</h3>
                    <p className="text-sm text-gray-600">
                      {page.sections?.length || 0} sections • {page.metaDescription || 'No description'}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">Updated {page.lastUpdated}</span>
                </div>
              ))}
              {teamMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Team Members Collection</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="text-sm text-gray-600">
                        • {member.name} - {member.role}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}