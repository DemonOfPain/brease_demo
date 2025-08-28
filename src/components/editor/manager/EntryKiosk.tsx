'use client'
import React, { useContext } from 'react'
import { Text } from '@/components/generic/Text'
import { EditorSidebarButton } from '../EditorSidebarButton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip'
import { EntryDetailsDialog } from './EntryDetailsDialog'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { CollectionEntry, CollectionEntryContent } from '@/interface/manager'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import { Collection } from '@/interface/editor'
import { EyeOff, GripVertical, Search } from 'lucide-react'
import { useEntriesDragAndDrop } from '@/lib/hooks/useEntriesDragAndDrop'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { createEntriesSync } from '@/lib/helpers/createEntriesSync'
import { Badge } from '@/components/shadcn/ui/badge'
import { toast } from '@/components/shadcn/ui/use-toast'
import { ManagerDraftContext } from '@/lib/context/ManagerDraftContext'
import { useState, useMemo } from 'react'
import { Input } from '@/components/shadcn/ui/input'

export const EntryKiosk = () => {
  const { entries, collection, setEntry, entry } = useManagerStore()
  const { collections } = useEditorStore()
  const { onDragEnd } = useEntriesDragAndDrop(entries)
  const [entrySearchTerm, setEntrySearchTerm] = useState('')
  const [isEntrySearchOpen, setIsEntrySearchOpen] = useState(false)

  const filteredEntries = useMemo(() => {
    if (!entries || !entrySearchTerm.trim()) return []
    return entries.filter((entry) =>
      entry.name.toLowerCase().includes(entrySearchTerm.toLowerCase())
    )
  }, [entries, entrySearchTerm])

  const handleEntrySelect = (entry: CollectionEntry) => {
    setEntry(entry)
    setEntrySearchTerm('')
    setIsEntrySearchOpen(false)
  }

  return (
    <div className="w-full max-w-[460px] h-full bg-brease-gray-1 flex flex-col border-r border-brease-gray-5">
      <div className="flex flex-row items-center justify-between gap-6 py-2 px-4 border-brease-gray-5 border-b">
        <div className="flex flex-row items-center gap-2">
          <Text style="medium" size="lg">
            Collections
          </Text>
        </div>
        <CollectionSelector collections={collections} />
      </div>
      <div className="w-full flex flex-row justify-between items-center gap-4 px-4 pt-4 pb-4 border-b border-brease-gray-5">
        <Text size="xl" style="medium" className="!text-d-xs">
          Entries
        </Text>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brease-gray-7 z-10" />
          <Input
            placeholder="Search entries..."
            value={entrySearchTerm}
            onChange={(e) => {
              setEntrySearchTerm(e.target.value)
              setIsEntrySearchOpen(e.target.value.trim().length > 0)
            }}
            onFocus={() => setIsEntrySearchOpen(entrySearchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setIsEntrySearchOpen(false), 150)}
            className="pl-10 h-9 text-sm bg-brease-gray-2 border-transparent font-golos-medium"
            autoComplete="off"
          />
          {isEntrySearchOpen && filteredEntries.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brease-gray-5 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.uuid}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-brease-gray-2 cursor-pointer border-b border-brease-gray-3 last:border-b-0"
                  onClick={() => handleEntrySelect(entry)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Text size="sm" style="medium" className="truncate">
                      {entry.name}
                    </Text>
                    {entry.status !== 'published' && (
                      <Badge
                        variant="builderUnpublished"
                        className="rounded-full w-fit bg-brease-warning-light text-brease-warning text-xs"
                      >
                        Draft
                      </Badge>
                    )}
                    {entry.disabled && <EyeOff className="w-3 h-3 text-brease-gray-7" />}
                  </div>
                </div>
              ))}
            </div>
          )}
          {isEntrySearchOpen && entrySearchTerm.trim() && filteredEntries.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brease-gray-5 rounded-md shadow-lg z-50">
              <div className="px-3 py-4 text-center">
                <Text size="sm" style="regular" className="text-brease-gray-7">
                  No entries found
                </Text>
              </div>
            </div>
          )}
        </div>
        <div className="w-fit flex flex-row items-center gap-2">
          <TooltipProvider>
            <EditorSidebarButton
              buttonVariant="black"
              buttonIcon="Plus"
              toolTipText="Add New"
              tooltipDir="bottom"
              dialogContent={<EntryDetailsDialog />}
            />
          </TooltipProvider>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={collection?.uuid || 'col-null'}>
          {(provided) => (
            <div
              className="w-full h-full overflow-y-scroll no-scrollbar "
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {entries ? (
                entries.length > 0 ? (
                  entries!.map((e, idx) => (
                    <EntryKioskItem
                      key={e.uuid}
                      idx={idx}
                      entry={e}
                      selected={entry?.uuid === e.uuid}
                    />
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <Text size="sm" style="regular" className="text-brease-gray-7">
                      No entries found!
                    </Text>
                    <Text size="sm" style="regular" className="text-brease-gray-7">
                      Create one to start editing.
                    </Text>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col gap-1 items-center">
                  <Skeleton className="h-14 w-full rounded-none" />
                  <Skeleton className="h-14 w-full rounded-none" />
                  <Skeleton className="h-14 w-full rounded-none" />
                  <Skeleton className="h-14 w-full rounded-none" />
                  <Skeleton className="h-14 w-full rounded-none" />
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

const EntryKioskItem = ({
  entry,
  idx,
  selected
}: {
  entry: CollectionEntry
  idx: number
  selected: boolean
}) => {
  const {
    setEntry,
    setLoading,
    deleteEntry,
    entries,
    loading,
    syncEntries,
    setElementValues,
    setEntryContent
  } = useManagerStore()
  const { setEntryContentClone } = useContext(ManagerDraftContext)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDeleteEntry = async (uuid: string) => {
    setLoading(true)
    await deleteEntry(uuid)
    setEntryContentClone({} as CollectionEntryContent)
    setEntry({} as CollectionEntry)
    setEntryContent({} as CollectionEntryContent)
    setElementValues({})
    setLoading(false)
  }

  const handleChangeVisibility = async (entry: CollectionEntry) => {
    setLoading(true)
    const newDisabled = entry.disabled ? false : true
    const updatedEntries = entries!.map((e) =>
      e.uuid === entry.uuid ? { ...e, disabled: newDisabled } : e
    )
    const syncArray = createEntriesSync(updatedEntries)
    const syncRes = await syncEntries(syncArray)
    if (syncRes.ok) toast({ variant: 'success', title: 'Entry visibility changed successfully!' })
    setLoading(false)
  }

  const handlePublishEntry = async (entry: CollectionEntry) => {
    setLoading(true)
    const updatedEntries = entries!.map((e) =>
      e.uuid === entry.uuid ? { ...e, status: 'published' as 'published' | 'draft' } : e
    )
    const syncArray = createEntriesSync(updatedEntries)
    const syncRes = await syncEntries(syncArray)
    if (syncRes.ok) toast({ variant: 'success', title: 'Entry published successfully!' })
    setLoading(false)
  }

  return (
    <Draggable draggableId={entry.uuid} index={idx} key={entry.uuid}>
      {(provided, snapshot) => (
        <div
          className={`w-full flex flex-row gap-4 items-center hover:bg-brease-gray-2 bg-brease-gray-1 rounded-md ${selected && '!bg-brease-gray-2'} ${snapshot.isDragging && 'border-dashed border !border-brease-primary shadow-brease-lg'} transition-colors duration-200 ease-in-out`}
          ref={provided.innerRef}
          key={entry.uuid}
          {...provided.draggableProps}
        >
          <div {...provided.dragHandleProps} className="hover:cursor-grab py-4 pl-4">
            <GripVertical />
          </div>
          <div className={`w-full flex flex-row items-center justify-between`}>
            <div
              className="w-full flex flex-row items-center gap-2 py-4 cursor-pointer"
              onClick={() => {
                if (!selected) {
                  setEntry(entry)
                  setIsOpen(false)
                }
              }}
            >
              <Text size="sm" style={selected ? 'medium' : 'regular'}>
                {entry.name}
              </Text>
              {entry.status != 'published' && (
                <Badge
                  variant="builderUnpublished"
                  className="rounded-full w-fit bg-brease-warning-light text-brease-warning"
                >
                  Draft
                </Badge>
              )}
            </div>
            <div className="w-fit flex flex-row items-center gap-4 pr-4">
              {entry.disabled && (
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
                        Disabled entry
                      </Text>
                      <Text size="xxxs" style="regular" className="text-white">
                        This entry will not be shown on your site
                      </Text>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="focus-visible:outline-none">
                  <ButtonPlaceholder
                    variant="secondary"
                    icon="Ellipsis"
                    size="sm"
                    className="!bg-brease-gray-3 hover:!bg-transparent !ring-0 hover:!ring-1 !ring-brease-gray-5  !py-1 !px-1 !stroke-brease-gray-10 "
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] flex flex-col p-2 list-none">
                  {entry.status === 'draft' && (
                    <HeaderProfileMenuItem
                      label={'Publish entry'}
                      dialog
                      dialogProps={{
                        title: 'Are you absolutely sure about this?',
                        description:
                          'You are about to publish this entry containing new content. Publishing will overwrite the previous content. Are you sure about this action?',
                        cancelBtnLabel: 'Cancel',
                        actionBtnLabel: 'Yes, I am sure!',
                        actionBtnOnClick: () => {
                          handlePublishEntry(entry)
                          setIsOpen(false)
                        }
                      }}
                      icon={'Upload'}
                      textClassName="!text-brease-warning bg-brease-warning-light group-hover:!bg-brease-warning group-hover:!text-white"
                      iconClassName="!stroke-brease-warning group-hover:!stroke-white transition-all duration-300 ease-in-out"
                    />
                  )}
                  {!selected && (
                    <HeaderProfileMenuItem
                      label={'Edit entry content'}
                      icon={'FilePen'}
                      onClick={() => {
                        setEntry(entry)
                        setIsOpen(false)
                      }}
                      className="!font-golos-medium"
                    />
                  )}
                  <HeaderProfileMenuItem
                    label={'Edit entry details'}
                    dialog
                    customDialog={<EntryDetailsDialog editorData={entry} />}
                    icon={'FolderPen'}
                    className="!font-golos-medium"
                  />
                  <HeaderProfileMenuItem
                    label={entry.disabled ? 'Enable entry' : 'Disable entry'}
                    onClick={() => {
                      handleChangeVisibility(entry)
                      setIsOpen(false)
                    }}
                    icon={entry.disabled ? 'Eye' : 'EyeOff'}
                    className="!font-golos-medium"
                  />
                  <HeaderProfileMenuItem
                    label={'Delete entry'}
                    dialog
                    dialogProps={{
                      title: 'Are you sure about deleting this entry?',
                      description:
                        'This is an irreversible action, the entry will be deleted permanently.',
                      cancelBtnLabel: 'Cancel',
                      actionBtnLabel: loading ? 'Deleting entry...' : 'Yes, I am sure',
                      actionBtnOnClick: () => handleDeleteEntry(entry.uuid)
                    }}
                    icon={'Trash2'}
                    className="w-full !font-golos-medium"
                    textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
                    iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export function CollectionSelector({ collections }: { collections: Collection[] | null }) {
  const { setCollection, collection, setEntryContent, setEntry, entryContent, setElementValues } =
    useManagerStore()
  const { setEntryContentClone } = useContext(ManagerDraftContext)
  const [collectionSearchTerm, setCollectionSearchTerm] = useState('')

  const handleCollectionChange = (collectionUuid: string) => {
    const selectedCollection = collections!.find((c) => c.uuid === collectionUuid)
    if (selectedCollection) {
      setCollection(selectedCollection)
      if (entryContent.uuid) {
        setEntryContentClone({} as CollectionEntryContent)
        setEntry({} as CollectionEntry)
        setEntryContent({} as CollectionEntryContent)
        setElementValues({})
      }
    }
    setCollectionSearchTerm('')
  }

  const filteredCollections = useMemo(() => {
    if (!collections) return []
    const publishedCollections = collections.filter((c) => c.status !== 'unpublished')
    if (!collectionSearchTerm.trim()) {
      return publishedCollections
    }
    return publishedCollections.filter((col) =>
      col.name.toLowerCase().includes(collectionSearchTerm.toLowerCase())
    )
  }, [collections, collectionSearchTerm])

  if (collections) {
    const allFilteredCollections = collections.filter((c) => c.status !== 'unpublished')
    return (
      <div className="w-fit">
        <Select
          value={collection.uuid || ''}
          onValueChange={handleCollectionChange}
          disabled={allFilteredCollections.length === 0}
        >
          <SelectTrigger className="gap-2 py-2 shadow-none">
            <SelectValue
              placeholder={
                allFilteredCollections.length != 0
                  ? 'Select a collection'
                  : 'No collections available'
              }
            />
          </SelectTrigger>
          {allFilteredCollections.length != 0 && (
            <SelectContent align="end">
              <div className="pb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-brease-gray-7" />
                  <Input
                    placeholder="Search collections..."
                    value={collectionSearchTerm}
                    onChange={(e) => setCollectionSearchTerm(e.target.value)}
                    className="h-8 text-sm bg-brease-gray-2 border-transparent font-golos-medium"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                      if (e.key === 'Escape') {
                        setCollectionSearchTerm('')
                      }
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    autoComplete="off"
                  />
                </div>
              </div>
              {filteredCollections.length > 0 ? (
                filteredCollections.map((col) => (
                  <SelectItem key={col.uuid} value={col.uuid}>
                    {col.name}
                  </SelectItem>
                ))
              ) : (
                <div className="w-full flex flex-row justify-center items-center py-1">
                  <Text size="sm" style="regular" className="text-brease-gray-7">
                    {collectionSearchTerm.trim()
                      ? 'No collections found'
                      : 'No collections available'}
                  </Text>
                </div>
              )}
            </SelectContent>
          )}
        </Select>
      </div>
    )
  } else {
    return <Skeleton className="w-full h-full" />
  }
}
