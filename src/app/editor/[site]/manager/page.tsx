'use client'

import { ManagerDraftContext } from '@/lib/context/ManagerDraftContext'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { useManagerDrafts } from '@/lib/hooks/useManagerDrafts'
import dynamic from 'next/dynamic'
import { EditorLoader } from '@/components/editor/layout/EditorLoader'

const ManagerMain = dynamic(
  () => import('@/components/editor/manager/ManagerMain').then((mod) => mod.ManagerMain),
  { ssr: true, loading: () => <EditorLoader /> }
)

export default function ManagerPage() {
  const { entryContent } = useManagerStore()
  const { entryContentClone, setEntryContentClone, isDraft, discardDraft } =
    useManagerDrafts(entryContent)

  return (
    <ManagerDraftContext.Provider
      value={{
        entryContentClone,
        setEntryContentClone,
        isDraft,
        discardDraft
      }}
    >
      <ManagerMain />
    </ManagerDraftContext.Provider>
  )
}
