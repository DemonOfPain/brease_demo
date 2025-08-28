'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../shadcn/ui/form'
import { FormInput } from '../generic/form/FormInput'
import Button from '../generic/Button'
import { Title } from '@/components/generic/Title'
import { Text } from '@/components/generic/Text'
import { LoaderCircleIcon } from 'lucide-react'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { Session } from 'next-auth'

const resetPasswordSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .refine((x) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.-])[A-Za-z\d@$!%*#?&.-]{8,}$/.test(x), {
        message:
          'Password must be at least 8 characters long, must contain a number and a special character!'
      }),
    password_confirmation: z.string(),
    token: z.string()
  })
  .refine((schema) => schema.password === schema.password_confirmation, {
    path: ['passwordAgain'],
    message: 'Passwords are not matching!'
  })

export const ResetPasswordForm = ({
  email,
  token,
  session
}: {
  email: string
  token: string
  session: Session | null
}) => {
  const router = useRouter()
  const { loading, setLoading, resetPassword } = useUserStore()

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      password: '',
      password_confirmation: '',
      token: token
    }
  })

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const formData = new FormData()
    appendDataToFormData(data, formData, 'POST')
    setLoading(true)
    const response = await resetPassword(formData)
    setLoading(false)
    if (response.ok) {
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-2">
          <Title size="sm" style="semibold">
            Reset your password
          </Title>
          <Text size="xs" style="regular" className="text-brease-gray-8 text-center">
            Strong password include numbers, letters, and special characters.
          </Text>
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <div className="w-full">
          <Form {...form}>
            <form className="w-full flex flex-col gap-4">
              <FormInput
                form={form}
                fieldName="password"
                placeholder="New Password"
                variant="no-border"
                type="password"
                required
              />
              <FormInput
                form={form}
                fieldName="password_confirmation"
                placeholder="Re-Type Password"
                variant="no-border"
                type="password"
                required
              />
              {loading ? (
                <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
                  <LoaderCircleIcon className="h-5 w-5 stroke-brease-gray-1 animate-spin" />
                </ButtonPlaceholder>
              ) : (
                <Button
                  variant="primary"
                  label="Reset Password"
                  size="md"
                  className="w-full justify-center"
                  onClick={form.handleSubmit(onSubmit)}
                />
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
