import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from '@/components/login-page/ResetPasswordForm'
import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: { code?: string; email?: string }
}) {
  const session = await getServerSession(options)
  const token = searchParams.code
  const email = searchParams.email
  if (!token || !email) {
    session ? redirect('/dashboard') : redirect('/login')
  } else {
    return <ResetPasswordForm token={token} email={email} session={session} />
  }
}
