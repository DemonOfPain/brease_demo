import { PageContent } from '@/interface/builder'
import { DropResult } from '@hello-pangea/dnd'
import React from 'react'

export const useBuilderDragAndDrop = (
  clone: PageContent,
  setClone: React.Dispatch<React.SetStateAction<PageContent>>,
  // eslint-disable-next-line no-unused-vars
  onItemMoved?: (draggableId: string) => void
) => {
  const onDragEnd = (result: DropResult) => {
    if (!result) return
    const { source, destination, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) return
      const newRowOrder = [...clone.sections]
      const [row] = newRowOrder.splice(source.index, 1)
      newRowOrder.splice(destination.index, 0, row)
      setClone({ ...clone, sections: newRowOrder })

      if (onItemMoved) {
        onItemMoved(draggableId)
      }
      return
    }
  }
  return { onDragEnd }
}
