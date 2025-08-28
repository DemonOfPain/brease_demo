import { PageContentSection } from '@/interface/builder'
import { isEqual } from 'lodash'

// This helper only comapers sections in builder, does not
// care for content in sections
export const compareBuilderSections = (
  prevContent: PageContentSection[],
  currContent: PageContentSection[]
): boolean => {
  // Compare array lengths
  if (prevContent.length !== currContent.length) {
    return true
  }

  // Compare section order
  const prevUuids = prevContent.map((section) => section.uuid)
  const currUuids = currContent.map((section) => section.uuid)

  if (!isEqual(prevUuids, currUuids)) {
    return true
  }

  // Check if disabled property has changed for any section
  for (let i = 0; i < prevContent.length; i++) {
    if (prevContent[i].disabled !== currContent[i].disabled) {
      return true
    }
    if (prevContent[i].status !== currContent[i].status) {
      return true
    }
  }

  return false // No changes detected
}
