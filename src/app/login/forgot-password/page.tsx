import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import { ForgotPasswordForm } from '@/components/login-page/ForgotPasswordForm'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function ForgotPasswordPage() {
  const session = await getServerSession(options)
  if (session) {
    redirect('/dashboard')
  } else {
    return (
      <div className="w-full flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-2">
            <Title size="sm" style="semibold">
              Forgot your password?
            </Title>
            <Text size="xs" style="regular" className="text-brease-gray-8">
              Please enter the email connected to your account.
            </Text>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-5">
          <ForgotPasswordForm />
        </div>
      </div>
    )
  }
}
