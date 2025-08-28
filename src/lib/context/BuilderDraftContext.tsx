/* eslint-disable no-unused-vars */
import { PageContent } from '@/interface/builder'
import { createContext } from 'react'

interface BuilderDraftContextType {
  pageContentClone: PageContent
  setPageContentClone: (content: PageContent | ((prev: PageContent) => PageContent)) => void
  isSectionDirty: boolean
  isDraft: boolean
  discardSection: () => void
  discardDraft: () => void
}

export const BuilderDraftContext = createContext<BuilderDraftContextType>({
  pageContentClone: {} as PageContent,
  setPageContentClone: () => {},
  isSectionDirty: false,
  isDraft: false,
  discardSection: () => {},
  discardDraft: () => {}
})
