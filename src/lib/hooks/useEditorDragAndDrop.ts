import { DropResult } from '@hello-pangea/dnd'
import { EditorItem, Element } from '@/interface/editor'
import { uniqueId } from 'lodash'
import { generateSlotKey } from '../helpers/generateSlotKey'

export const useEditorDragAndDrop = (
  itemClone: EditorItem,
  setItemClone: React.Dispatch<React.SetStateAction<EditorItem>>,
  editorTools: Element[]
) => {
  const onDragEnd = (result: DropResult) => {
    // CASE: no result
    if (!result) return
    const { source, destination } = result
    // CASE: try to add-to/reorder kiosk
    if (!destination || destination.droppableId === 'KIOSK') return
    // CASE: reorder
    if (destination.droppableId === source.droppableId) {
      // element is placed in the same place
      if (destination.index === source.index) return
      // reorder rows in section
      if (result.type === 'SECTION_ROW') {
        const newRowOrder = [...itemClone.elements]
        const [row] = newRowOrder.splice(source.index, 1)
        newRowOrder.splice(destination.index, 0, row)
        setItemClone({ ...itemClone, elements: newRowOrder })
        return
      }
      // reorder slots in row
      if (result.type === 'SECTION_SLOT') {
        const rowIndex = Number(destination.droppableId.split('-').pop())
        const rows = [...itemClone.elements]
        const newSlotOrder = [...itemClone.elements[rowIndex]]
        const [slot] = newSlotOrder.splice(source.index, 1)
        newSlotOrder.splice(destination.index, 0, slot)
        rows[rowIndex] = newSlotOrder
        setItemClone({ ...itemClone, elements: rows })
        return
      }
    }
    // CASE: add element from kiosk
    if (source.droppableId === 'KIOSK') {
      const rowIndex = Number(destination.droppableId.split('-').pop())
      const rows = [...itemClone.elements]
      const newSlotOrder = [...itemClone.elements[rowIndex]]
      // find the actual element that can be used in sections
      const newElement = editorTools.find(
        (element) => element.uuid === result.draggableId.slice(6, result.draggableId.length)
      )
      const newSlot = {
        uuid: uniqueId('new-slot-'),
        element: newElement!,
        key: generateSlotKey(itemClone, newElement!),
        data: {
          validation: {
            required: true
          }
        }
      }
      newSlotOrder.splice(destination.index, 0, newSlot!)
      rows[rowIndex] = newSlotOrder
      setItemClone({ ...itemClone, elements: rows })
      return
    }
    // CASE: move slot between rows
    if (source.droppableId != 'KIOSK' && source.droppableId != destination.droppableId) {
      const rows = [...itemClone.elements]
      const destinationRowIndex = Number(destination.droppableId.split('-').pop())
      const sourceRowIndex = Number(source.droppableId.split('-').pop())
      const destinationSlotOrder = [...itemClone.elements[destinationRowIndex]]
      const sourceSlotOrder = [...itemClone.elements[sourceRowIndex]]
      const [sourceSlot] = sourceSlotOrder.splice(source.index, 1)
      destinationSlotOrder.splice(destination.index, 0, sourceSlot)
      sourceSlotOrder.splice(source.index, 0)
      rows[destinationRowIndex] = destinationSlotOrder
      rows[sourceRowIndex] = sourceSlotOrder
      setItemClone({ ...itemClone, elements: rows })
      return
    }
  }

  return { onDragEnd }
}
