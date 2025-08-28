'use client'
import React, { useEffect } from 'react'
import { useStore } from 'zustand'
import { EditorNavbar } from './EditorNavbar'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { WrapperLoader } from './WrapperLoader'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useParams } from 'next/navigation'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { AISidebar } from '@/components/assistant/AISidebar'

export const EditorWrapper = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const hydrated = useUserStore((state) => state.storeHydrated)
  const elements = useEditorStore((state) => state.elements)
  const sections = useEditorStore((state) => state.sections)
  const collections = useEditorStore((state) => state.collections)
  const allEntries = useManagerStore((state) => state.allEntries)
  const mediaLib = useMediaStore((state) => state.mediaLib)
  const user = useUserStore((state) => state.user)
  const site = useSiteStore((state) => state.site)
  const userStore = useStore(useUserStore)
  const siteStore = useStore(useSiteStore)
  const params = useParams()
  const siteId = params.site as string

  useEffect(() => {
    // DEMO MODE: Commented out API calls
    // if (!hydrated) return
    // const initializeData = async () => {
    //   if (!user.uuid) {
    //     await userStore.getUser()
    //   }
    //   if (!site.uuid) {
    //     await siteStore.getSite(siteId)
    //   }
    // }
    // initializeData()
  }, [hydrated])

  // DEMO MODE: Don't check for data loading
  // if (!elements || !sections || !collections || !allEntries || !mediaLib) {
  //   return <WrapperLoader />
  // }

  return (
    <main className="relative w-full h-screen max-h-screen z-[20] bg-brease-gray-1 flex flex-col justify-start items-start overflow-hidden">
      <EditorNavbar />
      <div className="relative z-[20] w-full h-[calc(100%-50px)] flex flex-row bg-brease-gray-4">
        {children}
      </div>
      <AISidebar />
    </main>
  )
}
