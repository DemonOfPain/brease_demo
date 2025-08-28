'use client'
import Button from '@/components/generic/Button'
import { Title } from '@/components/generic/Title'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="h-screen !items-center !justify-center">
      <div className="w-full h-full flex flex-col justify-center items-center gap-6">
        <Image src={breaseLogo} className="w-[70px]" alt="Brease Logo" />
        <Title size={'md'} style={'semibold'}>
          {'Page not found'}
        </Title>
        <div className="w-fit flex flex-row gap-6">
          <Button
            onClick={() => router.back()}
            variant="primary"
            size="lg"
            label={'Go back'}
            icon="ArrowLeft"
          />
          <Button
            onClick={() => router.push('/dashboard')}
            variant="secondary"
            size="lg"
            label={'Dashboard'}
            icon="Home"
          />
        </div>
      </div>
    </div>
  )
}
