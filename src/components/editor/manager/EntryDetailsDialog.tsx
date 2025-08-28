import React, { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState, useWatch } from 'react-hook-form'
import { Form } from '@/components/shadcn/ui/form'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/components/shadcn/ui/alert-dialog'
import { Text } from '@/components/generic/Text'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { FormInput } from '@/components/generic/form/FormInput'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { CollectionEntry } from '@/interface/manager'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useStore } from 'zustand'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { slugifyString } from '@/lib/helpers/slugifyString'

export const EntryDetailsDialog = ({ editorData }: { editorData?: CollectionEntry | null }) => {
  const managerStore = useStore(useManagerStore)
  const loading = useManagerStore((state) => state.loading)

  const entryDetailsSchema = z.object({
    name: z.string().max(50, {
      message: `Entry name must be less than 50 characters!`
    }),
    slug: z.string().max(50, {
      message: `Slug name must be less than 50 characters!`
    })
  })

  async function onSubmit(data: z.infer<typeof entryDetailsSchema>) {
    managerStore.setLoading(true)
    let formData = new FormData()
    appendDataToFormData(
      {
        ...data,
        status: editorData ? editorData.status : 'draft',
        disabled: editorData ? editorData.disabled : false
      },
      formData,
      editorData ? 'PUT' : 'POST'
    )
    editorData
      ? managerStore.updateEntry(editorData.uuid, formData)
      : managerStore.addEntry(formData)
    managerStore.setLoading(false)
    form.reset()
  }

  const form = useForm<z.infer<typeof entryDetailsSchema>>({
    resolver: zodResolver(entryDetailsSchema),
    defaultValues: {
      name: editorData?.name || '',
      slug: editorData?.slug || ''
    }
  })
  const { isDirty, errors } = useFormState({ control: form.control })
  const hasErrors = Object.keys(errors).length > 0

  const watchedName = useWatch({
    control: form.control,
    name: 'name'
  })
  useEffect(() => {
    if (watchedName) {
      const generatedSlug = slugifyString(watchedName)
      form.setValue('slug', generatedSlug, { shouldValidate: true })
    }
  }, [watchedName, form])

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
            {editorData ? 'Update Entry' : 'Create New Entry'}
          </Text>
          <FormInput form={form} fieldName="name" placeholder="Name" type="input" required />
          <FormInput form={form} fieldName="slug" placeholder="Slug" type="input" />
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
            {editorData ? 'Save' : 'Create'}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
