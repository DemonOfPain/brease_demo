'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../shadcn/ui/form'
import { FormInput } from '../generic/form/FormInput'
import { Text } from '../generic/Text'
import Button from '../generic/Button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createQueryString } from '@/lib/helpers/createQueryString'

const registerSchema = z.object({
  email: z.string().email()
})

export const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: ''
    }
  })

  const router = useRouter()

  function onSubmit(data: z.infer<typeof registerSchema>) {
    router.push('/register/details' + '?' + createQueryString('email', data.email))
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="w-full flex flex-col gap-4">
          <FormInput
            icon="Mail"
            form={form}
            fieldName="email"
            fieldLabel="Email"
            variant="no-border"
            required
          />
          <div className="w-full flex flex-col items-center gap-2">
            <Button
              variant="primary"
              label="Continue"
              size="md"
              className="w-full justify-center"
              onClick={form.handleSubmit(onSubmit)}
            />
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
}
