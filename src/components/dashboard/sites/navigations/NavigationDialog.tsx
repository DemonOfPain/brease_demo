import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { FormInput } from '@/components/generic/form/FormInput'
import { FormTextArea } from '@/components/generic/form/FormTextArea'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/components/shadcn/ui/alert-dialog'
import { Form } from '@/components/shadcn/ui/form'
import { SiteNavigation } from '@/interface/site'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import React from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { z } from 'zod'
import { Text } from '@/components/generic/Text'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useStore } from 'zustand'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export const NavigationDialog = ({ nav }: { nav?: SiteNavigation }) => {
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)

  const navigationDetailsSchema = z.object({
    name: z.string().max(50, {
      message: `Navigation name must be less than 50 characters!`
    }),
    description: z.string().max(100, {
      message: `Navigation name must be less than 100 characters!`
    })
  })

  async function onSubmit(data: z.infer<typeof navigationDetailsSchema>) {
    siteStore.setLoading(true)
    let formData = new FormData()
    if (!nav) {
      appendDataToFormData(data, formData, 'POST')
      siteStore.addNavigation(formData)
    } else {
      appendDataToFormData(data, formData, 'PUT')
      siteStore.updateNavigation(nav.uuid, formData)
    }
    form.reset()
    siteStore.setLoading(false)
  }

  const form = useForm<z.infer<typeof navigationDetailsSchema>>({
    resolver: zodResolver(navigationDetailsSchema),
    defaultValues: {
      name: nav?.name || '',
      description: nav?.description || ''
    }
  })
  const { isDirty, errors } = useFormState({ control: form.control })
  const hasErrors = Object.keys(errors).length > 0

  return (
    <AlertDialogContent>
      <VisuallyHidden>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription></AlertDialogDescription>
      </VisuallyHidden>
      <AlertDialogCancel className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200">
        <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
      </AlertDialogCancel>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-4 p-4">
          <Text size="lg" style="semibold">
            {nav ? 'Edit Navigation' : 'Create New Navigation'}
          </Text>
          <FormInput form={form} fieldName="name" fieldLabel="Name" type="input" required />
          <FormTextArea
            form={form}
            fieldName="description"
            fieldLabel="Description"
            required={false}
          />
        </form>
      </Form>
      <AlertDialogFooter>
        {loading ? (
          <ButtonPlaceholder variant="primary" size="md">
            <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
          </ButtonPlaceholder>
        ) : (
          <AlertDialogAction
            className="w-full justify-center mx-4 -mt-2 mb-2"
            disabled={!isDirty || hasErrors}
            onClick={() => onSubmit(form.getValues())}
          >
            {nav ? 'Save' : 'Create'}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
