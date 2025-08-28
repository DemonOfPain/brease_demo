import { SiteNavigationItem } from '@/interface/site'
import { DropResult } from '@hello-pangea/dnd'
import { useSiteStore } from './useSiteStore'

const reorderItems = (
  items: SiteNavigationItem[],
  startIndex: number,
  endIndex: number
): SiteNavigationItem[] => {
  const result = Array.from(items)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

export const findItemAndUpdate = (
  items: SiteNavigationItem[],
  itemId: string,
  // eslint-disable-next-line no-unused-vars
  updateFn: (itemToUpdate: SiteNavigationItem) => SiteNavigationItem
): SiteNavigationItem[] => {
  return items.map((item) => {
    if (item.uuid === itemId) {
      return updateFn(item)
    }
    if (item.children) {
      return {
        ...item,
        children: findItemAndUpdate(item.children, itemId, updateFn)
      }
    }
    return item
  })
}

export const useNavigationsDragAndDrop = (items: SiteNavigationItem[]) => {
  const { setNavigationItems, syncNavigation } = useSiteStore()

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    // If dropping in the same list at a different position
    if (source.droppableId === destination.droppableId) {
      let updatedItems: SiteNavigationItem[]

      if (source.droppableId === 'root') {
        updatedItems = reorderItems(items, source.index, destination.index)
      } else {
        // Find the parent item and reorder its children
        const parentId = source.droppableId.replace('-children', '')
        updatedItems = findItemAndUpdate(items, parentId, (item) => ({
          ...item,
          children: reorderItems(item.children || [], source.index, destination.index)
        }))
      }

      setNavigationItems(updatedItems)
      syncNavigation()
      return
    }

    // If dropping into a different list
    let updatedItems = [...items]
    let draggedItem: SiteNavigationItem | null = null

    // Remove item from source
    if (source.droppableId === 'root') {
      ;[draggedItem] = updatedItems.splice(source.index, 1)
    } else {
      const sourceParentId = source.droppableId.replace('-children', '')
      updatedItems = findItemAndUpdate(items, sourceParentId, (item) => {
        const children = [...(item.children || [])]
        const [removedItem] = children.splice(source.index, 1)
        draggedItem = removedItem
        return { ...item, children: children.length ? children : [] }
      })
    }

    if (!draggedItem) return

    // Add item to destination
    if (destination.droppableId === 'root') {
      updatedItems.splice(destination.index, 0, draggedItem)
    } else {
      const destParentId = destination.droppableId.replace('-children', '')
      updatedItems = findItemAndUpdate(updatedItems, destParentId, (item) => {
        const children = [...(item.children || [])]
        children.splice(destination.index, 0, draggedItem!)
        return { ...item, children }
      })
    }

    setNavigationItems(updatedItems)
    syncNavigation()
  }

  return { onDragEnd }
}

export const useNavigationChildrenDragAndDrop = (
  currentNavItems: SiteNavigationItem[],
  navItem: SiteNavigationItem
) => {
  const { setNavigationItems, syncNavigation } = useSiteStore()

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    // Only handle reordering within the same droppable (the children list)
    if (source.droppableId === destination.droppableId) {
      // Create a new array with the reordered children
      const reorderedChildren = reorderItems(navItem.children, source.index, destination.index)

      // Find and update the parent item in the navigation items tree
      const updatedItems = findItemAndUpdate(currentNavItems, navItem.uuid, (item) => ({
        ...item,
        children: reorderedChildren
      }))

      // Update the navigation items in the store
      setNavigationItems(updatedItems)
      syncNavigation()
    }
  }

  return { onDragEnd }
}
