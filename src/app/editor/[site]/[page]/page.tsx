'use client'

import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { EditorLoader } from '@/components/editor/layout/EditorLoader'
import { useBuilderStore } from '@/lib/hooks/useBuilderStore'
import { useStore } from 'zustand'
import { useBuilderDrafts } from '@/lib/hooks/useBuilderDrafts'
import dynamic from 'next/dynamic'
import { useSiteStore } from '@/lib/hooks/useSiteStore'

const BuilderMain = dynamic(
  () => import('@/components/editor/builder/BuilderMain').then((mod) => mod.BuilderMain),
  { ssr: true, loading: () => <EditorLoader /> }
)

export default function PageBuilderPage() {
  const params = useParams()
  const pageId = params.page as string

  const builderStore = useStore(useBuilderStore)
  const siteStore = useStore(useSiteStore)
  const site = useSiteStore((state) => state.site)
  const pageContent = useBuilderStore((state) => state.pageContent)

  useEffect(() => {
    if (site.uuid) {
      builderStore.getPageContent(pageId)
      siteStore.getSitePage(pageId)
    }
  }, [pageId, site])

  const {
    pageContentClone,
    setPageContentClone,
    isDraft,
    isSectionDirty,
    discardDraft,
    discardSection
  } = useBuilderDrafts(pageContent)

  if (
    !pageContent?.uuid ||
    !pageContentClone?.uuid ||
    pageContent?.uuid != pageContentClone?.uuid
  ) {
    return <EditorLoader />
  }

  return (
    <BuilderDraftContext.Provider
      value={{
        setPageContentClone,
        pageContentClone,
        isDraft,
        isSectionDirty,
        discardSection,
        discardDraft
      }}
    >
      <BuilderMain />
    </BuilderDraftContext.Provider>
  )
}
