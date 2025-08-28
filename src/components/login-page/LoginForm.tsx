'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from '../shadcn/ui/use-toast'
import { FormCheckbox } from '../generic/form/FormCheckbox'
import { FormInput } from '../generic/form/FormInput'
import { Text } from '../generic/Text'
import Button from '../generic/Button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/shadcn/ui/input-otp'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().refine((x) => x.length > 1),
  rememberMe: z.boolean().optional()
})

const twoFactorSchema = z.object({
  code: z.string().min(6, {
    message: 'Your one-time password must be 5 characters.'
  })
})

type TwofaCache = {
  email: string
  password: string
  rememberMe?: boolean //TODO: implement in v2
} | null

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [twofaCache, setTwofaCache] = useState<TwofaCache>(null)

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const twoFactorForm = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: ''
    }
  })

  async function onLoginSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    const signInResult = await signIn('brease-api', {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
      callbackUrl: callbackUrl
    })
    if (signInResult) {
      if (signInResult.ok && !signInResult.error) {
        router.push(callbackUrl)
      } else if (signInResult.error === '2FA') {
        setTwofaCache({
          email: data.email.toLowerCase(),
          password: data.password,
          rememberMe: data.rememberMe
        })
      } else if (signInResult.error === 'EMAIL_VERIFY') {
        router.push(`/register/check-inbox?email=${encodeURIComponent(data.email)}`)
      } else {
        setIsLoading(false)
        console.error(signInResult)
        toast({
          variant: 'error',
          title: `Couldn't log you in! (${signInResult?.status})`,
          // TODO: add description based on response status code
          description: `Wrong credentials`
        })
      }
    }
  }

  async function onTwoFactorSubmit(data: z.infer<typeof twoFactorSchema>) {
    setIsLoading(true)
    const signInResult = await signIn('brease-api-2fa', {
      email: twofaCache!.email.toLowerCase(),
      password: twofaCache!.password,
      code: data.code,
      redirect: false,
      callbackUrl: callbackUrl
    })
    if (signInResult) {
      if (signInResult.ok && !signInResult.error) {
        router.push(callbackUrl)
      } else {
        setIsLoading(false)
        console.error(signInResult)
        toast({
          variant: 'error',
          title: `Couldn't log you in!`,
          // TODO: add description based on response status code
          description: `Wrong credentials`
        })
      }
    }
  }

  if (!twofaCache) {
    return (
      <div className="w-full">
        <Form {...loginForm}>
          <form className="w-full flex flex-col gap-4">
            <FormInput
              icon="Mail"
              form={loginForm}
              fieldName="email"
              placeholder="Email"
              variant="no-border"
            />
            <FormInput
              icon="Lock"
              variant="no-border"
              form={loginForm}
              fieldName="password"
              placeholder="Password"
              type="password"
            />
            <div className="w-full flex flex-row justify-between">
              <FormCheckbox
                form={loginForm}
                fieldName="rememberMe"
                fieldLabel="Remember me"
                required={false}
              />
              <Link href="/login/forgot-password">
                <Text size="xs" style="medium" className="text-brease-gray-8 hover:underline">
                  Forgot Password ?
                </Text>
              </Link>
            </div>
            <div className="w-full flex flex-col items-center gap-2">
              {isLoading ? (
                <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
                  <LoaderCircleIcon className="h-5 w-5 stroke-brease-gray-1 animate-spin" />
                </ButtonPlaceholder>
              ) : (
                <Button
                  variant="primary"
                  label="Continue"
                  size="md"
                  className="w-full justify-center"
                  onClick={loginForm.handleSubmit(onLoginSubmit)}
                />
              )}
              <Text size="xxxs" style="regular" className="text-brease-gray-8">
                By continuing, you agree to Brease&apos;s{' '}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
                .
              </Text>
            </div>
          </form>
        </Form>
      </div>
    )
  } else {
    return (
      <Form {...twoFactorForm}>
        <form
          onSubmit={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
          className="w-full flex flex-col items-center justify-center space-y-6"
        >
          <FormField
            control={twoFactorForm.control}
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
          <Button
            variant="primary"
            label="Continue"
            size="md"
            className="w-full justify-center"
            onClick={twoFactorForm.handleSubmit(onTwoFactorSubmit)}
          />
        </form>
      </Form>
    )
  }
}
