/* eslint-disable no-unused-vars */

import { EditorElementMatrixSlot } from './editor'
import { StoreOperationOptions } from './manager'

// Re-export StoreOperationOptions for convenience
export type { StoreOperationOptions }

export type BuilderStore = {
  loading: boolean
  contentEditorOpen: boolean
  locale: string
  pageContent: PageContent
  activeContent: PageContentSection
  elementValues: Record<string, any>
  selectedSections: PageContentSection[]
  setLoading: (isLoading: boolean) => void
  setContentEditorOpen: (open: boolean) => void
  setLocale: (locale: string) => void
  setPageContent: (content: PageContent) => void
  setActiveContent: (content: PageContentSection) => void
  setElementValues: (values: Record<string, any>) => void
  setSelectedSections: (newSections: PageContentSection[]) => void
  getPageContent: (pageId: string, options?: StoreOperationOptions) => Promise<void>
  syncContent: (
    contentSync: any,
    publish?: boolean,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void | PageContentSection>
  syncSections: (
    sectionSync: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
}

export type PageContent = {
  uuid: string
  name: string
  sections: PageContentSection[]
}

//pas-uuid
export type PageContentSection = {
  uuid: string
  section: PageContentSectionDesc
  elements: PageContentMatrix
  disabled: boolean
  status: 'draft' | 'published'
}

//sec-uuid
export type PageContentSectionDesc = {
  uuid: string
  name: string
  description: string
  status: string
}

export type PageContentMatrix = PageContentMatrixRow[]

export type PageContentMatrixRow = PageContentMatrixSlot[]

//con-uuid
export type PageContentMatrixSlot = {
  uuid: string
  value: any // ?? the value from the builder
  element: EditorElementMatrixSlot
}

export type BuilderSync = BuilderSyncEntry[]

export type BuilderSyncEntry = {
  id: string
  value: any
}
