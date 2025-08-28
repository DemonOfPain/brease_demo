'use client'
import React, { useState } from 'react'
import { TooltipProvider } from '@/components/shadcn/ui/tooltip'
import { EditorSidebarButton } from './EditorSidebarButton'
import { EditorItemsList } from './EditorItemList'
import { Collection, EditorItem, Section } from '@/interface/editor'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { useStore } from 'zustand'

interface SectionListInterface {
  sections: Section[] | EditorItem[]
  activeSection: Section
  // eslint-disable-next-line no-unused-vars
  setActiveSection: (section: Section) => void
}

export interface CollectionListInterface {
  collections: Collection[] | EditorItem[]
  activeCollection: Collection
  // eslint-disable-next-line no-unused-vars
  setActiveCollection: (collection: Collection) => void
}

type SectionSidebarProps = {
  sectionProps: SectionListInterface
  collectionProps?: CollectionListInterface
}

type CollectionSidebarProps = {
  collectionProps: CollectionListInterface
  sectionProps?: SectionListInterface
}

type EditorSidebarProps = SectionSidebarProps | CollectionSidebarProps

export const EditorSidebar = ({ sectionProps, collectionProps }: EditorSidebarProps) => {
  const editorStore = useStore(useEditorStore)
  const activeMenu = useEditorStore((state) => state.editorType)

  const [hidden, setHidden] = useState<boolean>(false)

  return (
    <div
      className={`${
        hidden ? 'min-w-[57px] w-[57px] border-0' : 'min-w-[500px] w-[500px]'
      } h-full flex flex-row shadow-brease-xs bg-brease-gray-1 border-r border-brease-gray-5 transition-all ease-in-out duration-300 overflow-hidden`}
    >
      <div
        className={`border-r w-fit min-w-[57px] h-full pt-2 border-brease-gray-5 flex flex-col justify-start items-center`}
      >
        <TooltipProvider>
          <div className="flex flex-col gap-[12px] items-center pb-[6px] border-b border-brease-gray-5">
            <EditorSidebarButton
              buttonVariant={'textType'}
              buttonIcon={'Rows3'}
              toolTipText={'Sections'}
              className={`${activeMenu === 'sections' && '!bg-brease-success-light !stroke-brease-success'} hover:!stroke-brease-success`}
              onClick={() => {
                editorStore.setEditorType('sections')
                if (hidden) setHidden(false)
              }}
            />
            <EditorSidebarButton
              buttonVariant={'textType'}
              buttonIcon={'Layers'}
              toolTipText={'Collections'}
              className={`${activeMenu === 'collections' && '!bg-brease-secondary-light-blue !stroke-brease-secondary-blue'} hover:!stroke-brease-secondary-blue`}
              onClick={() => {
                editorStore.setEditorType('collections')
                if (hidden) setHidden(false)
              }}
            />
          </div>
          <div className="flex flex-col gap-[12px] items-center pt-[6px]">
            <EditorSidebarButton
              buttonVariant={'textType'}
              buttonIcon={hidden ? 'PanelRightClose' : 'PanelLeftClose'}
              toolTipText={hidden ? 'Show List' : 'Hide List'}
              onClick={() => setHidden(!hidden)}
            />
          </div>
        </TooltipProvider>
      </div>
      {!hidden &&
        (activeMenu === 'sections' ? (
          <EditorItemsList
            activeItem={sectionProps!.activeSection}
            setActiveItem={sectionProps!.setActiveSection}
            items={sectionProps!.sections}
          />
        ) : (
          <EditorItemsList
            activeItem={collectionProps!.activeCollection}
            setActiveItem={collectionProps!.setActiveCollection}
            items={collectionProps!.collections}
          />
        ))}
    </div>
  )
}
