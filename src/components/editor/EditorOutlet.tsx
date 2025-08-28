import { EditorPage, EditorElementMatrixRow } from '@/interface/editor'
import React, { useContext, useEffect, useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import Button from '../generic/Button'
import { Text } from '../generic/Text'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { Badge } from '../shadcn/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/ui/tooltip'
import { EditorOutletRow } from './EditorOutletRow'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { toast } from '../shadcn/ui/use-toast'
import { Switch } from '@/components/shadcn/ui/switch'
import { useEditorDrafts } from '@/lib/hooks/useEditorDrafts'
import { EditorDraftContext } from '@/lib/context/EditorDraftContext'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { createEditorSync } from '@/lib/helpers/createEditorSync'

export const EditorOutlet = () => {
  const { loading, sync, setLoading } = useEditorStore()
  const { itemClone, setItemClone, setActiveItem, originalItems } = useContext(EditorDraftContext)
  const { originalItem, isDraft, discardDraft } = useEditorDrafts(
    itemClone,
    setActiveItem,
    originalItems
  )

  const [isPublished, setIsPublished] = useState<boolean>(
    originalItem && originalItem.status === 'published' ? true : false
  )

  useEffect(() => {
    setItemClone({ ...itemClone, status: `${isPublished ? 'published' : 'unpublished'}` })
  }, [isPublished])

  const handleSave = async (published: boolean) => {
    setLoading(true)
    const sectionSync = createEditorSync(originalItem, itemClone, published)
    if (sectionSync.error) {
      toast({
        variant: 'warning',
        title: `${sectionSync.error}`
      })
      return
    }
    await sync(sectionSync)
    setLoading(false)
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 bg-brease-gray-1 overflow-hidden">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="w-2/3 flex flex-row gap-2 divide-x divide-brease-gray-5">
          <Text size="lg" style="semibold">
            {itemClone.name}
          </Text>
          {itemClone.pages?.length > 0 && (
            <div className="w-fit flex flex-row gap-2 pl-2">
              {itemClone.pages.slice(0, 2).map((page: EditorPage) => (
                <Badge variant={'builderListCardPage'} key={page.uuid} className="cursor-default">
                  {page.name === '' || !page.name ? 'Home' : page.name}
                </Badge>
              ))}
              {itemClone.pages.length > 2 && (
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger>
                      <Badge variant={'builderListCardPage'}>
                        {`+${itemClone.pages.length - 2} more`}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="flex flex-col gap-2">
                      {itemClone.pages.slice(2, itemClone.pages.length).map((page: EditorPage) => (
                        <Text size="xs" style="regular" key={page.uuid} className="cursor-default">
                          {page.name}
                        </Text>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>
        <div className="w-fit flex flex-row-reverse gap-2 items-center justify-center">
          <Text size="sm" style="medium">
            Published
          </Text>
          <Switch
            checked={itemClone.status === 'published' ? true : false}
            onCheckedChange={() => setIsPublished(!isPublished)}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <Droppable droppableId={itemClone.uuid} type="SECTION_ROW">
          {(provided) => (
            <div
              className="flex-1 overflow-y-auto flex flex-col justify-start items-center pb-2 border border-dashed border-brease-gray-5 rounded-lg"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {itemClone.elements.length > 0 &&
                itemClone.elements.map((row: EditorElementMatrixRow, idx: number) => (
                  <EditorOutletRow
                    row={row}
                    index={idx}
                    key={itemClone.uuid + '-' + idx}
                    uuid={itemClone.uuid + '-' + idx}
                  />
                ))}
              {provided.placeholder}
              <div
                onClick={() => {
                  setItemClone({
                    ...itemClone,
                    elements: [...itemClone.elements, []]
                  })
                }}
                className="group w-fit flex items-center justify-center p-2 mt-4 bg-brease-gray-4 rounded-lg opacity-50 hover:opacity-100 hover:bg-brease-primary hover:cursor-pointer transition-all ease-in-out duration-200"
              >
                <div className="flex flex-row items-center gap-2 ">
                  <Plus className="h-4 w-4 stroke-brease-gray-9 group-hover:stroke-brease-gray-1 transition-all ease-in-out duration-200" />
                  <Text
                    size="sm"
                    style="medium"
                    className="group-hover:text-brease-gray-1 transition-all ease-in-out duration-200"
                  >
                    Add New Row
                  </Text>
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </div>
      <div className="w-full flex flex-row justify-between items-end">
        <Button
          label="Discard Changes"
          size="md"
          variant="black"
          className="hover:!ring-brease-error hover:!bg-black disabled:ring-0 disabled:hover:!bg-brease-gray-3"
          onClick={discardDraft}
          disabled={!isDraft}
        />
        <div className="flex flex-row gap-4">
          {loading ? (
            <ButtonPlaceholder
              variant="primary"
              size="md"
              className="flex justify-center !w-[125px]"
            >
              <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <Button
              label="Save Changes"
              size="md"
              variant="primary"
              onClick={() => handleSave(isPublished)}
              className="mr-px hover:!ring-brease-success hover:!ring-2 !ring-0 disabled:!ring-0"
              disabled={!isDraft}
            />
          )}
        </div>
      </div>
    </div>
  )
}
