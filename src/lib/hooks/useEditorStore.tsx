import { EditorItemType, Section, EditorStore, EditorSync, Collection } from '@/interface/editor'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { toast } from '@/components/shadcn/ui/use-toast'
import { useUserStore } from './useUserStore'
import { useSiteStore } from './useSiteStore'

export const useEditorStore = create<EditorStore>()(
  subscribeWithSelector((set, get) => ({
    editorType: 'sections',
    loading: false,
    activeSection: {} as Section,
    activeCollection: {} as Collection,
    sections: [],
    collections: [],
    elements: [],

    setLoading: (isLoading: boolean) => set({ loading: isLoading }),
    setEditorType: (type: EditorItemType) => set({ editorType: type }),
    setActiveSection: (section: Section) => {
      set({
        activeSection: section
      })
    },
    setActiveCollection: (collection: Collection) => {
      set({
        activeCollection: collection
      })
    },

    getElements: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () => fetch(`/api/elements`, { method: 'GET' }),
        (res) => set({ elements: res.data.elements })
      )
    },
    getSections: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/sections`,
            { method: 'GET' }
          ),
        (res) => set({ sections: res.data.sections })
      )
    },
    getCollections: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/collections`,
            { method: 'GET' }
          ),
        (res) => set({ collections: res.data.collections })
      )
    },
    create: async (itemData: any) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/${get().editorType}`,
            { method: 'POST', body: itemData }
          ),
        (res) => {
          get().editorType === 'sections' ? get().getSections() : get().getCollections()
          toast({ variant: 'success', title: res.message })
        }
      )
    },
    update: async (itemData: any) => {
      const itemId =
        get().editorType === 'sections' ? get().activeSection.uuid : get().activeCollection.uuid
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/${get().editorType}/${itemId}`,
            { method: 'PUT', body: itemData }
          ),
        (res) => {
          get().editorType === 'sections'
            ? set({ activeSection: res.data.section })
            : set({ activeCollection: res.data.collection })
          get().editorType === 'sections' ? get().getSections() : get().getCollections()
          toast({ variant: 'success', title: res.message })
        }
      )
    },
    delete: async () => {
      const itemId =
        get().editorType === 'sections' ? get().activeSection.uuid : get().activeCollection.uuid
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/${get().editorType}/${itemId}`,
            { method: 'DELETE' }
          ),
        (res) => {
          get().editorType === 'sections'
            ? set({ activeSection: {} as Section })
            : set({ activeCollection: {} as Collection })
          get().editorType === 'sections' ? get().getSections() : get().getCollections()
          toast({ variant: 'success', title: res.message })
        }
      )
    },
    sync: async (syncData: EditorSync) => {
      const itemId =
        get().editorType === 'sections' ? get().activeSection.uuid : get().activeCollection.uuid
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/${get().editorType}/${itemId}/elements`,
            { method: 'POST', body: JSON.stringify(syncData) }
          ),
        (res) => {
          if (get().editorType === 'sections') {
            set({ activeSection: res.data.section })
            get().getSections()
          } else {
            set({ activeCollection: res.data.collection })
            get().getCollections()
          }
          toast({ variant: 'success', title: res.message })
        }
      )
    }
  }))
)

export function initializeEditorStoreSubscriptions() {
  useSiteStore.subscribe(
    (state) => state.environment,
    (environment) => {
      if (environment?.uuid) {
        useEditorStore.getState().getSections()
        useEditorStore.getState().getCollections()
        useEditorStore.getState().getElements()
      }
    }
  )
}
setTimeout(() => {
  initializeEditorStoreSubscriptions()
}, 0)
