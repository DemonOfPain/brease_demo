import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '../api/auth/[...nextauth]/options'
import { EditorWrapper } from '@/components/editor/layout/EditorWrapper'

export default async function EditorLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // DEMO MODE: Bypass auth check
  const session = await getServerSession(options)
  
  // Always show editor for demo
  return <EditorWrapper>{children}</EditorWrapper>
}
