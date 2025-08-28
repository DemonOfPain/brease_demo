import { EditorItem, EditorSync, EditorSyncEntry } from '@/interface/editor'

export function createEditorSync(
  original: EditorItem,
  updated: EditorItem,
  published: boolean
): EditorSync {
  const sync: EditorSync = {
    status: published ? 'published' : 'unpublished',
    grid: []
  }
  const originalUUIDs = new Map<string, string>()
  original.elements.forEach((row) => {
    row.forEach((slot) => {
      originalUUIDs.set(slot.uuid, slot.key)
    })
  })

  // Check for invalid collections element
  for (const row of updated.elements) {
    for (const newSlot of row) {
      if (newSlot.element.type === 'collection' && !newSlot.data) {
        return {
          error: 'Collection elements require a selected collection!',
          status: 'unpublished',
          grid: []
        } as EditorSync
      }
    }
  }

  // Check for invalid option element
  for (const row of updated.elements) {
    for (const newSlot of row) {
      if (
        newSlot.element.type === 'option' &&
        (newSlot.data?.values?.length === 0 || !newSlot.data?.type)
      ) {
        return {
          error: 'Option elements require a selected type and at least one value!',
          status: 'unpublished',
          grid: []
        } as EditorSync
      }
    }
  }

  // Check for invalid media element
  for (const row of updated.elements) {
    for (const newSlot of row) {
      if (newSlot.element.type === 'media' && (!newSlot.data || !newSlot.data.type)) {
        return {
          error: 'Media elements require a selected media group!',
          status: 'unpublished',
          grid: []
        } as EditorSync
      }
    }
  }

  // Check for invalid link element
  for (const row of updated.elements) {
    for (const newSlot of row) {
      if (newSlot.element.type === 'link' && !newSlot.data) {
        return {
          error: 'Link elements require a selected type!',
          status: 'unpublished',
          grid: []
        } as EditorSync
      }
    }
  }

  // Add data.type attr to datetime elements manually (for now)
  for (const row of updated.elements) {
    for (const newSlot of row) {
      if (newSlot.element.type === 'datetime') {
        newSlot.data = { ...newSlot.data, type: 'datetime' }
      }
    }
  }

  // Continue with the rest of the sync logic
  updated.elements.forEach((row) => {
    if (row.length === 0) return
    const syncRow: EditorSyncEntry[] = []
    row.forEach((newSlot) => {
      const existingEntry = Array.from(originalUUIDs.entries()).find(
        ([uuid, key]) => key === newSlot.key || uuid === newSlot.uuid
      )

      // Check if the element has changed, even if the slot position is the same
      if (
        existingEntry &&
        original.elements
          .flat()
          .find(
            (slot) => slot.uuid === existingEntry[0] && slot.element.uuid === newSlot.element.uuid
          )
      ) {
        // Element is the same, just update
        syncRow.push({
          type: 'update',
          id: existingEntry[0],
          key: newSlot.key,
          ...(newSlot.data && { data: newSlot.data })
        })
      } else {
        // Element is different or new, create instead
        syncRow.push({
          type: 'create',
          id: newSlot.element.uuid,
          key: newSlot.key,
          ...(newSlot.data && { data: newSlot.data })
        })
      }
    })

    if (syncRow.length > 0) {
      sync.grid.push(syncRow)
    }
  })
  return sync
}
