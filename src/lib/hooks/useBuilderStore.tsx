import {
  BuilderStore,
  PageContent,
  PageContentSection,
  StoreOperationOptions
} from '@/interface/builder'
import { create } from 'zustand'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { toast } from '@/components/shadcn/ui/use-toast'
import { useSiteStore } from './useSiteStore'
import { useUserStore } from './useUserStore'
import { useEditorStore } from './useEditorStore'

export const useBuilderStore = create<BuilderStore>()((set, get) => ({
  loading: false,
  contentEditorOpen: false,
  locale: 'en', // default locale
  pageContent: {} as PageContent,
  activeContent: {} as PageContentSection,
  elementValues: {} as Record<string, any>,
  selectedSections: [],

  setLoading: (isLoading: boolean) => set({ loading: isLoading }),
  setContentEditorOpen: (open: boolean) => set({ contentEditorOpen: open }),
  setLocale: (locale: string) => {
    set({ locale: locale })
    get().getPageContent(get().pageContent.uuid)
  },
  setPageContent: (content: PageContent) => set({ pageContent: content }),
  setActiveContent: (content: PageContentSection) => set({ activeContent: content }),
  setElementValues: (values: Record<string, any>) => set({ elementValues: values }),
  setSelectedSections: (newSections: PageContentSection[]) =>
    set({ selectedSections: newSections }),

  getPageContent: async (pageId: string, options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/pages/${pageId}/contents?locale=${get().locale}`,
          { method: 'GET' }
        ),
      (res) => set({ pageContent: res.data.pageContent }),
      options
    )
  },
  syncContent: async (
    contentSync: any,
    publish?: boolean,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => {
    let pageContentSection = get().activeContent
    let newContentSection = {} as PageContentSection
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/pages/${get().pageContent.uuid}/contents?locale=${get().locale}`,
          { method: 'POST', body: JSON.stringify(contentSync) }
        ),
      (res) => {
        set({ activeContent: {} as PageContentSection })
        set({ elementValues: {} })
        set({ pageContent: res.data.pageContent })
        if (!publish) {
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        } else {
          newContentSection = res.data.pageContent.sections.find(
            (s: PageContentSection) => s.uuid === pageContentSection.uuid
          ) as PageContentSection
        }
      },
      options
    )
    return newContentSection
  },
  syncSections: async (sectionSync: any, customUrl?: string, options?: StoreOperationOptions) => {
    await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
      () =>
        fetch(
          customUrl ||
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${useSiteStore.getState().site.uuid}/environments/${useSiteStore.getState().environment.uuid}/pages/${get().pageContent.uuid}/section`,
          { method: 'POST', body: JSON.stringify(sectionSync) }
        ),
      (res) => {
        set({ pageContent: res.data.pageContent })
      },
      options
    )
  }
}))

export function initializeEditorStoreSubscriptions() {
  useEditorStore.subscribe(
    (state) => state.collections,
    () => {
      if (useBuilderStore.getState().pageContent.uuid) {
        useBuilderStore.setState({ pageContent: {} as PageContent })
      }
    }
  )
  useEditorStore.subscribe(
    (state) => state.sections,
    () => {
      if (useBuilderStore.getState().pageContent.uuid) {
        useBuilderStore.setState({ pageContent: {} as PageContent })
      }
    }
  )
}
setTimeout(() => {
  initializeEditorStoreSubscriptions()
}, 0)
