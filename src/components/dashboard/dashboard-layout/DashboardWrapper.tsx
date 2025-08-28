'use client'
import DashboardHeader from './DashboardHeader'
import { DashboardSideMenu } from './DashboardSideMenu'
import { DashboardSubHeader } from './DashboardSubHeader'
import { useEffect } from 'react'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { Session } from 'next-auth'
import { useStore } from 'zustand'
import { DashboardOutlet } from './DashboardOutlet'
import { useParams } from 'next/navigation'
import { SiteDashboardSideMenu } from '../sites/SiteDashboardSideMenu'
import { DashboardWrapperSkeleton } from './DashboardWrapperSkeleton'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { AISidebar } from '@/components/assistant/AISidebar'

export default function DashboardWrapper({
  children,
  // eslint-disable-next-line no-unused-vars
  session
}: Readonly<{
  children: React.ReactNode
  session: Session
}>) {
  const userStore = useStore(useUserStore)
  const user = useUserStore((state) => state.user)
  const siteStore = useStore(useSiteStore)
  const site = useSiteStore((state) => state.site)
  const storeHydrated = useUserStore((state) => state.storeHydrated)
  const params = useParams()
  const isSiteDashboard = params.site ? true : false

  useEffect(() => {
    // DEMO MODE: Commented out API calls
    // if (!user.uuid || !user.firstName) {
    //   userStore.getUser()
    // }
    // if (isSiteDashboard && !site.uuid) {
    //   siteStore.getSite(params.site as string)
    // }
  }, [])

  // DEMO MODE: Always render for demo, don't check user.uuid
  if (!isSiteDashboard) {
    return (
      <main className="relative w-full flex flex-col justify-start items-start overscroll-none no-scrollbar">
        <DashboardHeader />
        <DashboardSubHeader />
        <div className="w-full h-full">
          <div className="w-full h-full max-w-screen-xl mx-auto px-4 flex flex-row justify-start items-start gap-[72px] pt-6">
            <div className="sticky top-[193px] w-fit h-full">
              <DashboardSideMenu />
            </div>
            <DashboardOutlet>{children}</DashboardOutlet>
          </div>
        </div>
        <AISidebar />
      </main>
    )
  } else if (isSiteDashboard) {
    // For demo mode, always render the site dashboard if we're in a site route
    return (
      <main className="relative w-full flex flex-col justify-start items-start overscroll-none no-scrollbar">
        <DashboardHeader />
        <DashboardSubHeader />
        <div className="w-full h-full">
          <div className="w-full h-full max-w-screen-xl mx-auto px-4 flex flex-row justify-start items-start gap-[72px] pt-6">
            <div className="sticky top-[193px] w-fit h-full">
              <SiteDashboardSideMenu />
            </div>
            <DashboardOutlet>{children}</DashboardOutlet>
          </div>
        </div>
        <AISidebar />
      </main>
    )
  } else {
    return <DashboardWrapperSkeleton />
  }
}
