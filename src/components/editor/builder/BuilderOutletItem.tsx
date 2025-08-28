import { PageContentSection } from '@/interface/builder'
import React, { useState } from 'react'
import { ImageOff } from 'lucide-react'
import Button from '@/components/generic/Button'
import { Text } from '@/components/generic/Text'
import { useStore } from 'zustand'
import { useBuilderStore } from '@/lib/hooks/useBuilderStore'

export const BuilderOutletItem = ({ section }: { section: PageContentSection }) => {
  const builderStore = useStore(useBuilderStore)
  const [collapsed, setCollapsed] = useState<boolean>(false)

  return (
    <div
      className={`group/row relative z-10 flex flex-col w-full rounded-lg bg-brease-gray-2 border-brease-gray-5 border shadow-brease-xs`}
    >
      <div className="w-full flex flex-row items-center justify-between px-4 py-2 border-b border-brease-gray-5">
        <div className="flex flex-row gap-4 w-fit">
          <Text size="md" style="medium">
            {section.section.name}
          </Text>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="black"
            size="sm"
            icon="Pencil"
            label="Edit"
            className="!py-1 !px-3 !rounded-full"
            onClick={() => {
              builderStore.setActiveContent(section)
              builderStore.setContentEditorOpen(true)
            }}
          />
          <Button
            variant="secondary"
            icon={collapsed ? 'ChevronDown' : 'ChevronUp'}
            className="!rounded-full !p-[10px]"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out flex flex-col gap-2 bg-brease-gray-1 ${
          collapsed
            ? 'max-h-0 opacity-0 overflow-hidden'
            : 'max-h-[2000px] opacity-100 p-4 rounded-b-lg'
        }`}
      >
        <div className="flex items-center justify-center w-full h-[200px] bg-brease-gray-2 rounded-md">
          <ImageOff className="w-16 h-16 stroke-brease-gray-5" />
        </div>
      </div>
    </div>
  )
}
