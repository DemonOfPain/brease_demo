'use client'
import { EditorLoader } from '@/components/editor/layout/EditorLoader'
import { useRoleRedirect } from '@/lib/hooks/useRoleRedirect'
import dynamic from 'next/dynamic'

const EditorMain = dynamic(
  () => import('@/components/editor/EditorMain').then((mod) => mod.EditorMain),
  { ssr: true, loading: () => <EditorLoader /> }
)

export default function SectionEditorPage() {
  useRoleRedirect()
  return <EditorMain />
}
