'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { mockData } from '@/lib/mockData'
import { Text } from '@/components/generic/Text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/ui/tabs'
import { Code, Globe, Lock, Zap } from 'lucide-react'

export default function SiteSettingsPage() {
  const params = useParams()
  const siteId = params.site as string
  const [site, setSite] = useState<any>(null)
  const [scripts, setScripts] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Load site and scripts from mock data
    const siteData = mockData.getSite(siteId)
    setSite(siteData)
    setScripts(siteData?.scripts || [])
  }, [siteId, refreshKey])

  if (!site) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-fit">
      <div className="mb-6">
        <Text size="xl" style="semibold">Site Settings</Text>
        <Text size="sm" style="regular" className="text-brease-gray-6 mt-1">
          Manage your site configuration and integrations
        </Text>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="scripts">
            <Code className="w-4 h-4 mr-2" />
            Scripts
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Site Name</label>
                <div className="mt-1 p-2 bg-gray-50 rounded">{site.name}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Domain</label>
                <div className="mt-1 p-2 bg-gray-50 rounded">{site.domain}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    site.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {site.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scripts" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Embedded Scripts</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Add Script
              </button>
            </div>
            
            {scripts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Code className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No scripts embedded yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add tracking codes, analytics, or custom scripts
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scripts.map((script, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{script.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{script.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        script.enabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {script.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Script Preview:</p>
                      <pre className="bg-gray-900 text-gray-300 p-2 rounded text-xs overflow-x-auto">
                        {script.code.substring(0, 150)}...
                      </pre>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Added: {script.addedDate || 'Just now'}
                      </p>
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Edit</button>
                        <button className="text-xs text-red-600 hover:underline">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <p className="text-gray-600">SSL certificates, access control, and security headers configuration.</p>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Settings</h3>
            <p className="text-gray-600">CDN configuration, caching rules, and optimization settings.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}