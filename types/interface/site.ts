/* eslint-disable no-unused-vars */
import { SiteUser, User } from './user'
import { StoreOperationOptions } from './manager'

// Re-export StoreOperationOptions for convenience
export type { StoreOperationOptions }

//TODO: fix returns in store
export interface SiteStore {
  loading: boolean
  sites: SiteDetail[] | null
  site: SiteDetail
  environments: SiteEnvironment[] | null
  environment: SiteEnvironment
  pages: SitePage[] | null
  page: SitePage
  pageDetailsLocale: string
  locales: SiteLocale[] | null
  allLocales: SiteLocale[] | null
  navigationLocale: string
  navigations: SiteNavigation[] | null
  currentNavigation: SiteNavigation
  navigationItems: SiteNavigationItem[] | null
  navigationSync: SiteNavigationSync
  tokens: SiteToken[] | null
  redirects: SiteRedirect[] | null

  setLoading: (isLoading: boolean) => void
  setSite: (site: SiteDetail) => void
  setEnvironment: (env: SiteEnvironment) => void
  setPageDetailsLocale: (locale: string) => void
  setNavigationLocale: (locale: string) => void
  setCurrentNavigation: (nav: SiteNavigation) => void
  setNavigationItems: (items: SiteNavigationItem[]) => void
  setSiteNavigationSync: (sync: SiteNavigationSync) => void
  emptySiteStates: () => void

  getAllSites: () => Promise<any>
  getSite: (siteId: string) => Promise<void>
  updateSite: (siteData: any, options?: StoreOperationOptions) => Promise<void>
  createSite: (siteData: any, customUrl?: string, options?: StoreOperationOptions) => Promise<any>
  deleteSite: (siteId: string, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  getAllSiteEnvironments: () => Promise<void>
  getSiteEnvironment: (envId: string) => Promise<void>
  getAllLocales: () => Promise<any>
  getAllSiteLocales: () => Promise<any>
  addSiteLocale: (
    localeData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  updateSiteLocale: (
    localeData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  deleteSiteLocale: (
    localeData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  getAllSitePages: () => Promise<void>
  getSitePage: (pageId: string) => Promise<void>
  createPage: (pageData: any, customUrl?: string, options?: StoreOperationOptions) => Promise<any>
  updatePage: (pageData: any, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  deletePage: (pageId: string, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  getAllNavigations: () => Promise<void>
  addNavigation: (
    navData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  updateNavigation: (
    navId: string,
    navData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  deleteNavigation: (
    navId: string,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  getNavigationItems: () => Promise<void>
  addNavigationItem: (
    navItemData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  updateNavigationItem: (
    navItemId: string,
    navItemData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  deleteNavigationItem: (
    navItemId: string,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  syncNavigation: () => Promise<void>
  getTokens: () => Promise<void>
  createToken: (tokenData: Omit<SiteToken, 'uuid' | 'token'>) => Promise<void>
  deleteToken: (tokenId: string) => Promise<void>
  getRedirects: () => Promise<void>
  addRedirect: (
    redirectData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  updateRedirect: (
    redirectId: string,
    redirectData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
  deleteRedirect: (
    redirectId: string,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<void>
}

export interface Site {
  uuid: string
  name: string
  title: string | null
  domain: string
  previewDomain: string | null
  thumbnail: string | null
  siteAvatar: string | null
  published: boolean
  status: string
}

export interface SiteDetail extends Site {
  // settings: SiteDetailSettings
  users: SiteUser[]
  environments: SiteEnvironment[]
  sitemapIndexing: boolean
  defaultEnvironmentUuid: string
  defaultPageUuid: string
  variables: string // JSON
}

export type SiteEnvironment = {
  name: string
  uuid: string
  locales: SiteLocale[]
  isProtected: boolean
}

export type SiteLocale = {
  code: string
  name: string
  status: 'active' | 'inactive'
  uuid: string
}

export type SiteDetailSettings = {
  seo: SiteSEO
}

export type SiteSEO = {
  seoTitle: string
  metaDesc: string
  ogTitle: string
  ogDesc: string
  ogImg: any // url or img?
}

export type SitePage = {
  uuid: string
  name: string
  slug: string
  lastEditor: {
    created: Date
    createdHuman: string
    user: User
  }
  indexing: boolean
  customcode: any
  metaDescription: string
  openGraphTitle: string
  openGraphDescription: string
  openGraphImage: any
  parent: {
    name: string
    slug: string
    uuid: string
  }
  variables: string // JSON
}

export type SiteNavigation = {
  uuid: string
  name: string
  description: string
  items: SiteNavigationItem[]
}

export type SiteNavigationItem = {
  uuid: string
  value: string
  target: {
    type: 'page' | 'medium' | 'entry' | 'url' | 'placeholder'
    uuid?: string //if type page, media or entry
    url?: string // if type external
  }
  children: SiteNavigationItem[]
  parent: string | null //parent nav item uuid
}

export type SiteNavigationSync = SiteNavigationSyncItem[]

export type SiteNavigationSyncItem = {
  id: string
  children: SiteNavigationSyncItem[]
}

export type SiteToken = {
  uuid: string
  name: string
  token: string
  livePreview: boolean
  expiry_at: Date | null
}

export type SiteRedirect = {
  uuid: string
  source: string
  destination: string
  type: 301 | 302 | 307 | 308
}
