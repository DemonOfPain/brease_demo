import { DropResult } from '@hello-pangea/dnd'

export const useMediaInputDragAndDrop = (
  items: Set<string>,
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void
) => {
  const onDragEnd = (result: DropResult) => {
    if (!result) return
    const { source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) return
      const itemsArray = Array.from(items)
      const [reorderedItem] = itemsArray.splice(source.index, 1)
      itemsArray.splice(destination.index, 0, reorderedItem)
      onChange(itemsArray)
      return
    }
  }

  return { onDragEnd }
}
