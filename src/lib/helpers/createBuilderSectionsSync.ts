import { PageContent } from '@/interface/builder'

export const createBuilderSectionsSync = (content: PageContent) => {
  return content.sections.map((section) => {
    if (section.uuid.includes('pas-')) {
      return {
        type: 'update',
        id: section.uuid,
        disabled: section.disabled,
        status: section.status
      }
    } else {
      return {
        type: 'create',
        id: section.section.uuid,
        disabled: false,
        status: 'draft'
      }
    }
  })
}
