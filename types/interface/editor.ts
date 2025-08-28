/* eslint-disable no-unused-vars */

//TODO: typings => exclude 'any'
export interface EditorStore {
  loading: boolean
  editorType: EditorItemType
  activeSection: Section
  activeCollection: Collection
  sections: Section[] | null
  collections: Collection[] | null
  elements: Element[] | null
  getElements: () => Promise<void>
  getSections: () => Promise<void>
  getCollections: () => Promise<void>
  setLoading: (isLoading: boolean) => void
  setEditorType: (type: EditorItemType) => void
  setActiveSection: (section: Section) => void
  setActiveCollection: (collection: Collection) => void
  create: (data: any) => Promise<void>
  update: (data: any) => Promise<void>
  delete: () => Promise<void>
  sync: (syncData: EditorSync) => Promise<void>
}

export type EditorItem = Section | Collection

export type EditorItemType = 'sections' | 'collections'

export type Section = {
  uuid: string
  name: string
  key: string
  description: string
  pages: EditorPage[] | []
  status: string
  elements: EditorElementMatrix
  thumbnail: string | null
}

export type EditorPage = {
  uuid: string
  name: string
}

export type EditorElementMatrix = EditorElementMatrixRow[] | []

export type EditorElementMatrixRow = EditorElementMatrixSlot[]

export type EditorElementMatrixSlot = {
  uuid: string
  element: Element
  key: string
  size?: number
  data?: any // additional prop to pass any kind of data if needed
}

export type Element = {
  uuid: string
  name: string
  desc: string
  icon: null | string
  type: ElementTypes
}

export enum ElementTypes {
  collection = 'collection',
  json = 'json',
  boolean = 'boolean',
  richtext = 'rich',
  longText = 'text',
  shortText = 'string',
  integer = 'integer',
  decimal = 'float',
  location = 'location',
  media = 'media',
  dateTime = 'datetime',
  link = 'link',
  option = 'option'
}

export type EditorSync = {
  status: 'published' | 'unpublished'
  grid: EditorSyncRow[]
  error?: string
}

export type EditorSyncRow = EditorSyncEntry[]

export type EditorSyncEntry = {
  type: 'update' | 'create'
  id: string
  key: string
  data?: any // additional prop to pass any kind of data if needed
}

export type Collection = Omit<Section, 'key'>
