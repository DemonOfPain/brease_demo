import { CollectionEntryContent } from '@/interface/manager'
import { useManagerStore } from './useManagerStore'
import { useEffect, useState } from 'react'
import { compareManagerContents } from '../helpers/compareManagerContents'
import { useStore } from 'zustand'

export const useManagerDrafts = (entryContent: CollectionEntryContent) => {
  const managerStore = useStore(useManagerStore)
  const contentLocale = useManagerStore((state) => state.locale)
  const [entryContentClone, setEntryContentClone] = useState<CollectionEntryContent>(
    {} as CollectionEntryContent
  )
  const [hasChanged, setHasChanged] = useState<boolean>(false)

  // CollectionEntryContent init
  useEffect(() => {
    if (!entryContent.uuid) return
    setEntryContentClone(entryContent)
    const initialValues: Record<string, any> = {}
    entryContent.elements.forEach((slot) => {
      initialValues[slot.uuid] = {
        id: slot.uuid,
        value: slot.value ?? null
      }
    })
    managerStore.setElementValues(initialValues)
  }, [entryContent])

  // Draft observer
  useEffect(() => {
    if (!entryContentClone?.uuid || !entryContent?.uuid) return
    const contentsChanged = compareManagerContents(entryContent, entryContentClone)
    if (contentsChanged) {
      setHasChanged(true)
    } else {
      setHasChanged(false)
    }
  }, [entryContentClone, entryContent, contentLocale])

  const discardDraft = () => {
    setEntryContentClone(entryContent)
    const initialValues: Record<string, any> = {}
    entryContent.elements.forEach((slot) => {
      initialValues[slot.uuid] = {
        id: slot.uuid,
        value: slot.value ?? null
      }
    })
    managerStore.setElementValues(initialValues)
  }

  return {
    entryContentClone,
    setEntryContentClone,
    isDraft: hasChanged,
    discardDraft
  }
}
