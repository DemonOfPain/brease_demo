import { MEDIA_LIB_ALLOWED_MIME_TYPES } from '@/components/media-library/MEDIA_LIB_ALLOWED_MIME_TYPES'
import { BreaseAPIResponse } from '@/lib/helpers/fetchAPIwithToken'
import { StoreOperationOptions } from './manager'

// Re-export StoreOperationOptions for convenience
export type { StoreOperationOptions }

/* eslint-disable no-unused-vars */
export interface MediaStore {
  loading: boolean
  mediaLib: Media[] | null
  previewItem: Media
  setPreviewItem: (item: Media) => void
  setLoading: (isLoading: boolean) => void
  getLibrary: () => Promise<void>
  getMedia: (mediaId: string) => Promise<any>
  upload: (
    mediaData: any,
    customUrl?: string,
    options?: StoreOperationOptions
  ) => Promise<BreaseAPIResponse>
  edit: (mediaData: any, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  delete: (mediaId: string, customUrl?: string, options?: StoreOperationOptions) => Promise<void>
  download: (mediaId: string) => Promise<any>
}

export type Media = {
  uuid: string
  name: string
  size: string
  path: string
  extension: string
  mimeType: (typeof MEDIA_LIB_ALLOWED_MIME_TYPES)[number]
  mimeGroup: MediaMimeGroup
  thumbnail: string | null // image & video
  width: number | null //image
  height: number | null // image
  duration: number | null // video
  alt: string | null // image
}

export enum MediaMimeGroup {
  image = 'image',
  video = 'video',
  audio = 'audio',
  document = 'document',
  archive = 'archive'
}
