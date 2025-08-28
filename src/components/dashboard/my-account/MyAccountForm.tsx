'use client'
import { Form } from '@/components/shadcn/ui/form'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { z } from 'zod'
import { ProfileAvatarInput } from './ProfileAvatarInput'
import { Text } from '@/components/generic/Text'
import { FormInput } from '@/components/generic/form/FormInput'
import Button from '@/components/generic/Button'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { UserProfileDetail } from '@/interface/user'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'
import { useStore } from 'zustand'

const MAX_FILE_SIZE = 2000000 //2MB
const myAccountSchema =
  typeof window === 'undefined'
    ? z.any()
    : z.object({
        firstname: z.string().refine((x) => x.length > 1, { message: 'Reqiuired!' }),
        lastname: z.string().refine((x) => x.length > 1, { message: 'Reqiuired!' }),
        avatar: z
          .instanceof(File)
          .refine((file) => {
            return file.size <= MAX_FILE_SIZE
          }, `Max image size is 2MB!`)
          .refine((file) => {
            return (
              file.type === 'image/png' ||
              file.type === 'image/jpg' ||
              file.type === 'image/jpeg' ||
              file.type === 'image/webp'
            )
          }, `Not allowed file format!`)
          .optional()
          .or(z.string())
          .or(z.null())
      })

export const MyAccountForm = ({ user }: { user: UserProfileDetail }) => {
  const userStore = useStore(useUserStore)
  const loading = useUserStore((state) => state.loading)

  const form = useForm<z.infer<typeof myAccountSchema>>({
    resolver: zodResolver(myAccountSchema),
    defaultValues: {
      firstname: user.firstName,
      lastname: user.lastName,
      avatar: null
    }
  })

  const { isDirty, dirtyFields } = useFormState({ control: form.control })

  const onSubmit = async (data: z.infer<typeof myAccountSchema>) => {
    userStore.setLoading(true)
    const formData = new FormData()
    const changedData = Object.keys(dirtyFields).reduce<Partial<z.infer<typeof myAccountSchema>>>(
      (acc, key) => {
        const k = key as keyof z.infer<typeof myAccountSchema>
        if (data[k] !== null && data[k] !== undefined) {
          if (k === 'avatar' && data[k] instanceof File) {
            acc[k as string] = data[k] as File
          } else {
            acc[k as string] = data[k] as string
          }
        }
        return acc
      },
      {}
    )
    appendDataToFormData(changedData, formData, 'PUT')
    userStore.updateUserProfile(formData)
    userStore.setLoading(false)
    form.reset(data)
  }

  return (
    <Form {...form}>
      <div className="w-full flex flex-col gap-6 items-end pr-1">
        <div className="w-full flex flex-row gap-6 items-center">
          <ProfileAvatarInput user={user!} form={form} />
          <div className="max-w-[450px] w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-4 pb-4 ">
              <div className="flex flex-col">
                <Text style="semibold" size="md">
                  Name
                </Text>
                <Text style="regular" size="xs" className="text-brease-gray-7">
                  Your name is going to be on the billing address
                </Text>
              </div>
              <div className="w-full flex flex-row  gap-2">
                <FormInput
                  form={form}
                  fieldName="firstname"
                  fieldLabel="First Name"
                  className="w-full"
                  required
                />
                <FormInput
                  form={form}
                  fieldName="lastname"
                  fieldLabel="Last Name"
                  className="w-full"
                  required
                />
              </div>
            </div>
            {/* <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <Text style="semibold" size="md">
                  Email Address
                </Text>
                <Text style="regular" size="xs" className="text-brease-gray-7">
                  {user!.email}
                </Text>
              </div>
              <Button
                size="sm"
                variant="secondary"
                label="Change Email Address"
                onClick={() => {
                  console.log('change email')
                }}
              />
            </div> */}
          </div>
        </div>
        {loading ? (
          <ButtonPlaceholder variant="primary" size="md">
            <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
          </ButtonPlaceholder>
        ) : (
          <Button
            variant="primary"
            label="Save"
            size="md"
            onClick={form.handleSubmit(onSubmit)}
            disabled={!isDirty}
          />
        )}
      </div>
    </Form>
  )
}
