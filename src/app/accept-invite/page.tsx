import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { TeamInvitationOverlay } from '@/components/dashboard/dashboard-layout/TeamInvitationOverlay'

export default async function AcceptInvitePage({
  searchParams
}: {
  searchParams: { invite_code?: string; team_name?: string }
}) {
  const session = await getServerSession(options)
  const inviteCode = searchParams.invite_code
  const teamName = searchParams.team_name

  if (!session) {
    console.error('Not Authenticated!')
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/accept-invite?invite_code=${inviteCode}&team_name=${teamName}`)}`
    )
  } else {
    return <TeamInvitationOverlay inviteCode={inviteCode!} teamName={teamName!} />
  }
}
