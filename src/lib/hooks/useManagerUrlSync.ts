import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useManagerStore } from './useManagerStore'
import { useEditorStore } from './useEditorStore'
import { CollectionEntry, CollectionEntryContent } from '@/interface/manager'

export function useManagerUrlSync() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const {
    collection,
    entry,
    entryContent,
    setCollection,
    setEntry,
    setEntryContent,
    setElementValues,
    loading
  } = useManagerStore()
  const collections = useEditorStore((state) => state.collections)
  const collectionParam = searchParams.get('collection')
  const entryParam = searchParams.get('entry')
  const isProcessingRef = useRef(false)

  // Update URL when collection or entry changes (from user interaction)
  useEffect(() => {
    if (isProcessingRef.current) return
    const params = new URLSearchParams(searchParams.toString())
    let shouldUpdateUrl = false
    if (collection?.uuid && collection.uuid !== collectionParam) {
      params.set('collection', collection.uuid)
      shouldUpdateUrl = true
    }
    if (entry?.uuid && entry.uuid !== entryParam) {
      params.set('entry', entry.uuid)
      shouldUpdateUrl = true
    }
    if (!collection?.uuid && collectionParam) {
      params.delete('collection')
      shouldUpdateUrl = true
    }
    if (!entry?.uuid && entryParam) {
      params.delete('entry')
      shouldUpdateUrl = true
    }
    if (shouldUpdateUrl) {
      const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(url, { scroll: false })
    }
  }, [collection?.uuid, entry?.uuid, collectionParam, entryParam, searchParams, pathname, router])

  // Load content based on URL params
  useEffect(() => {
    if (!collections || collections.length === 0) return
    if (isProcessingRef.current) return
    // If we have URL params, ensure correct content is loaded
    if (collectionParam && entryParam) {
      const urlCollection = collections.find((c) => c.uuid === collectionParam)

      if (!urlCollection) {
        console.warn(`Collection with UUID ${collectionParam} not found`)
        return
      }

      const needsCollection = !collection?.uuid || collection.uuid !== collectionParam
      const needsEntry = !entry?.uuid || entry.uuid !== entryParam
      const hasCorrectContent = entryContent?.uuid === entryParam && entryContent?.elements

      if (!needsCollection && !needsEntry && hasCorrectContent) {
        return
      }

      isProcessingRef.current = true

      if (needsCollection) {
        setCollection(urlCollection)
      }

      // Only call setEntry if we don't have the right entry or content
      if (needsEntry || !hasCorrectContent) {
        setEntry({ uuid: entryParam } as CollectionEntry)
      }
      setTimeout(() => {
        isProcessingRef.current = false
      }, 200)
    }
    // Set default collection if none selected
    else if (!collectionParam && collections.length > 0 && !collection?.uuid) {
      const publishedCollections = collections.filter((c) => c.status !== 'unplublished')
      if (publishedCollections.length > 0) {
        setCollection(publishedCollections[0])
      }
    }
  }, [collections, collectionParam, entryParam])

  // Clear states
  useEffect(() => {
    if (!entryParam && entryContent.uuid) {
      setEntry({} as CollectionEntry)
      setEntryContent({} as CollectionEntryContent)
      setElementValues({})
    }
  }, [entryParam])

  const isContentReady = !!(
    entryContent?.uuid &&
    entryContent?.elements &&
    entryContent.elements.length > 0 &&
    entry?.uuid === entryContent.uuid
  )

  return {
    collectionParam,
    entryParam,
    isValidUrl: !!(collectionParam && entryParam),
    isContentReady,
    isLoading: loading || (entryParam && !isContentReady)
  }
}
