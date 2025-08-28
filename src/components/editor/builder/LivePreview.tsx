import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import { useLivePreview } from '@/lib/hooks/useLivePreview'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import React, { useContext, useRef, useState, useEffect } from 'react'
import { toast } from '@/components/shadcn/ui/use-toast'
import { LoaderCircle } from 'lucide-react'
import { ReloadContext } from './BuilderMain'

export const LivePreview = () => {
  const site = useSiteStore((state) => state.site)
  const page = useSiteStore((state) => state.page)
  const { pageContentClone } = useContext(BuilderDraftContext)
  const { isContentReloading, setIsContentReloading } = useContext(ReloadContext)
  const errorCount = useRef(0)
  const [isLoading, setIsLoading] = useState(true)

  const handleRefreshStart = () => {
    setIsLoading(true)
  }

  const { iframeRef, iframeUrl } = useLivePreview(pageContentClone, site, page, handleRefreshStart)

  useEffect(() => {
    setIsLoading(true)
  }, [iframeUrl])

  const handleLoad = () => {
    errorCount.current = 0
    setIsLoading(false)
    setIsContentReloading(false)
  }

  const handleError = () => {
    errorCount.current += 1
    setIsLoading(false)
    setIsContentReloading(false)

    if (errorCount.current <= 3) {
      console.error(`Iframe loading error (attempt ${errorCount.current})`)

      if (errorCount.current === 3) {
        toast({
          variant: 'error',
          title: 'Preview issue detected',
          description:
            'There was a problem loading the preview. You might need to refresh the page.'
        })
      }
    }
  }

  const loadingMessage = isContentReloading
    ? 'Reloading preview with new content...'
    : 'Loading preview...'
  const shouldShowLoading = isLoading || isContentReloading

  return (
    <div className="preview-container relative w-full h-full">
      {shouldShowLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-2">
            <LoaderCircle className="h-10 w-10 animate-spin text-brease-primary" />
            <p className="text-sm text-brease-gray-9">{loadingMessage}</p>
          </div>
        </div>
      )}
      <iframe
        onLoad={handleLoad}
        onError={handleError}
        ref={iframeRef}
        id="BreaseEditor"
        src={iframeUrl}
        width={'100%'}
        height={'100%'}
        sandbox="allow-scripts allow-same-origin allow-forms"
        className="border-none"
      />
    </div>
  )
}
