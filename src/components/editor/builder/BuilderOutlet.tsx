import { PageContentSection } from '@/interface/builder'
import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import React, { useContext } from 'react'
import { Text } from '@/components/generic/Text'
import { BuilderOutletItem } from './BuilderOutletItem'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { LivePreview } from './LivePreview'

export const BuilderOutlet = () => {
  const site = useSiteStore((state) => state.site)
  const { pageContentClone } = useContext(BuilderDraftContext)

  if (site.previewDomain) {
    return <LivePreview />
  } else {
    return (
      <div className="w-full h-[calc(100vh-52px)] overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
        {pageContentClone.sections.map((section: PageContentSection) => (
          <BuilderOutletItem key={section.uuid} section={section} />
        ))}
        {pageContentClone.sections.length < 1 && (
          <div className="w-full h-full flex justify-center items-center">
            <Text size="md" style="regular" className="text-brease-gray-7">
              Add sections to build a layout!
            </Text>
          </div>
        )}
      </div>
    )
  }
}
