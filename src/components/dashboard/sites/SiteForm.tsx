'use client'
import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import { Form } from '@/components/shadcn/ui/form'
import { FormInput } from '@/components/generic/form/FormInput'
import { InputRow } from '@/components/generic/form/InputRow'
import { FormSwitch } from '@/components/generic/form/FormSwitch'
import Button from '@/components/generic/Button'
import { FormInputWithPrefix } from '@/components/generic/form/FormInputWithPrefix'
import { useRouter } from 'next/navigation'
import { SiteDetail } from '@/interface/site'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useStore } from 'zustand'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { LoaderCircleIcon } from 'lucide-react'

const newSiteSchema = z.object({
  name: z.string().min(1, { message: '' }),
  domain: z
    .string()
    .min(1, { message: '' })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, {
      message: 'Invalid domain format'
    }),
  indexing: z.boolean(),
  previewDomain: z.string().optional()
  // hasMultiLocale: z.boolean(),
  // customCode: ???
})

export const SiteForm = ({ site }: { site?: SiteDetail }) => {
  const router = useRouter()
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)

  const form = useForm<z.infer<typeof newSiteSchema>>({
    resolver: zodResolver(newSiteSchema),
    defaultValues: {
      name: site?.name || '',
      domain: site?.domain || '',
      indexing: site?.sitemapIndexing ?? false,
      previewDomain: site?.previewDomain || ''
    }
  })

  const { isDirty } = useFormState({ control: form.control })

  async function onSubmit(data: z.infer<typeof newSiteSchema>) {
    siteStore.setLoading(true)
    if (site) {
      await siteStore.updateSite(data)
      form.reset(data)
    } else {
      const create = await siteStore.createSite(data)
      if (create.ok) router.push(`/dashboard/sites`)
    }
    siteStore.setLoading(false)
  }

  return (
    <div className="w-full pb-6">
      <Form {...form}>
        <form className="w-full flex flex-col gap-4 items-end">
          <div className="w-full flex flex-col">
            <InputRow title="Site Name" desc="Site name is included in xml" borderTop={false}>
              <div className="w-1/2 flex flex-col gap-4">
                <FormInput form={form} fieldName="name" required />
              </div>
            </InputRow>
            <InputRow title="Domain" desc="The domain of your site" borderTop={false}>
              <div className="w-1/2 flex flex-col gap-4">
                <FormInputWithPrefix prefix="www." form={form} fieldName="domain" required />
              </div>
            </InputRow>
            <InputRow
              title="Sitemap Indexing"
              desc="Enable indexing of pages for this site. We recommend turning this off while the site is under development, because it can lead to bad SEO while there is missing content on the site."
              borderTop={false}
              borderBottom={false}
            >
              <div className="w-1/2">
                <FormSwitch form={form} fieldName="indexing" required />
              </div>
            </InputRow>
            <InputRow
              title="Site Preview"
              desc="A preview domain for your site. Providing this url will enable live preview in Page Builder."
              borderTop={false}
              borderBottom={false}
            >
              <div className="w-1/2 flex flex-col gap-4">
                <FormInput form={form} fieldName="previewDomain" />
              </div>
            </InputRow>
          </div>
          {loading ? (
            <ButtonPlaceholder variant="primary" size="md" className="mr-[2px]">
              <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <Button
              variant="primary"
              label={site ? 'Save' : 'Create Site'}
              size="md"
              onClick={form.handleSubmit(onSubmit)}
              className="mr-[2px]"
              disabled={!isDirty}
            />
          )}
        </form>
      </Form>
    </div>
  )
}
