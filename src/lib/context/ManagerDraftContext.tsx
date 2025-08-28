/* eslint-disable no-unused-vars */
import { CollectionEntryContent } from '@/interface/manager'
import { createContext } from 'react'

interface ManagerDraftContextType {
  entryContentClone: CollectionEntryContent
  setEntryContentClone: (
    content: CollectionEntryContent | ((prev: CollectionEntryContent) => CollectionEntryContent)
  ) => void
  isDraft: boolean
  discardDraft: () => void
}

export const ManagerDraftContext = createContext<ManagerDraftContextType>({
  entryContentClone: {} as CollectionEntryContent,
  setEntryContentClone: () => {},
  isDraft: false,
  discardDraft: () => {}
})
