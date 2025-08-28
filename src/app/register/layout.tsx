import PageWraper from '@/components/login-page/PageWrapper'

export default function RegisterPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PageWraper>{children}</PageWraper>
}
