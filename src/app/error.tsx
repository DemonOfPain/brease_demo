'use client'
import Button from '@/components/generic/Button'
import { Title } from '@/components/generic/Title'
import { useEffect } from 'react'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
import { signOut } from 'next-auth/react'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleLogout = async () => {
    // clear localStorage before signout
    useAssistantStore.persist.clearStorage()
    useUserStore.persist.clearStorage()
    await signOut()
  }

  return (
    <div className="h-screen !items-center !justify-center">
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <Image src={breaseLogo} className="w-[70px]" alt="Brease Logo" />
        <Title size={'md'} style={'semibold'}>
          {'Ooops! Something went wrong...'}
        </Title>
        <div className="w-fit flex flex-row gap-6">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            label={'Try again'}
            icon="RefreshCcw"
          />
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="lg"
            label={'Sign out'}
            icon="LogOut"
          />
        </div>
      </div>
    </div>
  )
}
