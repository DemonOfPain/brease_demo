import React from 'react'
//import DashboradSideMenuSecondaryMenu from '../dashboard-layout/DashboradSideMenuSecondaryMenu'
import { SiteDashboardSideMenuPrimaryMenu } from './SiteDashboardSideMenuPrimrayMenu'
import { SiteDashboradSideMenuDropdown } from './SiteDashboradSideMenuDropdown'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { Skeleton } from '@/components/shadcn/ui/skeleton'

export const SiteDashboardSideMenu = () => {
  const site = useSiteStore((state) => state.site)

  if (site.uuid) {
    return (
      <nav className="w-[210px] h-fit flex flex-col gap-5">
        <SiteDashboradSideMenuDropdown site={site} />
        <SiteDashboardSideMenuPrimaryMenu site={site} />
        {/* <DashboradSideMenuSecondaryMenu
          title="Team"
          items={[
            {
              label: 'Users',
              link: `/dashboard/sites/${site.uuid}/users`,
              icon: 'Users'
            },
            {
              label: 'Roles',
              link: `/dashboard/sites/${site.uuid}/roles`,
              icon: 'FileCheck'
            }
          ]}
        />
        <DashboradSideMenuSecondaryMenu
          title="Site"
          items={[
            {
              label: 'Logs',
              link: `/dashboard/sites/${site.uuid}/logs`,
              icon: 'Brackets'
            }
          ]}
        /> */}
      </nav>
    )
  } else {
    ;<nav className="w-[210px] h-fit flex flex-col gap-5">
      <Skeleton className="w-full h-[61px] rounded-lg" />
      <Skeleton className="w-full h-[186px] rounded-lg" />
      <Skeleton className="w-full h-[118px] rounded-lg" />
      <Skeleton className="w-full h-[80px] rounded-lg" />
    </nav>
  }
}
