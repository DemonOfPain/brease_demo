import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { Plus } from 'lucide-react'
import React from 'react'
import { Text } from '@/components/generic/Text'
import { z } from 'zod'
import { Form } from '@/components/shadcn/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/components/generic/form/FormInput'
import { toast } from '@/components/shadcn/ui/use-toast'
import Button from '@/components/generic/Button'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'

//TODO: call API in onSubmit
export const googleAnalyticsSchema = z.object({
  webPropertyID: z
    .string()
    .refine((value) => /^(UA-\d{4,9}-\d{1,4}|G-[A-Z0-9]{10,}|AW-\d{9}|DC-\d{4,8})$/.test(value), {
      message:
        'Invalid Google Web Property ID. It should be in the format UA-xxxxx-yy, G-xxxxxxxx, AW-xxxxxxxxx, or DC-xxxxxxxx.'
    })
})
export const GoogleAnalyticsDialog = () => {
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof googleAnalyticsSchema>>({
    resolver: zodResolver(googleAnalyticsSchema),
    defaultValues: {
      webPropertyID: ''
    }
  })

  async function onSubmit(data: z.infer<typeof googleAnalyticsSchema>) {
    console.log(data)
    toast({
      title: 'You submitted the following values:',
      description: (
        <>
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
          <span>See console for more</span>
        </>
      )
    })
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <ButtonPlaceholder
          variant="secondary"
          label="Configure"
          size="sm"
          className="!py-1 !px-2"
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 max-w-[680px]">
        <div className="w-full flex flex-col divide-y">
          <div className="w-full py-6 px-6 flex flex-row gap-4 items-start">
            <AlertDialogCancel className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200">
              <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
            </AlertDialogCancel>
            <div className="flex flex-col gap-2 w-full">
              <Text size="lg" style="semibold">
                Google Analytics
              </Text>
              <Text size="sm" style="regular" className="text-brease-gray-8">
                <div>
                  <a
                    href="https://developers.google.com/analytics"
                    className="underline text-brease-primary"
                  >
                    Google Analytics
                  </a>{' '}
                  is a free (registration required) website traffic and marketing effectiveness
                  service.
                </div>
              </Text>
            </div>
          </div>
          <Form {...form}>
            <form className="w-full flex flex-col gap-4 py-6 px-6">
              <Text size="lg" style="semibold">
                Web Property ID
              </Text>
              <FormInput form={form} fieldName="webPropertyID" type="input" />
              <Text size="xxs" style="regular" className="text-brease-gray-8">
                This ID is unique to each site you want to track separately, and is in the form of
                UA-xxxxx-yy, G-xxxxxxxx, AW-xxxxxxxxx, or DC-xxxxxxxx. To get a Web Property ID,
                register your site with Google Analytics, or if you already have registered your
                site, go to your Google Analytics Settings page to see the ID next to every site
                profile. Find more information in the documentation.
              </Text>
              <div className="w-full flex justify-end">
                <Button
                  size="md"
                  label="Save"
                  variant="primary"
                  onClick={form.handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
