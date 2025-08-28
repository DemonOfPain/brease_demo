import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-black.svg'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import { RegisterForm } from '@/components/register-page/RegisterForm'
//import ThirdPartySignIn from '@/components/login-page/ThirdPartySignIn'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '../api/auth/[...nextauth]/options'
import Link from 'next/link'

export default async function RegisterPage() {
  const session = await getServerSession(options)

  if (session) {
    redirect('/dashboard')
  } else {
    return (
      <div className="w-full flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <Image src={breaseLogo} className="w-[32px]" alt="Brease Logo" />
          <div className="flex flex-col items-center gap-2">
            <Title size="sm" style="semibold">
              Create your free account
            </Title>
            <Text size="xs" style="regular" className="text-brease-gray-8">
              No credit card required. Cancel anytime.
            </Text>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-5">
          {/* <ThirdPartySignIn />
          <div className="w-full flex flex-row justify-between items-center">
            <div className="h-px w-full bg-brease-gray-4" />
            <div className="w-[180px] flex justify-center">
              <Text size="xs" style="semibold">
                or
              </Text>
            </div>
            <div className="h-px w-full bg-brease-gray-4" />
          </div> */}
          <RegisterForm />
          <div className="w-full flex flex-row justify-center flex-wrap gap-2">
            <Text size="xs" style="semibold">
              Already have an account?
            </Text>
            <Link href="/login">
              <Text size="xs" style="medium" className="text-brease-primary hover:underline">
                Sign In
              </Text>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
