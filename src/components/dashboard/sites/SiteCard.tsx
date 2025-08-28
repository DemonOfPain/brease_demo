'use client'
import { Text } from '@/components/generic/Text'
import { Badge } from '@/components/shadcn/ui/badge'
import { SiteDetail } from '@/interface/site'
import Image from 'next/image'
import React, { useState } from 'react'
import HeaderProfileMenuItem from '../dashboard-layout/HeaderProfileMenuItem'
import { useRouter } from 'next/navigation'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useStore } from 'zustand'
import Placeholder from '@/images/site-placeholder.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'

//TODO: create handlePublish

export const SiteCard = ({
  site,
  onSiteArchived
}: {
  site: SiteDetail
  onSiteArchived: () => void
}) => {
  const router = useRouter()
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)
  const [thumbnail, setThumbnail] = useState(site.thumbnail ?? Placeholder)

  const handleEditDetails = () => {
    // For demo, just navigate without setting store
    router.push(`/dashboard/sites/${site.uuid}/pages`)
  }

  // const handleManageUsers = () => {
  //   router.push(`/dashboard/sites/${site.uuid}/users`)
  //   siteStore.setSite(site)
  // }

  // const handleManageRoles = () => {
  //   router.push(`/dashboard/sites/${site.uuid}/roles`)
  //   siteStore.setSite(site)
  // }

  const handleSiteArchive = async () => {
    siteStore.setLoading(true)
    siteStore.deleteSite(site.uuid)
    onSiteArchived()
    siteStore.setLoading(false)
  }

  return (
    <div
      className={`${site.status != 'archived' ? '' : 'grayscale '} w-full p-1 flex flex-col justify-between border-2 border-brease-gray-3 rounded-lg shadow-brease-xs hover:border-brease-gray-5 transition-all ease-in-out duration-300 cursor-pointer`}
      onClick={(e) => {
        // Don't navigate if clicking on dropdown or its children
        if (!(e.target as HTMLElement).closest('[role="menu"]') && !(e.target as HTMLElement).closest('button[aria-haspopup]')) {
          handleEditDetails()
        }
      }}
    >
      <div className="flex justify-center items-end w-full h-fit px-6 pt-6 bg-brease-gray-2 border-b border-brease-gray-4">
        <Image
          priority
          src={thumbnail}
          alt={site.name}
          className="w-[242px] max-h-[144px] rounded-t-lg object-cover object-top"
          width={240}
          height={150}
          onError={() => setThumbnail(Placeholder)}
        />
      </div>
      <div className="w-full flex flex-col px-5 pb-5 pt-6 justify-between items-start gap-2">
        <div className="w-full flex flex-row justify-between gap-2">
          <Text size="md" style="semibold">
            {site.name}
          </Text>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <ButtonPlaceholder
                variant="secondary"
                icon="Ellipsis"
                size="sm"
                className="!bg-brease-gray-3 hover:!bg-transparent !ring-0 hover:!ring-1 !ring-brease-gray-5 !py-1 !px-1 !stroke-brease-gray-10  "
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] flex flex-col p-2 list-none">
              <HeaderProfileMenuItem
                label={'Edit Pages'}
                onClick={handleEditDetails}
                icon={'FilePen'}
                className="!font-golos-medium"
              />
              {/* <HeaderProfileMenuItem
                label={'Manage Users'}
                onClick={handleManageUsers}
                icon={'Users'}
                className="!font-golos-medium"
              />
              <HeaderProfileMenuItem
                label={'Manage Roles'}
                onClick={handleManageRoles}
                icon={'UserCog'}
                className="!font-golos-medium"
              /> */}
              {site.status != 'archived' && (
                <HeaderProfileMenuItem
                  label={'Archive Site'}
                  dialog
                  dialogProps={{
                    title: 'Are you absolutely sure about this?',
                    description:
                      'Archived sites can not be visited and will not be listed in browser results. Archived sites will be deleted after 30 days.',
                    cancelBtnLabel: 'Cancel',
                    actionBtnLabel: loading ? 'Archiving site...' : 'Yes, I am sure!',
                    actionBtnOnClick: () => handleSiteArchive()
                  }}
                  icon={'EyeOff'}
                  className="!font-golos-medium !bg-brease-gray-9 !text-brease-gray-1 hover:ring-1 hover:ring-brease-gray-8 "
                  textClassName="group-hover:!bg-brease-gray-9"
                  iconClassName="!stroke-brease-gray-1"
                />
              )}
              {site.status === 'archived' && (
                <HeaderProfileMenuItem
                  label={'Publish Site'}
                  dialog
                  dialogProps={{
                    title: 'Are you absolutely sure about this?',
                    description:
                      'Published sites can be visited and will be listed in browser results.',
                    cancelBtnLabel: 'Cancel',
                    actionBtnLabel: loading ? 'Publishing site...' : 'Yes, I am sure!',
                    actionBtnOnClick() {
                      console.log('site published')
                    }
                  }}
                  icon={'Eye'}
                  className="!font-golos-medium !bg-brease-gray-9 !text-brease-gray-1 hover:ring-1 hover:ring-brease-gray-8"
                  textClassName="group-hover:!bg-brease-gray-9"
                  iconClassName="!stroke-brease-gray-1"
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Badge
          variant={site.status === 'published' ? 'publishedSite' : 'unpublishedSite'}
          className="uppercase py-1"
        >
          {site.status}
        </Badge>
      </div>
    </div>
  )
}
