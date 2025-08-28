import { Collection, Section } from '@/interface/editor'
import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import { Form } from '@/components/shadcn/ui/form'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/components/shadcn/ui/alert-dialog'
import { FormInput } from '../generic/form/FormInput'
import { Text } from '@/components/generic/Text'
import { FormTextArea } from '../generic/form/FormTextArea'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { Switch } from '@/components/shadcn/ui/switch'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useStore } from 'zustand'

export const CollectionDetailsDialog = ({ editorData }: { editorData?: Collection }) => {
  const editorStore = useStore(useEditorStore)
  const loading = useEditorStore((state) => state.loading)

  const collectionDetailsSchema = z.object({
    name: z.string().max(50, {
      message: `Collection name must be less than 50 characters!`
    }),
    description: z.string().max(100, {
      message: `Collection name must be less than 100 characters!`
    })
  })

  const form = useForm<z.infer<typeof collectionDetailsSchema>>({
    resolver: zodResolver(collectionDetailsSchema),
    defaultValues: {
      name: editorData?.name || '',
      description: editorData?.description || ''
    }
  })

  React.useEffect(() => {
    if (editorData) {
      form.reset({
        name: editorData.name || '',
        description: editorData.description || ''
      })
    }
  }, [editorData])

  async function onSubmit(data: z.infer<typeof collectionDetailsSchema>) {
    editorStore.setLoading(true)
    let formData = new FormData()
    if (!editorData?.uuid) {
      appendDataToFormData(data, formData, 'POST')
      editorStore.create(formData)
    } else {
      appendDataToFormData(data, formData, 'PUT')
      editorStore.update(formData)
    }
    editorStore.setLoading(false)
    form.reset()
  }

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
            {editorData ? 'Edit Collection' : 'Create New Collection'}
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
            {editorData ? 'Save' : 'Create'}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

export const SectionDetailsDialog = ({ editorData }: { editorData?: Section | null }) => {
  const editorStore = useStore(useEditorStore)
  const loading = useEditorStore((state) => state.loading)
  const sections = useEditorStore((state) => state.sections)

  const [customKey, setCustomKey] = useState(!!editorData?.key)

  React.useEffect(() => {
    if (editorData) {
      form.reset({
        name: editorData.name || '',
        key: editorData.key || '',
        description: editorData.description || ''
      })
      setCustomKey(!!editorData.key)
    }
  }, [editorData])

  const sectionDetailsSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }).max(50, {
      message: `Section name must be less than 50 characters!`
    }),
    key: z
      .string()
      .min(1, { message: 'Key is required' })
      .max(50, { message: 'Key must be less than 50 characters' })
      .refine(
        (value) => {
          if (editorData?.key === value) return true
          return !sections!.some((section) => section.key === value)
        },
        { message: 'This key is already in use!' }
      ),
    description: z.string().max(100, {
      message: `Description must be less than 100 characters!`
    })
  })

  const form = useForm<z.infer<typeof sectionDetailsSchema>>({
    resolver: zodResolver(sectionDetailsSchema),
    defaultValues: {
      name: editorData?.name || '',
      key: editorData?.key || '',
      description: editorData?.description || ''
    },
    mode: 'onChange'
  })

  const nameValue = form.watch('name')

  React.useEffect(() => {
    if (!customKey) {
      const generatedKey = nameValue
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word : word.toUpperCase()))
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
      form.setValue('key', generatedKey, { shouldDirty: true })
    }
  }, [nameValue, customKey, form])

  async function onSubmit(data: z.infer<typeof sectionDetailsSchema>) {
    editorStore.setLoading(true)
    let formData = new FormData()
    if (!editorData?.uuid) {
      appendDataToFormData(data, formData, 'POST')
      editorStore.create(formData)
    } else {
      appendDataToFormData(data, formData, 'PUT')
      editorStore.update(formData)
    }
    editorStore.setLoading(false)
    form.reset()
  }

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
            {editorData ? 'Edit' : 'Create New'} Section
          </Text>
          <FormInput form={form} fieldName="name" fieldLabel="Name" type="input" required />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Custom Key
              </label>
              <Switch checked={customKey} onCheckedChange={setCustomKey} />
            </div>
            <FormInput form={form} fieldName="key" type="input" required disabled={!customKey} />
          </div>
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
            {editorData ? 'Save' : 'Create'}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
