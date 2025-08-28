import { useCallback, useEffect, useRef, useState } from 'react'
import { useBuilderStore } from './useBuilderStore'
import { PageContent } from '@/interface/builder'
import { SiteDetail, SitePage } from '@/interface/site'
import { toast } from '@/components/shadcn/ui/use-toast'
import { debounce } from 'lodash'

export const useLivePreview = (
  pageContentClone: PageContent,
  site: SiteDetail,
  page: SitePage,
  onRefreshStart?: () => void
) => {
  const { setActiveContent, setContentEditorOpen } = useBuilderStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [previewData, setPreviewData] = useState<{ uuid: string; scrollY: number } | null>(null)
  const [iframeUrl, setIframeUrl] = useState<string>('')

  // Use refs to store current values for the debounced function
  const currentSiteRef = useRef(site)
  const currentPageRef = useRef(page)
  const currentPreviewDataRef = useRef(previewData)

  // Update refs when values change
  useEffect(() => {
    currentSiteRef.current = site
  }, [site])

  useEffect(() => {
    currentPageRef.current = page
  }, [page])

  useEffect(() => {
    currentPreviewDataRef.current = previewData
  }, [previewData])

  useEffect(() => {
    const directUrl = `${site.previewDomain}${page.slug}`
    setIframeUrl(directUrl)
  }, [site.previewDomain, page.slug])

  const refreshIframe = () => {
    if (onRefreshStart) {
      onRefreshStart()
    }

    if (iframeRef.current) {
      const currentSite = currentSiteRef.current
      const currentPage = currentPageRef.current
      const currentPreviewData = currentPreviewDataRef.current

      const baseUrl = currentPreviewData
        ? `${currentSite.previewDomain}${currentPage.slug}#${currentPreviewData.uuid}`
        : `${currentSite.previewDomain}${currentPage.slug}`

      // Force reload by adding timestamp parameter to bypass cache
      const separator = baseUrl.includes('?') ? '&' : '?'
      const reloadUrl = `${baseUrl}${separator}t=${Date.now()}`
      iframeRef.current.src = reloadUrl
    } else {
      console.error('iframe ref not available')
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      switch (event.data.action) {
        case 'BreaseEditSection':
          //console.log(event.data)
          setPreviewData(event.data.data)
          break
        case 'BreaseEditSectionConsole':
          //console.log(event.data.data)
          break
        default:
          break
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    if (previewData) {
      const selectedSection = pageContentClone.sections.find((s) => s.uuid === previewData.uuid)
      if (!selectedSection) {
        toast({ variant: 'error', title: 'Selected section does not exist!' })
        return
      }
      setActiveContent(selectedSection!)
      setContentEditorOpen(true)
    }
  }, [previewData])

  // Create debounced refresh function that gets recreated when page.slug changes
  const debounceRefresh = useCallback(debounce(refreshIframe, 2000), [page.slug])
  useEffect(() => {
    debounceRefresh()
  }, [pageContentClone, debounceRefresh])
  // Cancel debounced function when page.slug changes to prevent stale refreshes
  useEffect(() => {
    return () => {
      debounceRefresh.cancel()
    }
  }, [page.slug, debounceRefresh])

  useEffect(() => {
    const handleIframeError = (error: ErrorEvent) => {
      console.error('Iframe loading error:', error)
      toast({
        variant: 'error',
        title: 'Failed to load preview',
        description: 'There was an error loading the preview. Check console for details.'
      })
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('error', handleIframeError)
      return () => iframe.removeEventListener('error', handleIframeError)
    }
  }, [iframeRef.current])

  return { iframeRef, previewData, iframeUrl, refreshIframe }
}
