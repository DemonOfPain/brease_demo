'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../shadcn/ui/form'
import { FormInput } from '../generic/form/FormInput'
import { Text } from '../generic/Text'
import Button from '../generic/Button'
import Link from 'next/link'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { useStore } from 'zustand'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useRouter } from 'next/navigation'

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export const ForgotPasswordForm = () => {
  const router = useRouter()
  const userStore = useStore(useUserStore)
  const loading = useUserStore((state) => state.loading)

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    const formData = new FormData()
    appendDataToFormData(data, formData, 'POST')
    userStore.setLoading(true)
    const response = await userStore.forgotPassword(formData)
    userStore.setLoading(false)
    if (response.ok) router.push('/login')
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="w-full flex flex-col gap-4">
          <FormInput
            icon="Mail"
            form={form}
            fieldName="email"
            variant="no-border"
            placeholder="user@brease.io"
          />
          <div className="w-full flex flex-col items-center gap-5">
            {loading ? (
              <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
                <LoaderCircleIcon className="h-5 w-5 stroke-brease-gray-1 animate-spin" />
              </ButtonPlaceholder>
            ) : (
              <Button
                variant="primary"
                label="Request Password Reset"
                size="md"
                className="w-full justify-center"
                onClick={form.handleSubmit(onSubmit)}
              />
            )}
            <Text size="sm" style="medium">
              Back to{' '}
              <Link href={'/login'} className="text-brease-primary hover:underline">
                Sign In
              </Link>
            </Text>
          </div>
        </form>
      </Form>
    </div>
  )
}
