'use client'
import { CreateSiteCard } from '@/components/dashboard/sites/CreateSiteCard'
import { SitePlaceholderCard } from '@/components/dashboard/sites/SitePlaceholderCard'
import { Text } from '@/components/generic/Text'
import { Title } from '@/components/generic/Title'
import { SiteDetail } from '@/interface/site'
import { useEffect, useState } from 'react'
import { SiteCard } from '@/components/dashboard/sites/SiteCard'
import { mockData } from '@/lib/mockData'

export default function SitesPage() {
  const [published, setPublished] = useState<SiteDetail[] | null>(null)
  const [archived, setArchived] = useState<SiteDetail[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Use mock data instead of API
    const mockSites = mockData.getSites()
    setPublished(mockSites.filter((site: SiteDetail) => site.status != 'archived'))
    setArchived(mockSites.filter((site: SiteDetail) => site.status === 'archived'))
  }, [])

  if (isLoading) {
    return <SitesPageLoader />
  } else {
    return (
      <div className="w-full h-fit flex flex-col gap-6 pb-6">
        <div className="relative w-full flex flex-col gap-5 pb-3">
          <div className="w-full grid grid-cols-3 gap-5">
            <CreateSiteCard />
            {!published ||
              (published.length === 0 && (
                <>
                  <SitePlaceholderCard />
                  <SitePlaceholderCard />
                </>
              ))}
            {published?.map((site) => (
              <SiteCard
                onSiteArchived={() => {}}
                site={site}
                key={site.uuid}
              />
            ))}
          </div>
        </div>
        {archived && archived.length != 0 && (
          <div className="relative w-full flex flex-col gap-5 pt-5 border-t border-brease-gray-3">
            <div>
              <Title style="semibold" size="sm">
                Archived
              </Title>
              <Text style="regular" size="sm" className="!text-brease-gray-8">
                Archived sites are going to be deleted after 30 days
              </Text>
            </div>
            <div className="w-full grid grid-cols-3 gap-5">
              {archived?.map((site) => (
                <SiteCard
                  onSiteArchived={() => {}}
                  site={site}
                  key={site.uuid}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}
