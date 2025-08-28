import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { FormInput } from '@/components/generic/form/FormInput'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle
} from '@/components/shadcn/ui/alert-dialog'
import { Form } from '@/components/shadcn/ui/form'
import { SiteNavigation, SiteNavigationItem } from '@/interface/site'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import { z } from 'zod'
import { Text } from '@/components/generic/Text'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import FormSelect from '@/components/generic/form/FormSelect'
import { SitePage } from '@/interface/site'
import { Media } from '@/interface/media'
import { CollectionEntry } from '@/interface/manager'
import { useManagerStore } from '@/lib/hooks/useManagerStore'

export const NavigationItemDialog = ({
  nav,
  navItem,
  parent
}: {
  nav: SiteNavigation
  navItem?: SiteNavigationItem
  parent?: SiteNavigationItem
}) => {
  const {
    pages,
    getAllSitePages,
    navigationItems,
    loading,
    setLoading,
    addNavigationItem,
    updateNavigationItem
  } = useSiteStore()
  const { mediaLib, getLibrary } = useMediaStore()
  const { allEntries, getAllEntries } = useManagerStore()

  const [sitePages, setSitePages] = React.useState<SitePage[] | null>(null)
  const [media, setMedia] = React.useState<Media[] | null>(null)
  const [entries, setEntries] = React.useState<CollectionEntry[] | null>(null)

  const isAncestor = React.useCallback((item: SiteNavigationItem, childUuid: string): boolean => {
    if (item.uuid === childUuid) return true
    return item.children.some(
      (childItem) => childItem.uuid === childUuid || isAncestor(childItem, childUuid)
    )
  }, [])

  const flattenNavigationItems = React.useCallback(
    (items: SiteNavigationItem[] | null): SiteNavigationItem[] => {
      if (!items) return []
      let result: SiteNavigationItem[] = []
      items.forEach((item) => {
        result.push(item)
        if (item.children && item.children.length > 0) {
          result = [...result, ...flattenNavigationItems(item.children)]
        }
      })
      return result
    },
    []
  )

  const getAvailableTargets = React.useCallback(async () => {
    if (!pages) await getAllSitePages()
    if (!mediaLib) await getLibrary()
    if (!allEntries) await getAllEntries()
    setSitePages(pages)
    setMedia(mediaLib)
    setEntries(allEntries)
  }, [pages, mediaLib, allEntries, navigationItems])

  useEffect(() => {
    getAvailableTargets()
  }, [])

  const navigationItemDetailsSchema = z.object({
    value: z.string().max(50, {
      message: `Navigation item name must be less than 50 characters!`
    }),
    target: z
      .object({
        type: z.enum(['page', 'medium', 'entry', 'url', 'placeholder']),
        uuid: z.string().nullable(),
        url: z
          .string()
          .url()
          .nullable()
          .transform((val) => val || null)
      })
      .refine(
        (data) => {
          if (data.type === 'placeholder') {
            return true
          }
          if (data.type !== 'url') {
            return !!data.uuid
          }
          if (data.type === 'url') {
            return !!data.url
          }
          return true
        },
        {
          message: 'Either UUID or URL must be provided based on target type'
        }
      ),
    parent: z.string().nullable().optional()
  })

  const form = useForm<z.infer<typeof navigationItemDetailsSchema>>({
    resolver: zodResolver(navigationItemDetailsSchema),
    defaultValues: {
      value: navItem?.value || '',
      target: {
        type: navItem?.target.type || 'page',
        uuid: navItem?.target.uuid || null,
        url: navItem?.target.url || null
      },
      parent: navItem?.parent || parent?.uuid || null
    }
  })

  const targetType = form.watch('target.type')
  const targetTypeOptions = [
    { value: 'page', label: 'Page' },
    { value: 'medium', label: 'Media' },
    { value: 'entry', label: 'Entry' },
    { value: 'url', label: 'External Link' },
    { value: 'placeholder', label: 'Placeholder' }
  ]
  const getTargetOptions = () => {
    switch (targetType) {
      case 'page':
        return (
          sitePages?.map((page) => ({
            value: page.uuid,
            label: page.name
          })) || []
        )
      case 'medium':
        return (
          media?.map((item) => ({
            value: item.uuid,
            label: item.name
          })) || []
        )
      case 'entry':
        return (
          entries?.map((item) => ({
            value: item.uuid,
            label: item.name
          })) || []
        )
      default:
        return []
    }
  }

  const formValues = form.watch()
  const { errors } = useFormState({ control: form.control })
  const hasErrors = Object.keys(errors).length > 0

  const isFormValid = React.useMemo(() => {
    if (!formValues.value) return false
    const target = formValues.target
    if (target.type === 'placeholder') {
      return true
    } else if (target.type === 'url') {
      return !!target.url
    } else {
      return !!target.uuid
    }
  }, [formValues])

  async function onSubmit(data: z.infer<typeof navigationItemDetailsSchema>) {
    setLoading(true)
    if (!navItem) {
      await addNavigationItem(data)
    } else {
      await updateNavigationItem(navItem.uuid, data)
    }
    setLoading(false)
    form.reset()
  }

  if (!sitePages || !media || !entries) {
    return
  } else {
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
              {nav ? 'Edit Navigation Item' : 'Add Navigation Item'}
            </Text>
            <FormInput form={form} fieldName="value" fieldLabel="Name" required={false} />
            <FormSelect
              form={form}
              fieldName="target.type"
              fieldLabel="Target Type"
              items={targetTypeOptions}
              required={false}
            />
            {targetType === 'url' && (
              <FormInput
                form={form}
                fieldName="target.url"
                fieldLabel="External URL"
                type="url"
                required={false}
                placeholder="https://example.com"
              />
            )}
            {targetType !== 'url' && targetType !== 'placeholder' && (
              <FormSelect
                form={form}
                fieldName="target.uuid"
                fieldLabel={`Select ${targetType}`}
                items={getTargetOptions()}
                required={false}
              />
            )}
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
              disabled={!isFormValid || hasErrors}
              onClick={() => onSubmit(form.getValues())}
            >
              {nav ? 'Save' : 'Create'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    )
  }
}
