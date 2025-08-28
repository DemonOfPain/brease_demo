import DashboardWrapper from '@/components/dashboard/dashboard-layout/DashboardWrapper'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '../api/auth/[...nextauth]/options'

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // DEMO MODE: Bypass auth and use mock session
  const session = await getServerSession(options)
  
  // Use mock session if no real session
  const mockSession = {
    accessToken: 'demo-token-123',
    user: {
      name: 'Demo User',
      email: 'demo@brease.com'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
  
  const activeSession = session || mockSession
  return <DashboardWrapper session={activeSession}>{children}</DashboardWrapper>
}
