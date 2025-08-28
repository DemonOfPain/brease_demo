import { EditorItem } from '@/interface/editor'
import { useEffect, useState } from 'react'
import { compareEditorItems } from '../helpers/compareEditorItems'

export const useEditorDrafts = (
  item: EditorItem,
  // eslint-disable-next-line no-unused-vars
  setActiveItem: (item: EditorItem) => void,
  originalItems: EditorItem[]
) => {
  const [itemClone, setItemClone] = useState<EditorItem>(item)
  const [hasChanged, setHasChanged] = useState<boolean>(false)
  let originalItem = originalItems.find((x) => x.uuid === item.uuid) as EditorItem

  useEffect(() => {
    setItemClone(item)
  }, [item])

  useEffect(() => {
    if (originalItem.uuid != itemClone.uuid) return
    if (compareEditorItems(originalItem, itemClone)) {
      setHasChanged(true)
    } else {
      setHasChanged(false)
    }
  }, [itemClone, originalItem])

  const discardDraft = () => {
    setItemClone(originalItem)
    setActiveItem({} as EditorItem)
  }

  return {
    originalItem,
    itemClone,
    setItemClone,
    isDraft: hasChanged,
    discardDraft
  }
}
