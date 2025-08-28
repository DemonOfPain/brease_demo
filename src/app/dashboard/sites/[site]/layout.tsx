'use client'

export default function SiteDashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // For demo, just render children directly
  // The actual site data is loaded in each page from mockData
  return <>{children}</>
}