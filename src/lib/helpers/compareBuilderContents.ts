import { PageContentSection } from '@/interface/builder'
import { isEqual } from 'lodash'

// Compare a single section's content
export const compareBuilderContents = (
  prevContent: PageContentSection,
  currContent: PageContentSection
): boolean => {
  const prevElements = prevContent.elements
  const currElements = currContent.elements

  // If number of rows is different, that's a structural change - return false
  if (prevElements.length !== currElements.length) {
    return false
  }

  for (let rowIdx = 0; rowIdx < currElements.length; rowIdx++) {
    const prevRow = prevElements[rowIdx]
    const currRow = currElements[rowIdx]

    // If number of slots in row is different, that's a structural change - return false
    if (prevRow.length !== currRow.length) {
      return false
    }

    for (let slotIdx = 0; slotIdx < currRow.length; slotIdx++) {
      // Only return true if the actual content value has changed
      if (!isEqual(prevRow[slotIdx].value, currRow[slotIdx].value)) {
        return true
      }
    }
  }

  return false // No content value changes found
}
