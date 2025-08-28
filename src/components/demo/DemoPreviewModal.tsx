'use client'

import { useState } from 'react'
import { X, Check, AlertCircle, ExternalLink } from 'lucide-react'

interface Props {
  changes: any
  onClose: () => void
  onApprove: () => void
}

export function DemoPreviewModal({ changes, onClose, onApprove }: Props) {
  const [hasApproved, setHasApproved] = useState(false)
  const isContentUpdate = changes.type === 'content_update'
  const isPageCreation = changes.type === 'page_creation'
  const isPageRename = changes.type === 'page_rename'
  const isSeoUpdate = changes.type === 'seo_update'
  const isScriptEmbed = changes.type === 'script_embed'
  const isContentRemoval = changes.type === 'content_removal'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Preview Changes</h2>
            <p className="text-blue-100 mt-1">Review before applying to production</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isContentUpdate && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Content Update</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Updating: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.target}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">95%</div>
                  <div className="text-xs text-gray-500">confidence</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Version</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="font-semibold">John Doe</div>
                      <div className="text-sm text-gray-600">
                        {changes.oldValue || 'Software Developer with 5 years of experience in React, Node.js, and cloud technologies.'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">After Changes</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="font-semibold">John Doe</div>
                      <div className="text-sm text-gray-600">
                        <span className="bg-green-200 px-1">
                          {changes.newValue || 'Senior Software Developer with 10 years of experience in React, Node.js, and cloud technologies.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What will happen:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Bio field will be updated in Team Members collection</li>
                  <li>• Change will be live immediately after approval</li>
                  <li>• Previous version will be saved in history</li>
                  <li>• Can be rolled back if needed</li>
                </ul>
              </div>
            </div>
          )}

          {isPageCreation && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">New Page Creation</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Creating one new page: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.pageName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This page will be added to your current site
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Page Sections (content blocks within this page):</h4>
                <div className="space-y-2">
                  {changes.sections?.map((section: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-gray-500">Section type: {section.type}</div>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What will happen:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• ONE new page will be created in your current site</li>
                  <li>• The page will appear in your Pages list immediately</li>
                  <li>• This page will contain 5 editable sections</li>
                  <li>• Content from your document will populate each section</li>
                  <li>• The page will be accessible at /company-profile</li>
                  <li>• You can view/edit it in the Page Builder after creation</li>
                </ul>
              </div>

              {hasApproved && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Page Created Successfully!
                  </h4>
                  <p className="text-sm text-green-800 mb-3">
                    The Company Profile page is now live. You'll see it in the Pages list.
                  </p>
                  <div className="flex gap-2">
                    <a 
                      href="/dashboard/sites/site-001/pages"
                      className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium inline-flex items-center justify-center gap-2"
                    >
                      View in Pages List
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {isPageRename && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Page Rename</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Renaming page from <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.oldName}</span> to <span className="font-mono bg-blue-100 px-2 py-1 rounded text-blue-900">{changes.newName}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">URL Change:</h4>
                  <div className="text-sm">
                    <span className="text-gray-500">Old:</span> <span className="font-mono">/{changes.oldSlug}</span><br/>
                    <span className="text-gray-500">New:</span> <span className="font-mono text-blue-600">/{changes.newSlug}</span>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What will be updated:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• Page title in CMS and navigation</li>
                    <li>• URL slug (automatic redirect from old URL)</li>
                    <li>• All internal links to this page</li>
                    <li>• Search index and sitemap</li>
                  </ul>
                </div>
              </div>

              {hasApproved && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Page Renamed Successfully!
                  </h4>
                  <p className="text-sm text-green-800">
                    The page has been renamed and the URL updated. Redirects are in place.
                  </p>
                </div>
              )}
            </div>
          )}

          {isSeoUpdate && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">SEO Update</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Updating SEO for: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.pageName}</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-2">
                    <div><strong>Title:</strong> {changes.oldTitle}</div>
                    <div><strong>Description:</strong> {changes.oldDescription}</div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">New</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                    <div><strong>Title:</strong> {changes.title}</div>
                    <div><strong>Description:</strong> {changes.metaDescription}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isScriptEmbed && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-indigo-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Script Embedding</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Adding: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.name}</span>
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-900 mb-2">What will happen:</h4>
                <ul className="space-y-1 text-sm text-indigo-800">
                  <li>• Script will be added to {changes.location} section</li>
                  <li>• Will be active on all pages</li>
                  <li>• Tracking will begin immediately</li>
                </ul>
              </div>
            </div>
          )}

          {isContentRemoval && (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Team Member Removal</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Removing: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{changes.target?.title || 'John Doe'}</span>
                  </p>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">What will happen:</h4>
                <ul className="space-y-1 text-sm text-red-800">
                  <li>• Team member will be removed immediately</li>
                  <li>• The Teams page will update automatically</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
              
              {hasApproved && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Team Member Removed!
                  </h4>
                  <p className="text-sm text-green-800">
                    The team member has been removed. The Teams page will refresh automatically.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setHasApproved(true)
              onApprove()
              if (isPageCreation || isContentRemoval) {
                // Keep modal open briefly to show success message
                setTimeout(() => onClose(), 3000)
              }
            }}
            className="px-6 py-2 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition flex items-center space-x-2 font-medium"
            disabled={hasApproved}
          >
            <Check className="w-5 h-5" />
            <span>{hasApproved ? 'Applied!' : 'Approve & Apply'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}