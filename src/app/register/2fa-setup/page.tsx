'use client'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-black.svg'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import Button from '@/components/generic/Button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { twoFactorSchema } from '@/components/dashboard/my-account/TwoFAEnableForm'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'
import { useStore } from 'zustand'

// Not in use currently, 2FA can be only activated from user profile
// After registration email must be confirmed!

export default function TwoFactorSetupPage() {
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: ''
    }
  })

  const router = useRouter()
  const userStore = useStore(useUserStore)
  const loading = useUserStore((state) => state.loading)

  const [qrCode, setQRCode] = useState<string | null>(null)
  const [isConfirm, setIsConfirm] = useState<boolean>(false)

  useEffect(() => {
    userStore.setLoading(false)
    const getQRCode = async () => {
      const response = await userStore.get2FACode()
      if (response.ok) setQRCode(response.data)
    }
    getQRCode()
  }, [])

  const confirm2FA = async (data: z.infer<typeof twoFactorSchema>) => {
    userStore.setLoading(true)
    const response = await userStore.confirm2FA(Number(data.code))
    userStore.setLoading(false)
    if (response.ok) router.push('/dashboard')
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col items-center gap-5 pb-5">
        <Image src={breaseLogo} className="w-[32px]" alt="Brease Logo" />
        <div className="flex flex-col items-center gap-2">
          <Title size="sm" style="semibold">
            Setup 2-Step Verification
          </Title>
          {!isConfirm && (
            <Text size="xs" style="regular" className="text-brease-gray-8 text-center">
              Scan the QR code below, then confirm it with the PIN from your authenticator of choice
            </Text>
          )}
        </div>
      </div>
      {!isConfirm && (
        <>
          <div className="p-2 rounded-lg border border-brease-gray-5 shadow-brease-xs mb-5 w-[250px] h-[250px]  flex justify-center items-center">
            {qrCode ? (
              <Image
                unoptimized
                src={`data:image/png;base64,${qrCode}`}
                alt={'QR code to setup two factor authentication'}
                className="w-full"
                width={200}
                height={200}
              />
            ) : (
              <LoaderCircleIcon className="h-16 w-16 stroke-brease-gray-1 animate-spin" />
            )}
          </div>
          <Button
            variant="primary"
            label="Confirm with PIN"
            size="md"
            className="w-full justify-center"
            onClick={() => setIsConfirm(true)}
          />
          <Button
            variant="textType"
            label="Skip for now"
            size="sm"
            onClick={() => router.push('/dashboard')}
          />
        </>
      )}
      {isConfirm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(confirm2FA)}
            className="w-full flex flex-col items-center justify-center space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {loading ? (
              <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
                <LoaderCircleIcon className="h-5 w-5 stroke-brease-gray-1 animate-spin" />
              </ButtonPlaceholder>
            ) : (
              <Button
                variant="primary"
                label="Continue"
                size="md"
                className="w-full justify-center"
                onClick={form.handleSubmit(confirm2FA)}
              />
            )}
          </form>
        </Form>
      )}
    </div>
  )
}
