import {
  SiteDetail,
  SiteEnvironment,
  SitePage,
  SiteStore,
  SiteNavigation,
  SiteNavigationItem,
  SiteToken,
  StoreOperationOptions
} from '@/interface/site'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { fetchBreaseAPI } from '../helpers/fetchBreaseAPI'
import { toast } from '@/components/shadcn/ui/use-toast'
import { BreaseAPIResponse } from '../helpers/fetchAPIwithToken'
import { useUserStore } from './useUserStore'
import { isEqual } from 'lodash'
import { createNavigationSync } from '../helpers/createNavigationSync'
import { useEditorStore } from './useEditorStore'
import { useManagerStore } from './useManagerStore'

export const useSiteStore = create<SiteStore>()(
  subscribeWithSelector((set, get) => ({
    loading: false,
    // Site
    sites: null,
    site: {} as SiteDetail,
    // Environments
    environments: null,
    environment: {} as SiteEnvironment,
    // Pages
    pages: null,
    page: {} as SitePage,
    pageDetailsLocale: 'en',
    // Locales
    locales: null,
    allLocales: null,
    // Navigations
    navigationLocale: 'en',
    navigations: null,
    currentNavigation: {} as SiteNavigation,
    navigationItems: null,
    navigationSync: [],
    tokens: null,
    // Redirects
    redirects: null,

    setLoading: (isLoading: boolean) => set({ loading: isLoading }),
    setSite: (newSite: SiteDetail) => {
      if (!newSite.uuid) return
      set({ site: newSite })
      set({
        locales: newSite.environments.find(
          (env: SiteEnvironment) => env.name === 'main' || env.name === 'master'
        )!.locales
      })
      set({ environments: newSite.environments })
      set({
        environment: newSite.environments.find(
          (env: SiteEnvironment) => env.name === 'main' || env.name === 'master'
        )
      })
    },
    setEnvironment: (env: SiteEnvironment) => {
      set({ environment: env })
      set({ locales: env.locales })
    },
    setPageDetailsLocale(locale) {
      set({ pageDetailsLocale: locale })
      get().getSitePage(get().page.uuid)
    },
    setNavigationLocale(locale) {
      set({ navigationLocale: locale })
    },
    setCurrentNavigation: (nav: SiteNavigation) => {
      set({ currentNavigation: nav })
      if (nav.uuid) get().setNavigationItems(nav.items)
    },
    setNavigationItems: (items: SiteNavigationItem[]) => {
      set({ navigationItems: items })
      if (get().currentNavigation.uuid && !isEqual(get().currentNavigation.items, items)) {
        set({ navigationSync: createNavigationSync(items) })
      }
    },
    setSiteNavigationSync(sync) {
      set({ navigationSync: sync })
    },
    emptySiteStates: () => {
      set({ site: {} as SiteDetail })
      set({ environments: null })
      set({ environment: {} as SiteEnvironment })
      set({ pages: null })
      set({ page: {} as SitePage })
      set({ locales: null })
      set({ redirects: null })
      useEditorStore.setState({ collections: null })
      useEditorStore.setState({ sections: null })
      useManagerStore.setState({ allEntries: null })
    },

    getAllSites: async () => {
      set({ loading: true })
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(`/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites`, {
            method: 'GET'
          }),
        (res) => {
          set({ sites: res.data.sites })
          if (get().site.uuid) get().emptySiteStates()
        }
      )
      set({ loading: false })
    },
    getSite: async (siteId: string) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(`/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${siteId}`, {
            method: 'GET'
          }),
        (res) => {
          get().setSite(res.data.site)
        }
      )
    },
    createSite: async (siteData: FormData, customUrl?: string, options?: StoreOperationOptions) => {
      let response = {}
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(customUrl || `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites`, {
            method: 'POST',
            body: JSON.stringify(siteData)
          }),
        (res) => {
          get().getAllSites()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
          response = res
        },
        options
      )
      return response
    },
    updateSite: async (siteData: Partial<SiteDetail>, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}`,
            {
              method: 'PUT',
              body: JSON.stringify(siteData)
            }
          ),
        (res) => {
          set({ site: res.data.site })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deleteSite: async (siteId: string, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${siteId}`,
            {
              method: 'DELETE'
            }
          ),
        (res) => {
          get().getAllSites()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    getAllSiteEnvironments: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments`,
            { method: 'GET' }
          ),
        (res) => {
          set({ environments: res.data.environments })
        }
      )
    },
    getSiteEnvironment: async (envId: string) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${envId}`,
            { method: 'GET' }
          ),
        (res) => {
          //TODO: implement
          console.log(res)
          //toast({variant: 'success',title: res.message})
        }
      )
    },
    getAllLocales: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () => fetch(`/api/locales`, { method: 'GET' }),
        (res) => set({ allLocales: res.data.locales })
      )
    },
    getAllSiteLocales: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/locales`,
            { method: 'GET' }
          ),
        (res) => set({ locales: res.data.locales })
      )
    },
    addSiteLocale: async (localeData: any, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/locales`,
            { method: 'POST', body: localeData }
          ),
        (res) => {
          set({ locales: res.data.locales })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    updateSiteLocale: async (
      localeData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/locales`,
            { method: 'PUT', body: localeData }
          ),
        (res) => {
          set({ locales: res.data.locales })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deleteSiteLocale: async (
      localeData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/locales`,
            { method: 'DELETE', body: localeData }
          ),
        (res) => {
          set({ locales: res.data.locales })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    getAllSitePages: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/pages`,
            { method: 'GET' }
          ),
        (res) => set({ pages: res.data.pages })
      )
    },
    getSitePage: async (pageId: string) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/pages/${pageId}?locale=${get().pageDetailsLocale}`,
            { method: 'GET' }
          ),
        (res) => set({ page: res.data.page })
      )
    },
    createPage: async (pageData: FormData, customUrl?: string, options?: StoreOperationOptions) => {
      let response = {}
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/pages`,
            { method: 'POST', body: pageData }
          ),
        (res) => {
          get().getAllSitePages()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
          response = res
        },
        options
      )
      return response
    },
    updatePage: async (pageData: FormData, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments//${get().environment.uuid}/pages/${get().page.uuid}?locale=${get().pageDetailsLocale}`,
            { method: 'PUT', body: pageData }
          ),
        (res) => {
          set({ page: res.data.page })
          get().getAllSitePages()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deletePage: async (pageId: string, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/pages/${pageId}`,
            { method: 'DELETE' }
          ),
        (res) => {
          get().getAllSitePages()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    getAllNavigations: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations`,
            { method: 'GET' }
          ),
        (res) => {
          set({ navigations: res.data.navigations })
          if (get().currentNavigation.uuid) {
            set({
              currentNavigation: res.data.navigations.find(
                (n: SiteNavigation) => n.uuid === get().currentNavigation.uuid
              )
            })
          }
        }
      )
    },
    addNavigation: async (navData: string, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations`,
            { method: 'POST', body: navData }
          ),
        (res) => {
          get().getAllNavigations()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deleteNavigation: async (
      navId: string,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${navId}`,
            { method: 'DELETE' }
          ),
        (res) => {
          get().getAllNavigations()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    updateNavigation: async (
      navId: string,
      navData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${navId}`,
            { method: 'PUT', body: navData }
          ),
        (res) => {
          get().getAllNavigations()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    //? not in use currently
    getNavigationItems: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${get().currentNavigation.uuid}/contents?locale=${get().navigationLocale}`,
            { method: 'GET' }
          ),
        (res) => {
          set({ navigationItems: res.data.items })
        }
      )
    },
    addNavigationItem: async (
      navItemData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${get().currentNavigation.uuid}/items?locale=${get().navigationLocale}`,
            { method: 'POST', body: JSON.stringify(navItemData) }
          ),
        async (res) => {
          await get().getAllNavigations()
          set({ navigationItems: res.data.navigation_items })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deleteNavigationItem: async (
      navItemId: string,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${get().currentNavigation.uuid}/items/${navItemId}?locale=${get().navigationLocale}`,
            { method: 'DELETE' }
          ),
        async (res) => {
          await get().getAllNavigations()
          set({ navigationItems: res.data.navigation_items })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    updateNavigationItem: async (
      navItemId: string,
      navItemData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${get().currentNavigation.uuid}/items/${navItemId}?locale=${get().navigationLocale}`,
            { method: 'PUT', body: JSON.stringify(navItemData) }
          ),
        async (res) => {
          await get().getAllNavigations()
          set({ navigationItems: res.data.navigation_items })
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    syncNavigation: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/navigations/${get().currentNavigation.uuid}/sync?locale=${get().navigationLocale}`,
            { method: 'POST', body: JSON.stringify(get().navigationSync) }
          ),
        async (res) => {
          await get().getAllNavigations()
          set({ navigationItems: res.data.navigation_items })
        }
      )
    },
    getTokens: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/tokens`,
            { method: 'GET' }
          ),
        async (res) => {
          set({ tokens: res.data.tokens })
        }
      )
    },
    createToken: async (tokenData: Omit<SiteToken, 'uuid' | 'token'>) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/tokens`,
            { method: 'POST', body: JSON.stringify(tokenData) }
          ),
        async (res) => {
          set({ tokens: [...(get().tokens as SiteToken[]), res.data.token] })
          toast({ variant: 'success', title: res.message })
        }
      )
    },
    deleteToken: async (tokenId: string) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/tokens/${tokenId}`,
            { method: 'DELETE' }
          ),
        async (res) => {
          set({ tokens: get().tokens?.filter((t) => t.uuid !== tokenId) })
          toast({ variant: 'success', title: res.message })
        }
      )
    },
    getRedirects: async () => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/redirects`,
            { method: 'GET' }
          ),
        (res) => {
          set({ redirects: res.data.redirects })
        }
      )
    },
    addRedirect: async (redirectData: any, customUrl?: string, options?: StoreOperationOptions) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/redirects`,
            { method: 'POST', body: redirectData }
          ),
        (res) => {
          get().getRedirects()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    updateRedirect: async (
      redirectId: string,
      redirectData: any,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/redirects/${redirectId}`,
            { method: 'PUT', body: redirectData }
          ),
        (res) => {
          get().getRedirects()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    },
    deleteRedirect: async (
      redirectId: string,
      customUrl?: string,
      options?: StoreOperationOptions
    ) => {
      await fetchBreaseAPI<{ res: BreaseAPIResponse }>(
        () =>
          fetch(
            customUrl ||
              `/api/teams/${useUserStore.getState().user.currentTeam.uuid}/sites/${get().site.uuid}/environments/${get().environment.uuid}/redirects/${redirectId}`,
            { method: 'DELETE' }
          ),
        (res) => {
          get().getRedirects()
          if (options?.showSuccessToast !== false) {
            toast({ variant: 'success', title: res.message })
          }
        },
        options
      )
    }
  }))
)

export function initializeStoreSubscriptions() {
  useUserStore.subscribe(
    (state) => state.user,
    (user) => {
      if (user.currentTeam?.uuid) {
        useSiteStore.getState().getAllSites()
      }
    }
  )
  useSiteStore.subscribe(
    (state) => state.environment,
    (environment) => {
      if (environment?.uuid) {
        useSiteStore.getState().getAllSitePages()
        useSiteStore.getState().getAllNavigations()
        useSiteStore.getState().getRedirects()

        // Ensure assistant has tabs for the new environment
        const { useAssistantStore } = require('./useAssistantStore')
        useAssistantStore.getState().ensureEnvironmentTab()
      }
    }
  )
}
setTimeout(() => {
  initializeStoreSubscriptions()
}, 0)
