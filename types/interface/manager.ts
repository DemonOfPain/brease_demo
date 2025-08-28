/* eslint-disable no-unused-vars */

import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { PageContentMatrixRow } from './builder'
import { Collection } from './editor'

export interface StoreOperationOptions {
  throwOnError?: boolean
  silentError?: boolean
  showSuccessToast?: boolean
  onError?: (data: BreaseAPIResponse) => void
}

export type ManagerStore = {
  loading: boolean
  locale: string
  allEntries: CollectionEntry[] | null
  collection: Collection
  entries: CollectionEntry[] | null
  entry: CollectionEntry
  entryContent: CollectionEntryContent
  elementValues: Record<string, any>
  setLoading: (isLoading: boolean) => void
  setLocale: (locale: string) => void
  setCollection: (collection: Collection) => void
  setEntry: (entry: CollectionEntry) => void
  setEntryContent: (content: CollectionEntryContent) => void
  setElementValues: (values: Record<string, any>) => void
  getAllEntries: (options?: StoreOperationOptions) => Promise<void>
  getCollectionEntries: (
    collectionId?: string,
    options?: StoreOperationOptions
  ) => Promise<void | CollectionEntry[]>
  addEntry: (entryData: any, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  updateEntry: (
    entryId: string,
    entryData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  deleteEntry: (
    entryId: string,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  syncEntries: (
    entries: CollectionEntrySync[],
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<BreaseAPIResponse>
  getEntryContent: (options?: StoreOperationOptions) => Promise<void>
  syncContent: (
    contentSync: any,
    publish?: boolean,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
}

export type CollectionEntry = {
  uuid: string
  name: string
  slug: string | null
  collection: {
    uuid: string
    name: string
  }
  status: 'published' | 'draft'
  disabled: boolean
}

export type CollectionEntrySync = {
  id: string
  status: 'published' | 'draft'
  disabled: boolean
}

export type CollectionEntryContent = {
  //this uuid will always be the same as the one on the CollectionEntry
  uuid: string
  elements: PageContentMatrixRow
}
