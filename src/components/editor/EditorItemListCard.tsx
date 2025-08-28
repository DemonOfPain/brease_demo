import React from 'react'
import { Text } from '@/components/generic/Text'
import { Badge } from '../shadcn/ui/badge'
import { EditorPage, EditorItem, Section, Collection } from '@/interface/editor'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../shadcn/ui/dropdown-menu'
import HeaderProfileMenuItem from '../dashboard/dashboard-layout/HeaderProfileMenuItem'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { CollectionDetailsDialog, SectionDetailsDialog } from './EditorDetailsDialog'
import { EditorDeleteDialog } from './EditorDeleteDialog'

interface EditorItemListCardInterface {
  item: EditorItem
  onClick: () => void
  active?: boolean
  unsaved?: boolean
}

export const EditorItemListCard = ({
  item,
  onClick,
  active = false,
  unsaved = false
}: EditorItemListCardInterface) => {
  const itemType = useEditorStore((state) => state.editorType)
  return (
    <div
      onClick={onClick}
      className={`${active ? `${unsaved || item.status != 'published' ? '!border-brease-warning' : 'border-brease-primary'} hover:!bg-brease-gray-1` : 'border-brease-gray-5'} hover:bg-brease-gray-2/40 ${unsaved && `bg-brease-warning-light border-brease-warning-light hover:!bg-brease-warning-light/80`} min-w-[389px] w-full flex flex-col items-start gap-2 p-3 rounded-md shadow-brease-xs border hover:cursor-pointer transition-all duration-200`}
    >
      <div className="w-full flex flex-row items-start justify-between">
        <div className="w-fit flex flex-col">
          <Text size="md" style="medium">
            {item.name}
          </Text>
          <Text size="xs" style="regular">
            {item.description}
          </Text>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <ButtonPlaceholder
              variant="secondary"
              icon="Ellipsis"
              size="sm"
              className={`${unsaved ? '!ring-brease-warning !bg-transparent !ring-1 hover:!ring-2 !stroke-brease-warning' : 'border-brease-primary !ring-0'} !bg-brease-gray-3 hover:!bg-transparent hover:!ring-1 !ring-brease-gray-5  !py-1 !px-1 !stroke-brease-gray-10 `}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] flex flex-col p-2 list-none">
            <HeaderProfileMenuItem
              label={itemType === 'sections' ? 'Edit section' : 'Edit collection'}
              dialog
              customDialog={
                itemType === 'sections' ? (
                  <SectionDetailsDialog editorData={item as Section} />
                ) : (
                  <CollectionDetailsDialog editorData={item as Collection} />
                )
              }
              icon={'FilePen'}
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label={itemType === 'sections' ? 'Delete section' : 'Delete collection'}
              dialog
              customDialog={<EditorDeleteDialog editorData={item} />}
              icon={'Trash2'}
              className="w-full !font-golos-medium"
              textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
              iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full flex flex-col-reverse gap-2">
        <div className="flex justify-start items-start h-full">
          <Badge
            variant={
              unsaved
                ? 'builderUnpublished'
                : item.status === 'published'
                  ? 'builderPublished'
                  : 'builderUnpublished'
            }
          >
            {unsaved ? 'DRAFT' : item.status.toUpperCase()}
          </Badge>
        </div>
        {item.pages?.length > 0 && (
          <div className="w-fit flex flex-row gap-2">
            {item.pages.slice(0, 2).map((page: EditorPage) => (
              <Badge variant={'builderListCardPage'} key={page.uuid} className="cursor-default">
                {page.name === '' || !page.name ? 'Home' : page.name}
              </Badge>
            ))}
            {item.pages.length > 2 && (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger>
                    <Badge variant={'builderListCardPage'}>
                      {`+${item.pages.length - 2} more`}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="flex flex-col gap-2">
                    {item.pages.slice(2, item.pages.length).map((page: EditorPage) => (
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
    </div>
  )
}
