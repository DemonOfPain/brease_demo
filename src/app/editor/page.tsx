'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { EditorLoader } from '@/components/editor/layout/EditorLoader'

export default function SectionEditorPage() {
  const site = useSiteStore((state) => state.site)
  useEffect(() => {
    // TODO: v2: catch user role (only admin/dev can acess section editor)
    if (site.uuid) {
      redirect(`/editor/${site.uuid}`)
    } else {
      redirect('/dashboard')
    }
  }, [])
  return <EditorLoader />
}
