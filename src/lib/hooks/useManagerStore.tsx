import { Collection } from '@/interface/editor'
import {
  CollectionEntry,
  CollectionEntryContent,
  CollectionEntrySync,
  ManagerStore,
  StoreOperationOptions
} from '@/interface/manager'
import { create } from 'zustand'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { toast } from '@/components/shadcn/ui/use-toast'
import { useUserStore } from './useUserStore'
import { useSiteStore } from './useSiteStore'
import { useEditorStore } from './useEditorStore'
import { createEntriesSync } from '../helpers/createEntriesSync'

export const useManagerStore = create<ManagerStore>()((set, get) => ({
  loading: false,
  locale: 'en', //default locale
  allEntries: null,
  collection: {} as Collection,
  entries: null,
  entry: {} as CollectionEntry,
  entryContent: {} as CollectionEntryContent,
  elementValues: {} as Record<string, any>,

  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  setLocale: (locale: string) => {
    set({ entries: null })
    set({ locale: locale })
    if (get().collection.uuid) get().getCollectionEntries()
    if (get().entry.uuid) get().getEntryContent()
  },
  setCollection: (collection: Collection) => {
    set({ collection: collection })
    if (collection.uuid) get().getCollectionEntries()
  },
  setEntry: (entry: CollectionEntry) => {
    set({ entry: entry })
    if (entry.uuid) get().getEntryContent()
  },
  setEntryContent: (content: CollectionEntryContent) => set({ entryContent: content }),
  setElementValues: (values: Record<string, any>) => set({ elementValues: values }),

  getAllEntries: async (options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/entries`,
          { method: 'GET' }
        ),
      (res) => {
        set({ allEntries: res.data.entries })
      },
      options
    )
  },
  getCollectionEntries: async (collectionId?: string, options?: StoreOperationOptions) => {
    let entries: CollectionEntry[] = []
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${collectionId || get().collection.uuid}/entries?locale=${get().locale}`,
          { method: 'GET' }
        ),
      (res) => {
        collectionId ? (entries = res.data.entries) : set({ entries: res.data.entries })
      },
      options
    )
    if (collectionId) return entries
  },
  addEntry: async (entryData: any, customUrl?: string, options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries`,
          { method: 'POST', body: entryData }
        ),
      (res) => {
        get().getAllEntries()
        get().getCollectionEntries()
        if (options?.showSuccessToast !== false) {
          toast({ variant: 'success', title: res.message })
        }
        get().setEntry(res.data.entry)
      },
      options
    )
  },
  deleteEntry: async (entryId: string, customUrl?: string, options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries/${entryId}`,
          { method: 'DELETE' }
        ),
      (res) => {
        get().getAllEntries()
        get().getCollectionEntries()
        if (get().entry.uuid === entryId) {
        }
        if (options?.showSuccessToast !== false) {
          toast({ variant: 'success', title: res.message })
        }
      },
      options
    )
  },
  updateEntry: async (
    entryId: string,
    entryData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries/${entryId}?locale=${get().locale}`,
          { method: 'PUT', body: entryData }
        ),
      (res) => {
        set({
          entry: {
            ...get().entry,
            name: res.data.entry.name,
            status: res.data.entry.status
          }
        })
        if (options?.showSuccessToast !== false) {
          toast({ variant: 'success', title: res.message })
        }
        get().getAllEntries()
        get().getCollectionEntries()
      },
      options
    )
  },
  syncEntries: async (
    entryIds: CollectionEntrySync[],
    customUrl?: string,
    options?: StoreOperationOptions
  ) => {
    let response = {} as BreaseAPIResponse
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries/order`,
          { method: 'POST', body: JSON.stringify(entryIds) }
        ),
      // eslint-disable-next-line no-unused-vars
      (res) => {
        response = res
        get().getCollectionEntries()
      },
      options
    )
    return response
  },
  getEntryContent: async (options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries/${get().entry.uuid}/contents?locale=${get().locale}`,
          { method: 'GET' }
        ),
      (res) => set({ entryContent: res.data.entryContent }),
      options
    )
  },
  syncContent: async (
    contentSync: any,
    publish?: boolean,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections/${get().collection.uuid}/entries/${get().entry.uuid}/contents?locale=${get().locale}`,
          { method: 'POST', body: JSON.stringify(contentSync) }
        ),
      async (res) => {
        if (!publish) {
          const newContent = res.data.entryContent
          const newEntry = res.data.entry
          const updatedEntries = get().entries?.map((entry) =>
            entry.uuid === newEntry.uuid ? newEntry : entry
          )
          set({ entries: updatedEntries })
          set({ entryContent: newContent })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        } else {
          const newContent = res.data.entryContent
          const newEntry = { ...res.data.entry, status: 'published' }
          const updatedEntries = get().entries?.map((entry) =>
            entry.uuid === newEntry.uuid ? newEntry : entry
          ) as CollectionEntry[]
          set({ entries: updatedEntries })
          set({ entryContent: newContent })
          const syncArray = createEntriesSync(updatedEntries)
          const syncRes = await get().syncEntries(syncArray)
          if (syncRes.ok && options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: 'Entry saved and published!' })
          }
        }
      },
      options
    )
  }
}))

export function initializeManagerStoreSubscriptions() {
  useSiteStore.subscribe(
    (state) => state.environment,
    (environment) => {
      if (environment?.uuid) {
        useManagerStore.getState().getAllEntries()
      }
    }
  )
  useEditorStore.subscribe(
    (state) => state.collections,
    (collections) => {
      if (collections) {
        if (collections.filter((c) => c.status != 'unplublished').length != 0) {
          const initCollection = collections.filter((c) => c.status != 'unplublished')[0]
          useManagerStore.getState().setCollection(initCollection)
        }
      }
    }
  )
}
setTimeout(() => {
  initializeManagerStoreSubscriptions()
}, 0)
