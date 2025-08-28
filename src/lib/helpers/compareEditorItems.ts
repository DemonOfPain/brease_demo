import { EditorItem } from '@/interface/editor'
import { isEqual } from 'lodash'

export function compareEditorItems(prevItem: EditorItem, currentItem: EditorItem): boolean {
  // Remove empty arrays from elements
  const filteredPrevElements = prevItem.elements.filter((row) => row.length > 0)
  const filteredCurrentElements = currentItem.elements.filter((row) => row.length > 0)

  // Compare status
  if (prevItem.status != currentItem.status) return true

  // Compare filtered elements length
  if (filteredPrevElements.length !== filteredCurrentElements.length) {
    return true // New non-empty row added or removed
  }

  // Compare filtered elements
  for (let i = 0; i < filteredCurrentElements.length; i++) {
    const prevRow = filteredPrevElements[i]
    const currentRow = filteredCurrentElements[i]

    if (prevRow.length !== currentRow.length) {
      return true // New element added or removed in existing row
    }

    if (
      !isEqual(
        prevRow.map((slot) => slot.uuid),
        currentRow.map((slot) => slot.uuid)
      )
    ) {
      return true // Elements reordered within row
    }

    for (let j = 0; j < currentRow.length; j++) {
      if (prevRow[j].key !== currentRow[j].key) {
        return true // Key of a slot modified
      }

      if (!isEqual(prevRow[j].data, currentRow[j].data)) {
        return true // Data of a slot modified
      }
    }
  }

  // Compare row lengths after filtering
  if (
    !isEqual(
      filteredPrevElements.map((row) => row.length),
      filteredCurrentElements.map((row) => row.length)
    )
  ) {
    return true // Rows reordered or empty rows added/removed
  }

  return false // No relevant changes detected
}
