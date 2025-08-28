import { CollectionEntry } from '@/interface/manager'
import { DropResult } from '@hello-pangea/dnd'
import { useManagerStore } from './useManagerStore'
import { useStore } from 'zustand'
import { createEntriesSync } from '../helpers/createEntriesSync'

export const useEntriesDragAndDrop = (items: CollectionEntry[] | null) => {
  const managerStore = useStore(useManagerStore)
  const onDragEnd = (result: DropResult) => {
    if (!items) return
    if (!result) return
    const { source, destination } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) return
      const [reorderedItem] = items.splice(source.index, 1)
      items.splice(destination.index, 0, reorderedItem)
      const sync = createEntriesSync(items)
      managerStore.syncEntries(sync)
      return
    }
  }

  return { onDragEnd }
}
