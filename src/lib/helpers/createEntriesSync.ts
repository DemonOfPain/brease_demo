import { CollectionEntry, CollectionEntrySync } from '@/interface/manager'

export const createEntriesSync = (entries: CollectionEntry[]): CollectionEntrySync[] => {
  return entries.map((e) => {
    return { id: e.uuid, disabled: e.disabled, status: e.status }
  })
}
