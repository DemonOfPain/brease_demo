'use client'
import React, { useState } from 'react'
import { Text } from '@/components/generic/Text'
import { Input } from '../shadcn/ui/input'
import { EditorItem } from '@/interface/editor'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { EditorItemListCard } from './EditorItemListCard'
import { EditorSidebarButton } from './EditorSidebarButton'
import { CollectionDetailsDialog, SectionDetailsDialog } from './EditorDetailsDialog'
import { TooltipProvider } from '../shadcn/ui/tooltip'

export interface EditorItemsListInterface {
  items: EditorItem[]
  activeItem: EditorItem | null
  // eslint-disable-next-line no-unused-vars
  setActiveItem: (item: EditorItem | any) => void
}

export const EditorItemsList = ({ items, activeItem, setActiveItem }: EditorItemsListInterface) => {
  const itemType = useEditorStore((state) => state.editorType)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const filteredItems = items.filter((item: EditorItem) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full h-full pb-0 p-4 flex flex-col gap-5">
      <div className="min-w-[389px] w-full flex flex-row items-center gap-4">
        <Text size="xl" style="semibold">
          {itemType === 'sections' ? 'Sections' : 'Collections'}
        </Text>
        <Input
          placeholder={`Search ${itemType}`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          className="!w-2/3 h-[36px] bg-brease-gray-2 border-transparent font-golos-medium"
        />
        <TooltipProvider>
          <EditorSidebarButton
            buttonVariant={'black'}
            buttonIcon={'Plus'}
            toolTipText={'Add New'}
            dialogContent={
              itemType === 'collections' ? <CollectionDetailsDialog /> : <SectionDetailsDialog />
            }
          />
        </TooltipProvider>
      </div>
      <div className="flex flex-col gap-5 h-full overflow-y-scroll no-scrollbar items-start">
        <div className="w-full flex flex-col gap-2 divide-y divide-brease-gray-5 pb-2">
          <Text size="sm" style="medium">
            My {itemType === 'sections' ? 'Sections' : 'Collections'}
          </Text>
          <div className="w-full flex flex-col gap-2 pt-2">
            {items.length > 0 ? (
              filteredItems.map((item: EditorItem) => (
                <EditorItemListCard
                  key={item.uuid}
                  item={item}
                  active={item.uuid === activeItem?.uuid}
                  onClick={() => setActiveItem(item)}
                />
              ))
            ) : (
              <div className="w-full flex justify-start items-center">
                <Text size="sm" style="regular" className="text-brease-gray-5">
                  No {itemType}s yet, add a new one!
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
