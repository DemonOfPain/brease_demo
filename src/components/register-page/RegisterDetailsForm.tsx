'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from '../shadcn/ui/use-toast'
import { Form } from '../shadcn/ui/form'
import { FormInput } from '../generic/form/FormInput'
import Button from '../generic/Button'
import { FormCheckbox } from '../generic/form/FormCheckbox'
import { Text } from '@/components/generic/Text'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { LoaderCircleIcon } from 'lucide-react'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { useState } from 'react'

export const RegisterDetailsForm = () => {
  const searchParams = useSearchParams()
  const userEmail = searchParams.get('email')
  const inviteCompany = searchParams.get('team_name')
  const inviteCode = searchParams.get('invite_code')

  const registerDetailsSchema = z
    .object({
      email: z.string().email(),
      firstname: z.string().min(1, { message: '' }),
      lastname: z.string().min(1, { message: '' }),
      password: z
        .string()
        .refine(
          (x) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.-])[A-Za-z\d@$!%*#?&.-]{8,}$/.test(x),
          {
            message:
              'Password must be at least 8 characters long, must contain a number and a special character!'
          }
        ),
      password_confirmation: z.string(),
      terms_accepted: z.boolean().refine((x) => x, { message: '' }),
      mail_subscribed: z.boolean().optional(),
      company: z.string().optional(),
      invitation_code: z.string().optional(),
      token_name: z.string()
    })
    .refine((schema) => schema.password === schema.password_confirmation, {
      path: ['password_confirmation'],
      message: 'Passwords are not matching!'
    })

  const form = useForm<z.infer<typeof registerDetailsSchema>>({
    resolver: zodResolver(registerDetailsSchema),
    defaultValues: {
      email: userEmail || '',
      firstname: '',
      lastname: '',
      password: '',
      password_confirmation: '',
      company: inviteCompany || '',
      invitation_code: inviteCode || undefined,
      terms_accepted: false,
      mail_subscribed: false,
      token_name: 'insomnia'
    }
  })

  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  async function onSubmit(data: z.infer<typeof registerDetailsSchema>) {
    setLoading(true)
    const formData = new FormData()
    appendDataToFormData(data, formData, 'POST')
    try {
      const result = await fetch('/api/register', {
        method: 'POST',
        body: formData
      }).then((res) => res.json())
      if (!result.errors) {
        router.push(`/register/check-inbox?email=${encodeURIComponent(data.email)}`)
      } else {
        console.error(result)
        setLoading(false)
        toast({
          variant: 'error',
          title: `${result.message}`
        })
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
      toast({
        variant: 'error',
        title: 'Error while submitting your form!'
      })
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-row items-start justify-between gap-3">
            <FormInput
              form={form}
              fieldName="firstname"
              fieldLabel="First Name"
              variant="no-border"
              className="w-1/2"
              required
            />
            <FormInput
              form={form}
              fieldName="lastname"
              fieldLabel="Last Name"
              variant="no-border"
              className="w-1/2"
              required
            />
          </div>
          <FormInput
            icon="Mail"
            form={form}
            fieldName="email"
            fieldLabel="Email"
            variant="no-border"
            disabled={userEmail ? true : false}
          />
          <div className="w-full flex flex-row items-start justify-between gap-3">
            <FormInput
              form={form}
              fieldName="password"
              fieldLabel="Password"
              variant="no-border"
              type="password"
              required
              className="w-1/2"
            />
            <FormInput
              form={form}
              fieldName="password_confirmation"
              fieldLabel="Confirm Password"
              variant="no-border"
              type="password"
              className="w-1/2"
              required
            />
          </div>
          <FormInput
            form={form}
            fieldName="company"
            fieldLabel="Company Name"
            disabled={inviteCompany ? true : false}
            variant="no-border"
          />
          <div className="w-full flex flex-row items-center justify-start gap-2">
            <FormCheckbox form={form} fieldName="terms_accepted" required />
            <Text size="xs" style="regular">
              I agree to the{' '}
              <Link href="#" className="underline font-golos-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="underline font-golos-medium">
                Privacy Policy
              </Link>
              <span className="text-brease-error"> *</span>
            </Text>
          </div>
          <FormCheckbox
            form={form}
            fieldName="mail_subscribed"
            fieldLabel="Send me updates via email"
          />
          {loading ? (
            <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
              <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <Button
              variant="primary"
              label="Continue"
              size="md"
              className="w-full justify-center"
              onClick={form.handleSubmit(onSubmit)}
            />
          )}
        </form>
      </Form>
    </div>
  )
}
