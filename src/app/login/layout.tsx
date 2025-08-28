import PageWraper from '@/components/login-page/PageWrapper'

export default function LoginPageLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <PageWraper>{children}</PageWraper>
}
