import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { SiteNavigationItem } from '@/interface/site'
import { Plus } from 'lucide-react'
import React from 'react'
import { Text } from '@/components/generic/Text'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { NavigationItem } from './NavigationItem'
import { useNavigationChildrenDragAndDrop } from '@/lib/hooks/useNavigationsDragAndDrop'
import { NavigationItemDialog } from './NavigationItemDialog'

export const NavigationChildrenDialog = ({ navItem }: { navItem: SiteNavigationItem }) => {
  const { navigationItems, currentNavigation } = useSiteStore()
  const { onDragEnd } = useNavigationChildrenDragAndDrop(navigationItems!, navItem)

  // Positioning dnd in dialog example:
  // w-[Xrem] h-[Yrem] !transform-none top-[calc(50%-Y/2rem)] left-[calc(50%-X/2rem)]
  return (
    <AlertDialogContent className="!max-w-none !w-[50rem] !h-[40rem] !transform-none top-[calc(50%-20rem)] left-[calc(50%-25rem)]">
      <VisuallyHidden>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription></AlertDialogDescription>
      </VisuallyHidden>
      <AlertDialogCancel className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200">
        <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
      </AlertDialogCancel>
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <Text size="lg" style="semibold">
            {navItem.value}
          </Text>
          <Text size="sm" style="regular">
            Manage navigation sub menus
          </Text>
        </div>
        <div className="w-fit flex flex-row items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger>
              <ButtonPlaceholder size="md" variant="black" label="Add New" icon="Plus" />
            </AlertDialogTrigger>
            <NavigationItemDialog nav={currentNavigation!} parent={navItem} />
          </AlertDialog>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors={true}>
        <Droppable droppableId="root" type="navigationItem" mode="standard">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-full h-[28rem] rounded-md bg-brease-gray-2 p-2 flex flex-col gap-1"
            >
              {navItem.children.map((item: SiteNavigationItem, index: number) => (
                <NavigationItem key={item.uuid} item={item} index={index} />
              ))}
              {navItem.children.length === 0 && (
                <div className="w-full h-full flex items-center justify-center">
                  <Text size="sm" style="semibold" className="text-brease-gray-7">
                    There are no children in this menu.
                  </Text>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </AlertDialogContent>
  )
}
