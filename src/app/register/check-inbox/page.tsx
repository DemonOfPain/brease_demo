import { CheckInboxOverlay } from '@/components/register-page/CheckInboxOverlay'

export default async function CheckInboxPage({
  searchParams
}: {
  searchParams: { email: string }
}) {
  const email = searchParams.email
  return <CheckInboxOverlay email={email} />
}
