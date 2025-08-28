import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-black.svg'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import { LoginForm } from '@/components/login-page/LoginForm'
import Link from 'next/link'
//import ThirdPartySignIn from '@/components/login-page/ThirdPartySignIn'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function LoginPage() {
  const session = await getServerSession(options)

  if (session) {
    redirect('/dashboard')
  } else {
    return (
      <div className="w-full flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <Image src={breaseLogo} className="w-[32px]" alt="Brease Logo" />
          <Title size="md" style="semibold">
            Welcome Back
          </Title>
        </div>
        <div className="w-full flex flex-col items-center gap-5">
          {/* <ThirdPartySignIn />
          <div className="w-full flex flex-row justify-between items-center">
            <div className="h-px w-full bg-brease-gray-4" />
            <div className="w-[180px] flex justify-center">
              <Text size="xs" style="semibold" className="text-brease-gray-8">
                or
              </Text>
            </div>
            <div className="h-px w-full bg-brease-gray-4" />
          </div> */}
          <LoginForm />
          <div className="w-full flex flex-row justify-center flex-wrap gap-2">
            <Text size="xs" style="semibold">
              Don&apos;t have an account?
            </Text>
            <Link href="/register">
              <Text size="xs" style="medium" className="text-brease-primary hover:underline">
                Register
              </Text>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
