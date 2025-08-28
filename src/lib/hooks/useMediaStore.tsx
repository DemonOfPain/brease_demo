import { MediaStore, Media, StoreOperationOptions } from '@/interface/media'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { useSiteStore } from './useSiteStore'
import { toast } from '@/components/shadcn/ui/use-toast'
import { useUserStore } from './useUserStore'

export const useMediaStore = create<MediaStore>()(
  subscribeWithSelector((set, get) => ({
    loading: false,
    mediaLib: [],
    previewItem: {} as Media,

    setPreviewItem: (item: Media) => set({ previewItem: item }),
    setLoading: (isLoading) => set({ loading: isLoading }),

    getLibrary: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media`,
            {
              method: 'GET'
            }
          ),
        (res) => {
          set({ mediaLib: res.data.media })
        }
      )
    },
    getMedia: async (mediaId: string) => {
      let response = {} as BreaseAPIResponse
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media/${mediaId}`,
            {
              method: 'GET'
            }
          ),
        (res) => {
          response = res
        }
      )
      return response
    },
    upload: async (mediaData: any, customUrl?: string, options?: StoreOperationOptions) => {
      let response = {} as BreaseAPIResponse
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media`,
            {
              method: 'POST',
              body: mediaData
            }
          ),
        (res) => {
          response = res
          set({ mediaLib: [res.data.medium, ...get().mediaLib!] })
        },
        options
      )
      return response
    },
    edit: async (mediaData: any, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media/${get().previewItem.uuid}`,
            {
              method: 'PUT',
              body: mediaData
            }
          ),
        (res) => {
          set({ previewItem: res.data.medium })
          get().getLibrary()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    delete: async (mediaId: string, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media/${mediaId}`,
            { method: 'DELETE' }
          ),
        (res) => {
          get().getLibrary()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    // Download fn is a custom one, the fetchBreaseAPI helper can't be used here since it expects a BreaseAPIResponse, see route.ts
    download: async (mediaId: string) => {
      const response = await fetch(
        `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/media/${mediaId}/download`,
        { method: 'GET' }
      )

      if (!response.ok) {
        throw new Error('Failed to download media')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = get().previewItem.name || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    }
  }))
)

export function initializeMediaStoreSubscriptions() {
  useSiteStore.subscribe(
    (state) => state.environment,
    (environment) => {
      if (environment?.uuid) {
        useMediaStore.getState().getLibrary()
      }
    }
  )
}
setTimeout(() => {
  initializeMediaStoreSubscriptions()
}, 0)
