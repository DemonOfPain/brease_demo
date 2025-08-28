'use client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { FormInput } from '@/components/generic/form/FormInput'
import FormSelect from '@/components/generic/form/FormSelect'
import { Form } from '@/components/shadcn/ui/form'
import { SiteRedirect } from '@/interface/site'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { z } from 'zod'
import { Text } from '@/components/generic/Text'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useStore } from 'zustand'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface RedirectDialogProps {
  redirect?: SiteRedirect
  onClose?: () => void
}

export const RedirectDialog = ({ redirect, onClose }: RedirectDialogProps) => {
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)
  const [open, setOpen] = useState(false)

  // If onClose is provided, we're in external dialog mode (for editing)
  const isExternalDialog = !!onClose

  const redirectDetailsSchema = z.object({
    source: z
      .string()
      .min(1, 'Source URL is required')
      .refine(
        (value) => value.startsWith('/') || value.startsWith('http'),
        'Source URL must start with / or http'
      ),
    destination: z
      .string()
      .min(1, 'Destination URL is required')
      .refine(
        (value) => value.startsWith('/') || value.startsWith('http'),
        'Destination URL must start with / or http'
      ),
    type: z.enum(['301', '302', '307', '308'], {
      required_error: 'Redirect type is required'
    })
  })

  const redirectTypeOptions = [
    { value: '301', label: '301 - Permanent' },
    { value: '302', label: '302 - Temporary' },
    { value: '307', label: '307 - Temporary (Preserve Method)' },
    { value: '308', label: '308 - Permanent (Preserve Method)' }
  ]

  async function onSubmit(data: z.infer<typeof redirectDetailsSchema>) {
    siteStore.setLoading(true)
    const formData = new FormData()
    const redirectData = {
      ...data,
      type: parseInt(data.type) as 301 | 302 | 307 | 308
    }

    if (!redirect) {
      appendDataToFormData(redirectData, formData, 'POST')
      await siteStore.addRedirect(formData, undefined, { showSuccessToast: true })
    } else {
      appendDataToFormData(redirectData, formData, 'PUT')
      await siteStore.updateRedirect(redirect.uuid, formData, undefined, { showSuccessToast: true })
    }

    form.reset()
    if (isExternalDialog) {
      onClose?.()
    } else {
      setOpen(false)
    }
    siteStore.setLoading(false)
  }

  const form = useForm<z.infer<typeof redirectDetailsSchema>>({
    resolver: zodResolver(redirectDetailsSchema),
    defaultValues: {
      source: redirect?.source || '',
      destination: redirect?.destination || '',
      type: (redirect?.type?.toString() as '301' | '302' | '307' | '308') || '301'
    }
  })

  const { errors, isDirty } = useFormState({ control: form.control })
  const hasErrors = Object.keys(errors).length > 0

  // If external dialog mode, just return the content
  if (isExternalDialog) {
    return (
      <>
        <VisuallyHidden>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </VisuallyHidden>
        <AlertDialogCancel
          className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200"
          onClick={onClose}
        >
          <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
        </AlertDialogCancel>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-4 p-4">
            <Text size="lg" style="semibold">
              {redirect ? 'Edit Redirect' : 'Create New Redirect'}
            </Text>
            <FormInput
              form={form}
              fieldName="source"
              fieldLabel="Source URL"
              type="input"
              required
              placeholder="/old-page or https://external.com/page"
            />
            <FormInput
              form={form}
              fieldName="destination"
              fieldLabel="Destination URL"
              type="input"
              required
              placeholder="/new-page or https://external.com/new-page"
            />
            <FormSelect
              form={form}
              fieldName="type"
              fieldLabel="Redirect Type"
              items={redirectTypeOptions}
              required
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
              {redirect ? 'Save Changes' : 'Create Redirect'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </>
    )
  }

  // Default mode with internal dialog state (for creating new redirects)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="w-fit">
        <ButtonPlaceholder variant="black" label="Add Redirect" icon="Plus" size="md" />
      </AlertDialogTrigger>
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
              {redirect ? 'Edit Redirect' : 'Create New Redirect'}
            </Text>
            <FormInput
              form={form}
              fieldName="source"
              fieldLabel="Source URL"
              type="input"
              required
              placeholder="/old-page or https://external.com/page"
            />
            <FormInput
              form={form}
              fieldName="destination"
              fieldLabel="Destination URL"
              type="input"
              required
              placeholder="/new-page or https://external.com/new-page"
            />
            <FormSelect
              form={form}
              fieldName="type"
              fieldLabel="Redirect Type"
              items={redirectTypeOptions}
              required
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
              {redirect ? 'Save Changes' : 'Create Redirect'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
