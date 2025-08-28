import { SiteNavigationItem } from '@/interface/site'
import React from 'react'
import { NavigationItem } from './NavigationItem'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import { useNavigationsDragAndDrop } from '@/lib/hooks/useNavigationsDragAndDrop'

export const NavigationItemManager = ({ items }: { items: SiteNavigationItem[] }) => {
  const { onDragEnd } = useNavigationsDragAndDrop(items)
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="root" type="navigationItem">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="w-full h-[calc(100dvh-280px)] rounded-md bg-brease-gray-2 p-2 overflow-y-scroll flex flex-col gap-1"
          >
            {items.map((item: SiteNavigationItem, index: number) => (
              <NavigationItem key={item.uuid} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
