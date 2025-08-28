import { CollectionEntryContent } from '@/interface/manager'
import { isEqual } from 'lodash'

export const compareManagerContents = (
  prevContent: CollectionEntryContent,
  currContent: CollectionEntryContent
): boolean => {
  const prevElements = prevContent.elements
  const currElements = currContent.elements

  // If number of rows is different, that's a structural change - return false
  if (prevElements.length !== currElements.length) {
    return false
  }

  for (let slotIdx = 0; slotIdx < currElements.length; slotIdx++) {
    // Only return true if the actual content value has changed
    if (!isEqual(prevElements[slotIdx].value, currElements[slotIdx].value)) {
      return true
    }
  }

  return false // No content value changes found
}
