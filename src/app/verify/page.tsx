import { VerifyEmailOverlay } from '@/components/login-page/VerifyEmailOverlay'
import { toast } from '@/components/shadcn/ui/use-toast'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '../api/auth/[...nextauth]/options'

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code
  const session = await getServerSession(options)
  if (code) {
    return <VerifyEmailOverlay code={code} session={session} />
  } else {
    toast({ variant: 'error', title: 'Missing verification parameters!' })
    redirect('/login')
  }
}
