'use client'
import { SitePage } from '@/interface/site'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState, useWatch } from 'react-hook-form'
import { Form } from '@/components/shadcn/ui/form'
import { FormInput } from '@/components/generic/form/FormInput'
import Button from '@/components/generic/Button'
import { Text } from '@/components/generic/Text'
import { FormInputWithPrefix } from '@/components/generic/form/FormInputWithPrefix'
import { FormTextArea } from '@/components/generic/form/FormTextArea'
import { FormSwitch } from '@/components/generic/form/FormSwitch'
import { InputRow } from '@/components/generic/form/InputRow'
import { TitleRow } from '@/components/generic/form/TitleRow'
import { useRouter } from 'next/navigation'
import { OGImageInput } from './OGImageInput'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { useEffect } from 'react'
import FormSelect from '@/components/generic/form/FormSelect'
import { FormCodeInput } from '@/components/generic/form/FormCodeInput'
import { slugifyString } from '@/lib/helpers/slugifyString'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { UserRole } from '@/interface/user'

type PageDetailsFormProps = {
  page?: SitePage
}

export const PageDetailsForm = ({ page }: PageDetailsFormProps) => {
  const {
    site,
    pages,
    locales,
    pageDetailsLocale,
    loading,
    setLoading,
    createPage,
    updatePage,
    setPageDetailsLocale
  } = useSiteStore()
  const { user } = useUserStore()
  const router = useRouter()
  const MAX_FILE_SIZE = 5000000 //

  const pageDetailsSchema = z.object({
    name: page?.slug != '/' ? z.string().min(1, { message: '' }) : z.string().optional(),
    slug:
      page?.slug != '/'
        ? z
            .string()
            .min(2, { message: 'Slug is required' })
            .regex(/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/, {
              message:
                'Slug must start with / and contain only lowercase letters, numbers, and hyphens.'
            })
            .refine(
              (slug) => {
                if (page && page.slug === slug) return true
                return !pages?.some((page) => page.slug === slug)
              },
              { message: 'This URL slug is already in use by another page' }
            )
        : z.string().optional(),
    parent: z.string().optional(),
    metaDescription: z
      .string()
      .max(150, { message: 'Maximum length is 150 characters!' })
      .optional(),
    indexing: z.boolean(),
    openGraphTitle: z.string().optional(),
    openGraphDescription: z.string().optional(),
    openGraphImage: z
      .union([
        z
          .instanceof(FileList)
          .transform((fileList) => fileList.item(0))
          .refine((file): file is File => file !== null, 'File is required')
          .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB!`)
          .refine(
            (file) => ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type),
            `Not allowed file format!`
          ),
        z
          .instanceof(File)
          .refine((file): file is File => file !== null, 'File is required')
          .refine((file) => file.size <= MAX_FILE_SIZE, `Max image size is 5MB!`)
          .refine(
            (file) => ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type),
            `Not allowed file format!`
          ),
        z.string(),
        z.literal(''),
        z.null()
      ])
      .optional(),
    variables: z.string().optional()
  })

  const form = useForm<z.infer<typeof pageDetailsSchema>>({
    resolver: zodResolver(pageDetailsSchema),
    defaultValues: {
      name: page?.name || '',
      slug: page?.slug || '',
      metaDescription: page?.metaDescription || '',
      indexing: page?.indexing ?? true,
      openGraphTitle: page?.openGraphTitle || '',
      openGraphDescription: page?.openGraphDescription || '',
      openGraphImage: page?.openGraphImage || '',
      parent: page?.parent?.uuid || '',
      variables: page?.variables || ''
    }
  })

  useEffect(() => {
    if (page?.uuid) {
      form.reset({
        name: page?.name || '',
        slug: page?.slug || '',
        metaDescription: page?.metaDescription || '',
        indexing: page?.indexing ?? true,
        openGraphTitle: page?.openGraphTitle || '',
        openGraphDescription: page?.openGraphDescription || '',
        openGraphImage: page?.openGraphImage || '',
        parent: page?.parent?.uuid || '',
        variables: page?.variables || ''
      })
    }
  }, [page])

  // Auto-slugify the slug field from the name while slug hasn't been manually edited (non-homepage only)
  const watchedName = useWatch({ control: form.control, name: 'name' })
  useEffect(() => {
    if (page?.slug === '/') return
    const nameValue = typeof watchedName === 'string' ? watchedName.trim() : ''
    if (!nameValue) return
    const { isDirty: slugDirty } = form.getFieldState('slug')
    if (slugDirty) return
    const timeoutId = setTimeout(() => {
      const slugified = slugifyString(nameValue)
      form.setValue('slug', slugified, { shouldValidate: true, shouldDirty: false })
    }, 150)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [watchedName, page?.slug, form])

  const getFullParentPath = (parentId: string | undefined): string => {
    if (!parentId || !pages) return ''
    const parentPage = pages.find((p) => p.uuid === parentId)
    if (!parentPage) return ''
    const parentParentPath = parentPage.parent ? getFullParentPath(parentPage.parent.uuid) : ''
    if (parentPage.slug === '/') return ''
    return `${parentParentPath}${parentPage.slug}`
  }

  const parentPath = getFullParentPath(form.getValues('parent'))

  const { isDirty } = useFormState({ control: form.control })

  const formValues = form.watch()

  async function onSubmit(data: z.infer<typeof pageDetailsSchema>) {
    let formData = new FormData()
    setLoading(true)
    if (!page) {
      appendDataToFormData(data, formData, 'POST')
      const create = await createPage(formData)
      if (create.ok) router.push(`/dashboard/sites/${site.uuid}/pages/${create.data.page.uuid}`)
    } else {
      appendDataToFormData(data, formData, 'PUT')
      await updatePage(formData)
      form.reset(data)
    }
    setLoading(false)
  }

  return (
    <div className="w-full pb-4">
      <Form {...form}>
        <form className="w-full flex flex-col gap-4 items-end">
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-row justify-between items-center">
              <TitleRow title="Page Management" desc="Specify this page's attributes.">
                {page && locales && locales.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-0 border rounded-md flex divide-x items-center bg-brease-gray-1 border-brease-gray-5">
                      <Text size="sm" style="medium" className="!px-2 !py-[6px]">
                        Language
                      </Text>
                      <Text size="sm" style="semibold" className="!px-2 !py-[6px] uppercase">
                        {pageDetailsLocale}
                      </Text>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" sideOffset={9}>
                      {locales.map((locale) => (
                        <DropdownMenuItem
                          className={`hover:!bg-brease-gray-2 rounded-md ${locale.code === pageDetailsLocale && '!bg-brease-gray-2'}`}
                          key={locale.uuid}
                          onClick={() => setPageDetailsLocale(locale.code)}
                        >
                          {locale.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TitleRow>
            </div>
            <InputRow title="Page" borderTop={false} borderBottom={false}>
              <div className="w-1/2 flex flex-col justify-between gap-4">
                <FormInput
                  form={form}
                  fieldName="name"
                  fieldLabel="Page Name"
                  required
                  disabled={page?.slug === '/'}
                />
                {pages && page?.slug !== '/' && (
                  <FormSelect
                    form={form}
                    fieldName="parent"
                    fieldLabel="Parent Page"
                    items={pages
                      ?.filter((p) => p.uuid !== page?.uuid && p?.slug !== '/')
                      .map((p) => {
                        return { value: p.uuid, label: p.name }
                      })}
                    required={false}
                  />
                )}
              </div>
            </InputRow>
            <div className="w-full flex justify-end border-b border-brease-gray-4 pb-4">
              <div className={parentPath && page?.slug !== '/' ? 'w-full' : 'w-1/2'}>
                <FormInputWithPrefix
                  form={form}
                  fieldName="slug"
                  fieldLabel="URL Slug"
                  required
                  prefix={`www.${site.domain}${parentPath}`}
                  disabled={page?.slug === '/'}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <TitleRow
              title="SEO Settings"
              desc={
                page?.slug === '/'
                  ? 'Specify the Home Page metadata. By default every other page will use these settings.'
                  : "Specify this page's metadata"
              }
            />
            <InputRow title="Meta Description" borderTop={false}>
              <div className="w-1/2">
                <FormTextArea form={form} fieldName="metaDescription" required={false} />
              </div>
            </InputRow>
            <InputRow title="Serach Result Preview" isRow={false} borderTop={false}>
              <div className="w-full p-[14px] rounded-md border-brease-gray-4 border flex flex-col">
                <Text style="medium" size="xl" className="text-[#536FFF]">
                  {`${site.name}`}
                  {page?.slug != '/' && ` - ${formValues.name}`}
                </Text>
                <Text style="medium" size="xs" className="text-brease-primary">
                  {`${site.domain}`}
                  {page?.slug != '/' && `${parentPath}${formValues.slug}`}
                </Text>
                <Text style="regular" size="xs">
                  {formValues.metaDescription}
                </Text>
              </div>
            </InputRow>
            <InputRow
              title="Sitemap Indexing"
              desc="Show this page in the auto-generated sitemap"
              borderTop={false}
            >
              <div className="w-1/2">
                <FormSwitch form={form} fieldName="indexing" required={false} />
              </div>
            </InputRow>
            <InputRow title="Open Graph Settings" borderTop={false} borderBottom={false}>
              <div className="w-1/2 flex flex-col gap-4">
                <FormInput form={form} fieldName="openGraphTitle" fieldLabel="OG Title" />
                <FormTextArea
                  form={form}
                  fieldName="openGraphDescription"
                  fieldLabel="OG Description"
                  required={false}
                />
              </div>
            </InputRow>
            <OGImageInput form={form} page={page} />
            {user.currentTeam.userRole === UserRole.administrator && (
              <InputRow
                title="Page Variables"
                desc="Define custom variables for this page. (Advanced users only!)"
                borderTop={false}
                borderBottom={false}
              >
                <div className="w-2/3">
                  <FormCodeInput form={form} fieldName="variables" required={false} />
                </div>
              </InputRow>
            )}
          </div>
          
          
          {loading ? (
            <ButtonPlaceholder variant="primary" size="md" className="w-full justify-center">
              <LoaderCircleIcon className="h-5 w-5 stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <Button
              variant="primary"
              label={page ? 'Save' : 'Create Page'}
              size="md"
              onClick={form.handleSubmit(onSubmit)}
              className="w-full justify-center"
              disabled={!isDirty}
            />
          )}
        </form>
      </Form>
    </div>
  )
}
