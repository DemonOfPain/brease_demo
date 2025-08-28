'use client'

import { useState, useEffect } from 'react'
import { Menu, Plus, Trash2, Edit2, CheckCircle } from 'lucide-react'

interface DemoNavigationEditorProps {
  onUpdate: (changes: any) => void
}

export function DemoNavigationEditor({ onUpdate }: DemoNavigationEditorProps) {
  const [selectedAction, setSelectedAction] = useState<'add' | 'remove' | 'reorder'>('add')
  const [hasClicked, setHasClicked] = useState(false)

  const handleAddItem = () => {
    onUpdate({
      action: 'add',
      item: {
        label: 'Services',
        path: '/services',
        order: 3
      },
      description: 'Adding "Services" to the main navigation menu'
    })
  }

  const handleRemoveItem = () => {
    onUpdate({
      action: 'remove',
      itemId: 'nav-004', // Services
      itemLabel: 'Services',
      description: 'Removing "Services" from the navigation menu'
    })
  }

  const handleReorderItems = () => {
    onUpdate({
      action: 'update',
      itemId: 'nav-007',
      updates: { order: 2 },
      description: 'Moving "Contact" to position 2 in the menu'
    })
  }

  return (
    <div className="bg-white border rounded-lg p-4 mt-2 max-w-full">
      <div className="flex items-center gap-2 mb-3">
        <Menu className="w-5 h-5 text-blue-600" />
        <h3 className="font-medium">Navigation Editor</h3>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          <p className="mb-2">Current navigation menu:</p>
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">🏠 Home</span>
            <span className="px-2 py-1 bg-gray-100 rounded text-xs">📧 Contact</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">+ Services (new)</span>
          </div>
          <p>I'll add a Services page between Home and Contact. This page will showcase your company's offerings.</p>
        </div>

        {hasClicked && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Services page ready to add!</p>
              <p className="text-sm text-green-700">The navigation will be updated</p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            if (!hasClicked) {
              setHasClicked(true)
              handleAddItem()
            }
          }}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition ${
            hasClicked 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {hasClicked ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Apply Navigation Update
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Services to Navigation
            </>
          )}
        </button>

        <div className="hidden flex-col gap-2">
          <button
            onClick={() => {
              setSelectedAction('add')
              handleAddItem()
            }}
            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Plus className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-medium">Add &quot;Services&quot; to menu</p>
              <p className="text-sm text-gray-600">Add Services page to the main navigation</p>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction('remove')
              handleRemoveItem()
            }}
            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
            <div>
              <p className="font-medium">Remove &quot;Services&quot;</p>
              <p className="text-sm text-gray-600">Remove the Services menu item</p>
            </div>
          </button>

          <button
            onClick={() => {
              setSelectedAction('reorder')
              handleReorderItems()
            }}
            className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 text-left"
          >
            <Edit2 className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-medium">Reorder menu items</p>
              <p className="text-sm text-gray-600">Move Contact to position 2</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}