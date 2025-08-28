'use client'
import React from 'react'
import HeaderBreadcrumbs from './HeaderBreadcrumbs'
import { Text } from '../../generic/Text'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { usePathname } from 'next/navigation'
import {
  CreateSiteButton,
  //PublishButton,
  EditorButton,
  ManagerButton,
  MediaLibraryButton
} from '@/components/generic/SubHeaderButton'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import { MediaLibrary } from '../../media-library/MediaLibrary'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { UserRole } from '@/interface/user'

const formatTitle = (title: string) => {
  if (title && title.includes('-')) {
    return title
      .split('-')
      .map((word: string) => {
        return word[0].toUpperCase() + word.substring(1)
      })
      .join(' ')
  } else {
    return title.charAt(0).toUpperCase() + title.substring(1)
  }
}

export const DashboardSubHeader = () => {
  const site = useSiteStore((state) => state.site)
  const userRole = useUserStore((state) => state.user.currentTeam?.userRole || UserRole.ADMIN)
  const path = usePathname()
  const pathArray = path.split('/').filter((x) => x != '')
  const isSiteDashboard = new RegExp(
    `^/dashboard/sites/(sit-[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[1-8][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12})(/|$)`
  ).test(path)
  const isSitePage = /^\/dashboard\/sites\/[^/]+\/pages\/[^/]+$/.test(path)
  const isFetchingSite = !site && isSiteDashboard
  const subHeaderTitle = formatTitle(pathArray[pathArray.length - 1])

  return (
    <div className="sticky top-14 bg-brease-gray-1 border-b border-brease-gray-4 w-full z-[9997]">
      <div className="w-full max-w-screen-xl flex flex-row justify-between mx-auto pt-10 pb-3 px-4 ">
        <div className="w-fit max-w-1/3 flex flex-col gap-1">
          {!isFetchingSite ? (
            <HeaderBreadcrumbs />
          ) : (
            <Skeleton className="w-[212px] h-[20px] bg-brease-gray-3" />
          )}
          {!isFetchingSite ? (
            isSitePage ? (
              'Edit Details'
            ) : (
              <Text size="xl" style="medium">
                {subHeaderTitle}
              </Text>
            )
          ) : (
            <Skeleton className="w-[70px] h-[20px] bg-brease-gray-3" />
          )}
        </div>
        <div className="w-fit max-w-2/3 flex flex-row gap-2">
          {isSiteDashboard ? (
            !isFetchingSite ? (
              <>
                {/* DEMO MODE: Commented out unused buttons
                <MediaLibraryButton>
                  <MediaLibrary />
                </MediaLibraryButton>
                <ManagerButton />
                {userRole === UserRole.administrator && <EditorButton />}
                */}
                {/*<PublishButton />*/}
              </>
            ) : (
              <>
                <Skeleton className="w-[270px] h-[60px] bg-brease-gray-3" />
                <Skeleton className="w-[257px] h-[60px] bg-brease-gray-3" />
                <Skeleton className="w-[226px] h-[60px] bg-brease-gray-3" />
              </>
            )
          ) : (
            <CreateSiteButton />
          )}
        </div>
      </div>
    </div>
  )
}
