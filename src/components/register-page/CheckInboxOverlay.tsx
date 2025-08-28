'use client'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import { LoaderCircleIcon, MailIcon } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/generic/Button'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'

export const CheckInboxOverlay = ({ email }: { email: string }) => {
  const { resendVerifyEmail, loading, setLoading } = useUserStore()
  const handleResendVerification = async () => {
    let formData = new FormData()
    appendDataToFormData({ email: email }, formData, 'POST')
    setLoading(true)
    await resendVerifyEmail(formData)
    setLoading(false)
  }
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-5">
        <MailIcon className="h-12 w-12" />
        <div className="flex flex-col items-center gap-2">
          <Title size="sm" style="semibold">
            Check your inbox
          </Title>
          <Text size="xs" style="medium">
            We have sent you the verification link for your account.
          </Text>
          <Text size="xs" style="regular" className="text-brease-gray-8">
            Please be sure to check your spam folder too.
          </Text>
        </div>
      </div>
      {loading ? (
        <ButtonPlaceholder variant="black" size="sm" className="w-[139px] justify-center">
          <LoaderCircleIcon className="h-[18px] w-[18px] stroke-brease-gray-1 animate-spin" />
        </ButtonPlaceholder>
      ) : (
        <Button
          size="sm"
          variant="black"
          label="Re-send verification"
          onClick={handleResendVerification}
        />
      )}
      <Link href="/login" className="-mt-2">
        <Text size="xs" style="medium" className="text-brease-primary hover:underline">
          Back to Sign In
        </Text>
      </Link>
    </div>
  )
}
