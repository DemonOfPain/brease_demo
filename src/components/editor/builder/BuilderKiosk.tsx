'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { Input } from '@/components/shadcn/ui/input'
import {
  EditorElementMatrixRow,
  EditorElementMatrixSlot,
  EditorItem,
  Section
} from '@/interface/editor'
import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import Button from '@/components/generic/Button'
import { compareBuilderSections } from '@/lib/helpers/compareBuilderSections'
import { createBuilderSectionsSync } from '@/lib/helpers/createBuilderSectionsSync'
import { useBuilderStore } from '@/lib/hooks/useBuilderStore'
import { useStore } from 'zustand'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { CircleAlert, EyeOff, GripVertical, Layers, Plus } from 'lucide-react'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import {
  PageContentMatrixRow,
  PageContentMatrixSlot,
  PageContentSection
} from '@/interface/builder'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { uniqueId } from 'lodash'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { Badge } from '@/components/shadcn/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { UserRole } from '@/interface/user'

export const BuilderKiosk = ({ recentlyMovedItem }: { recentlyMovedItem?: string | null }) => {
  const { pageContentClone, setPageContentClone } = useContext(BuilderDraftContext)
  const builderStore = useStore(useBuilderStore)
  const sections = useEditorStore((state) => state.sections)
  const pageContent = useBuilderStore((state) => state.pageContent)
  const selectedSections = useBuilderStore((state) => state.selectedSections)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filteredItems = sections!.filter(
    (item: EditorItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) && item.status != 'unpublished'
  )

  useEffect(() => {
    if (
      pageContent.uuid &&
      pageContentClone.uuid &&
      compareBuilderSections(pageContent.sections, pageContentClone.sections)
    ) {
      const sync = createBuilderSectionsSync(pageContentClone)
      builderStore.syncSections(sync)
    }
  }, [pageContentClone])

  return (
    <div
      className={`min-w-[455px] w-[455px] h-full bg-brease-gray-1 border-r relative z-50 overflow-hidden flex flex-row border-brease-gray-5`}
    >
      <div className={`py-4 w-full h-full flex flex-col gap-4 divide-y`}>
        <div className="flex flex-col gap-4 w-full">
          <Text size="xl" style="medium" className="!text-3xl -mb-1 px-4">
            Sections
          </Text>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger className="focus:outline-0 rounded-md p-2 mx-4 flex flex-row items-center justify-center gap-4 bg-brease-secondary-light-green">
              <div className="rounded-full p-1 border bg-brease-gray-1 border-brease-gray-5">
                <Plus className="w-4 h-4" />
              </div>
              <Text size="sm" style="medium">
                Add Sections
              </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              sideOffset={9}
              className="w-[calc(455px-32px)] max-h-[calc(100dvh-52px-16px-36px-42px-32px)] !overflow-y-auto !p-0 border-brease-gray-5"
            >
              <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                  placeholder={`Search sections`}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full h-[40px] shadow-none !border-x-0 !border-t-0 !border-b rounded-none font-golos-medium"
                />
              </div>
              <div className="w-full flex flex-col divide-y divide-brease-gray-5">
                {sections!.length > 0 ? (
                  filteredItems.length != 0 ? (
                    filteredItems.map((item: Section) => (
                      <SectionsDropdownItem key={item.uuid} section={item} />
                    ))
                  ) : (
                    <div className="w-full flex justify-center items-center py-2">
                      <Text size="sm" style="regular" className="text-brease-gray-5">
                        No results
                      </Text>
                    </div>
                  )
                ) : (
                  <div className="w-full flex justify-center items-center py-2">
                    <Text size="sm" style="regular" className="text-brease-gray-5">
                      No sections available!
                    </Text>
                  </div>
                )}
              </div>
              <div className="w-full flex items-center justify-between px-4 border-t py-2 border-brease-gray-5">
                <Button
                  size="sm"
                  variant="textType"
                  label="Cancel"
                  className="hover:!text-brease-gray-7"
                  onClick={() => {
                    setDropdownOpen(false)
                    builderStore.setSelectedSections([])
                  }}
                />
                <Button
                  size="sm"
                  variant="primary"
                  label="Add selected sections"
                  onClick={() => {
                    setDropdownOpen(false)
                    setPageContentClone((prev) => ({
                      ...prev,
                      sections: [...prev.sections, ...selectedSections]
                    }))
                    builderStore.setSelectedSections([])
                  }}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Droppable droppableId={pageContentClone.uuid}>
            {(provided, snapshot) => (
              <div
                className="relative w-full h-[calc(100vh-42px-36px-32px-16px-52px)] overflow-y-auto py-4 border-t border-brease-gray-5"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="w-full h-full flex flex-col">
                  {pageContentClone.sections.map((section: PageContentSection, idx: number) => {
                    const sectionId = section.uuid
                    const isRecentlyMoved = recentlyMovedItem === sectionId
                    return (
                      <PageContentSectionItem
                        key={section.uuid}
                        pageContentSection={section}
                        idx={idx}
                        isRecentlyMoved={isRecentlyMoved}
                      />
                    )
                  })}
                  {pageContentClone.sections.length < 1 && !snapshot.isDraggingOver && (
                    <div className="w-full h-full flex justify-center items-center">
                      <Text size="md" style="regular" className="text-brease-gray-7">
                        Add sections to build a layout!
                      </Text>
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </div>
  )
}

const SectionsDropdownItem = ({ section }: { section: Section }) => {
  const builderStore = useStore(useBuilderStore)
  const selectedSections = useBuilderStore((state) => state.selectedSections)
  const [selected, setSelected] = useState(false)
  return (
    <DropdownMenuItem
      className={`hover:!bg-brease-gray-2/50 transition-colors ease-in-out duration-200 py-2`}
      key={section.uuid}
      onClick={(e) => {
        e.preventDefault()
        setSelected(!selected)
        if (!selected) {
          const newSection = {
            uuid: uniqueId('new-content-section-'),
            section: {
              name: section.name,
              description: section.description,
              status: section.status,
              uuid: section.uuid
            },
            elements: section.elements.map((row: EditorElementMatrixRow) => {
              return row.map((slot: EditorElementMatrixSlot) => ({
                uuid: slot.uuid,
                value: null,
                element: slot
              }))
            }),
            disabled: false,
            status: 'published' as const
          }
          builderStore.setSelectedSections([...selectedSections, newSection])
        } else {
          const newSections = selectedSections.filter((s) => s.section.uuid != section.uuid)
          builderStore.setSelectedSections(newSections)
        }
      }}
    >
      <div className="flex flex-row items-center gap-5 px-4">
        <Checkbox className="!min-w-[20px]" checked={selected} />
        <div className="p-2 rounded-md bg-brease-gray-2">
          <Layers className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <Text size="sm" style="medium">
            {section.name}
          </Text>
          {section.description != '' && (
            <Text size="sm" style="regular" className="text-brease-gray-7">
              {section.description}
            </Text>
          )}
        </div>
      </div>
    </DropdownMenuItem>
  )
}

const PageContentSectionItem = ({
  pageContentSection,
  idx,
  isRecentlyMoved = false
}: {
  pageContentSection: PageContentSection
  idx: number
  isRecentlyMoved?: boolean
}) => {
  const builderStore = useStore(useBuilderStore)
  const { user } = useUserStore()
  const { setPageContentClone } = useContext(BuilderDraftContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleDeleteSection = () => {
    setPageContentClone((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }))
    setIsOpen(false)
  }

  const handleChangeSectionVisible = () => {
    const newSection = {
      ...pageContentSection,
      disabled: pageContentSection.disabled ? false : true
    }
    setPageContentClone((prev) => {
      const sectionIndex = prev.sections.findIndex((s) => s.uuid === pageContentSection.uuid)
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex] = newSection
      return {
        ...prev,
        sections: updatedSections
      }
    })
    setIsOpen(false)
  }

  const handlePublishSection = () => {
    const newSection = {
      ...pageContentSection,
      status: 'published' as 'draft' | 'published'
    }
    setPageContentClone((prev) => {
      const sectionIndex = prev.sections.findIndex((s) => s.uuid === pageContentSection.uuid)
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex] = newSection
      return {
        ...prev,
        sections: updatedSections
      }
    })
    setIsOpen(false)
  }

  return (
    <Draggable
      draggableId={`${pageContentSection.uuid}-${idx}`}
      index={idx}
      key={`${pageContentSection.uuid}-${idx}`}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          key={pageContentSection.section.uuid}
          className={`w-full rounded-md border border-transparent ${snapshot.draggingOver && 'hover:bg-brease-gray-2/70'} ${isRecentlyMoved ? 'bg-brease-primary/10' : 'bg-brease-gray-1'} border-brease-gray-5 flex items-center justify-between py-4 px-4 ${snapshot.isDragging && 'border-dashed border !border-brease-primary shadow-brease-lg'} transition-colors duration-1000 ease-out`}
          {...provided.draggableProps}
        >
          <div className="w-fit flex flex-row items-center gap-3">
            <div {...provided.dragHandleProps}>
              <GripVertical />
            </div>
            <div className="p-2 bg-brease-gray-2 rounded-md">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row flex-wrap gap-4 items-center">
                <Text size="sm" style="medium">
                  {pageContentSection.section.name}
                </Text>
                {pageContentSection.status != 'published' && (
                  <Badge
                    variant="builderUnpublished"
                    className="rounded-full w-fit bg-brease-warning-light text-brease-warning"
                  >
                    Draft
                  </Badge>
                )}
                <div className="w-fit flex items-center gap-2">
                  {pageContentSection.elements.some((row: PageContentMatrixRow) =>
                    row.some(
                      (slot: PageContentMatrixSlot) =>
                        slot.value === null && slot.element.data?.validation.required
                    )
                  ) && (
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <CircleAlert className="stroke-brease-warning w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="border-2 border-brease-warning bg-black"
                        >
                          <Text size="xs" style="medium" className="text-white">
                            Missing content
                          </Text>
                          <Text size="xxxs" style="regular" className="text-white">
                            Sections with missing content will not be shown on your site
                          </Text>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {pageContentSection.disabled && (
                    <TooltipProvider>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger>
                          <EyeOff className=" w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="border-2 border-brease-warning bg-black"
                        >
                          <Text size="xs" style="medium" className="text-white">
                            Disabled section
                          </Text>
                          <Text size="xxxs" style="regular" className="text-white">
                            This section will not be shown on your site
                          </Text>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              {user.currentTeam.userRole === UserRole.administrator && (
                <Badge variant="secondary" className="rounded-full text-brease-gray-7">
                  {pageContentSection.section.uuid}
                </Badge>
              )}
            </div>
          </div>
          <div className="w-fit flex justify-end cursor-pointer">
            <DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger>
                <ButtonPlaceholder
                  variant="secondary"
                  icon="Ellipsis"
                  size="sm"
                  className="!bg-brease-gray-3 hover:!bg-transparent !ring-0 hover:!ring-1 !ring-brease-gray-5 !py-1 !px-1 !stroke-brease-gray-10  "
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="list-none flex flex-col">
                {pageContentSection.status === 'draft' && (
                  <HeaderProfileMenuItem
                    label={'Publish Section'}
                    dialog
                    dialogProps={{
                      title: 'Are you absolutely sure about this?',
                      description:
                        'You are about to publish this section containing new content. Publishing will overwrite the previous content. Are you sure about this action?',
                      cancelBtnLabel: 'Cancel',
                      actionBtnLabel: 'Yes, I am sure!',
                      actionBtnOnClick: () => handlePublishSection()
                    }}
                    icon={'Upload'}
                    textClassName="!text-brease-warning bg-brease-warning-light group-hover:!bg-brease-warning group-hover:!text-white"
                    iconClassName="!stroke-brease-warning group-hover:!stroke-white transition-all duration-300 ease-in-out"
                  />
                )}
                <HeaderProfileMenuItem
                  label={'Edit Section'}
                  onClick={() => {
                    builderStore.setActiveContent(pageContentSection)
                    builderStore.setContentEditorOpen(true)
                    setIsOpen(false)
                  }}
                  icon={'FilePen'}
                  className="!font-golos-medium"
                />
                <HeaderProfileMenuItem
                  label={pageContentSection.disabled ? 'Enable Section' : 'Disable Section'}
                  onClick={() => handleChangeSectionVisible()}
                  icon={pageContentSection.disabled ? 'Eye' : 'EyeOff'}
                  className="!font-golos-medium"
                />
                <HeaderProfileMenuItem
                  label={'Remove Section'}
                  dialog
                  dialogProps={{
                    title: 'Are you absolutely sure about this?',
                    description:
                      'Deleting this section is an irreversible action, all contents will be lost!',
                    cancelBtnLabel: 'Cancel',
                    actionBtnLabel: 'Yes, I am sure!',
                    actionBtnOnClick: () => handleDeleteSection()
                  }}
                  icon={'Trash'}
                  textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
                  iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </Draggable>
  )
}
