import Button from '@/components/generic/Button'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import Image from 'next/image'
import loginPlaceholder from '@/images/login-placeholder.png'

export default function PageWraper({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="w-full h-screen flex flex-row">
      <div className="bg-white h-full w-2/5 flex justify-center items-center">
        <div className="w-[360px] h-fit">{children}</div>
      </div>
      <div className="bg-brease-gray-2 w-3/5 h-full flex flex-col justify-between gap-16 pt-16 pl-20 overflow-hidden">
        <div className="flex flex-row w-full justify-between items-center pr-20">
          <div className="w-fit flex flex-col gap-2">
            <Title size="md" style="semibold" htmlTag="h2">
              Start your journey with Brease
            </Title>
            <Text size="md" style="regular" htmlTag="span" className="text-brease-gray-8">
              Create a free account and start building without limits.
            </Text>
          </div>
          <Button variant="secondary" size="md" label="Learn More" navigateTo="#" />
        </div>
        <Image
          src={loginPlaceholder}
          alt="Login Placeholder Illustration"
          className="w-full"
          priority
        />
      </div>
    </main>
  )
}
