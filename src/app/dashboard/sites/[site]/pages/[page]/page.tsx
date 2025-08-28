'use client'
import { PageDetailsForm } from '@/components/dashboard/sites/pages/PageDetailsForm'
import { DemoPageDetailsWrapper } from '@/components/dashboard/sites/pages/DemoPageDetailsWrapper'
import { FormLoader } from '@/components/generic/form/FormLoader'
import { usePathname } from 'next/navigation'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useStore } from 'zustand'
import { mockData } from '@/lib/mockData'
import { useEffect, useState } from 'react'

export default function SitePageDetail() {
  const siteStore = useStore(useSiteStore)
  const page = useSiteStore((state) => state.page)
  const [mockPage, setMockPage] = useState<any>(null)
  const pageId = usePathname()
    .split('/')
    .filter((x) => x != '')
    .at(-1) as string

  useEffect(() => {
    // Check if this is a demo page (starts with 'page-' followed by timestamp)
    if (pageId.startsWith('page-') && pageId.length > 10) {
      const demoPage = mockData.getPage(pageId)
      if (demoPage) {
        // Convert mock page to match expected format
        setMockPage({
          uuid: demoPage.uuid || demoPage.id,
          name: demoPage.name,
          slug: demoPage.slug,
          metaDescription: demoPage.metaDescription || '',
          indexing: true,
          openGraphTitle: demoPage.title || demoPage.name,
          openGraphDescription: demoPage.metaDescription || '',
          openGraphImage: '',
          parent: null,
          variables: ''
        })
      }
    } else {
      // For non-demo pages, use the store
      if (!page.uuid || page.uuid != pageId) {
        siteStore.getSitePage(pageId)
      }
    }
  }, [pageId])

  // For demo pages, use simplified wrapper
  if (mockPage) {
    return <DemoPageDetailsWrapper page={mockPage} />
  }

  // For regular pages, use store data
  if (!page.uuid || page.uuid != pageId) return <FormLoader />

  return <PageDetailsForm page={page} />
}
