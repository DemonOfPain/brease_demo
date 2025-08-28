'use client'
import { SitesPageLoader } from '@/components/dashboard/sites/SitesPageLoader'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useStore } from 'zustand'

export const SiteDashboardWrapper = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const siteStore = useStore(useSiteStore)
  const site = useSiteStore((state) => state.site)
  const user = useUserStore((state) => state.user)
  const storeHydrated = useUserStore((state) => state.storeHydrated)
  const userStore = useStore(useUserStore)
  const params = useParams()
  const siteId = params.site as string

  useEffect(() => {
    if (!storeHydrated) return
    if (!user.uuid) userStore.getUser()
    if (!site.uuid || site.uuid != siteId) siteStore.getSite(siteId)
  }, [storeHydrated])

  if (!site.uuid || !user.uuid) {
    return { children }
  } else {
    return <SitesPageLoader />
  }
}
