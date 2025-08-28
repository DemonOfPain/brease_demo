import { createContext } from 'react'
import { EditorItem } from '@/interface/editor'

interface EditorDraftContextType {
  originalItems: EditorItem[]
  itemClone: EditorItem
  // eslint-disable-next-line no-unused-vars
  setItemClone: (itemOrUpdater: EditorItem | ((prev: EditorItem) => EditorItem)) => void
  // eslint-disable-next-line no-unused-vars
  setActiveItem: (item: EditorItem) => void
}

export const EditorDraftContext = createContext<EditorDraftContextType>(
  {} as EditorDraftContextType
)
