'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/shadcn/ui/form'
import { toast } from '@/components/shadcn/ui/use-toast'
import { ToastAction } from '@/components/shadcn/ui/toast'
import { FormInputWithPrefix } from '@/components/generic/form/FormInputWithPrefix'
import Button from '@/components/generic/Button'
import { FormInput } from '@/components/generic/form/FormInput'
import { FormCheckbox } from '@/components/generic/form/FormCheckbox'
import { FormSwitch } from '@/components/generic/form/FormSwitch'
import { FormRadioGroup } from '@/components/generic/form/FormRadiioGroup'
import { FormFileInput } from '@/components/generic/form/FormFileInput'
import FormSelect from '@/components/generic/form/FormSelect'
import { FormTextArea } from '@/components/generic/form/FormTextArea'
import { FormCheckboxWithText } from '@/components/generic/form/FormCheckboxWithText'
import { Text } from '@/components/generic/Text'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
//import { DatePicker } from '@/components/generic/DatePicker'
//import { useState } from 'react'

// Test page for generic components

const FormSchema = z.object({
  field1: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters!'
    })
    .transform((x) => (x.startsWith('https://') ? x : `${'https://'}${x}`)),
  field2: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters!'
    })
    .transform((x) => (x.startsWith('https://') ? x : `${'https://'}${x}`)),
  field3: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  field4: z.boolean().refine((x) => x, { message: '' }),
  field5: z.boolean().refine((x) => x, { message: '' }),
  field6: z.enum(['all', 'none'], {
    required_error: 'You need to select a notification type!'
  }),
  field7:
    typeof window === 'undefined'
      ? z.any()
      : z.instanceof(FileList).refine((x) => x.length > 0, { message: 'Required!' }),
  field8: z.string({ message: 'Must select an option!' }),
  field9: z
    .string()
    .min(1, { message: 'Required!' })
    .max(10, { message: 'Maximum 10 characters!' }),
  field10: z.boolean().refine((x) => x, { message: '' })
})

const ComponentTestpage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      field1: '',
      field2: '',
      field3: '',
      field4: false,
      field5: false,
      field7: undefined
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
  }

  //const [date,setDate] = useState<Date>()
  return (
    <div className="w-full max-w-screen-xl mx-auto flex flex-row items-center justify-center py-16 bg-brease-gray-2">
      <Form {...form}>
        <form className="w-1/3 space-y-6">
          <FormInputWithPrefix
            form={form}
            prefix="https://"
            fieldName="field1"
            fieldDesc="Description"
            fieldLabel="Input with Prefix Label"
            placeholder="Placeholder"
            required
            variant="tag"
          />
          <FormInputWithPrefix
            form={form}
            prefix="https://"
            fieldName="field2"
            fieldDesc="Description"
            fieldLabel="Input with Prefix Label"
            placeholder="Placeholder"
            required
          />
          <FormInput
            form={form}
            fieldName="field3"
            fieldDesc="Description"
            fieldLabel="Input Label"
            placeholder="Placeholder"
            required
          />
          <FormCheckbox form={form} fieldName="field4" fieldLabel="Checkbox Label" required />
          <FormSwitch form={form} fieldName="field5" fieldLabel="Switch Label" required />
          <FormRadioGroup
            form={form}
            items={[
              {
                label: 'All',
                value: 'all'
              },
              {
                label: 'None',
                value: 'none'
              }
            ]}
            fieldName="field6"
            fieldLabel="Radio Group Label"
            required
          />
          <FormFileInput
            form={form}
            fieldName="field7"
            fieldLabel="Input Label"
            fieldDesc="Description"
            required
          />
          <FormSelect
            form={form}
            items={[
              {
                value: 'option-1',
                label: 'Option 1'
              },
              {
                value: 'option-2',
                label: 'Option 2'
              },
              {
                value: 'option-3',
                label: 'Option 3'
              }
            ]}
            placeholder="Select an option"
            fieldName="field8"
            fieldLabel="Select Label"
            fieldDesc="Description"
            required
          />
          <FormTextArea
            form={form}
            placeholder="Placeholder"
            fieldName="field9"
            fieldLabel="TextArea Label"
            fieldDesc="Description"
            required
          />
          <FormCheckboxWithText form={form} label="Label" fieldName="field10" required />

          <Button variant="black" size="md" label="Button" onClick={() => null} />

          <ButtonPlaceholder variant="black" size="md" label="ButtonPlaceholder" />

          <Text style="semibold" size="sm">
            Toast variants
          </Text>

          <Text style="regular" size="xs">
            Light mode
          </Text>

          <div className="flex flex-row gap-4 pb-0">
            <Button
              variant="secondary"
              size="md"
              label="Success"
              onClick={() => {
                toast({
                  variant: 'success',
                  title:
                    'Succes type / variant:success, mostly the title will be used for messages',
                  description: '',
                  action: (
                    <div className="flex flex-row">
                      <ToastAction altText="Undo">Undo</ToastAction>
                      <ToastAction altText="Action">Action</ToastAction>
                    </div>
                  )
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Error"
              onClick={() => {
                toast({
                  variant: 'error',
                  title: 'Error type / variant:error',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Warning"
              onClick={() => {
                toast({
                  variant: 'warning',
                  title: 'Warning type / variant:warning',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Notification"
              onClick={() => {
                toast({
                  variant: 'notification',
                  title: 'Notification type / variant:notification',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
          </div>

          <Text style="regular" size="xs">
            Dark mode
          </Text>

          <div className="flex flex-row gap-4 pb-8">
            <Button
              variant="secondary"
              size="md"
              label="Success"
              onClick={() => {
                toast({
                  variant: 'successLight',
                  title:
                    'Succes type / variant:success, mostly the title will be used for messages',
                  description: '',
                  action: (
                    <div className="flex flex-row">
                      <ToastAction altText="Undo">Undo</ToastAction>
                      <ToastAction altText="Action">Action</ToastAction>
                    </div>
                  )
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Error"
              onClick={() => {
                toast({
                  variant: 'errorLight',
                  title: 'Error type / variant:error',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Warning"
              onClick={() => {
                toast({
                  variant: 'warningLight',
                  title: 'Warning type / variant:warning',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
            <Button
              variant="secondary"
              size="md"
              label="Notification"
              onClick={() => {
                toast({
                  variant: 'notificationLight',
                  title: 'Notification type / variant:notification',
                  description:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
                })
              }}
            />
          </div>

          <Button
            variant="primary"
            size="md"
            label="Submit"
            onClick={form.handleSubmit(onSubmit)}
          />
          {/*<DatePicker date={date} setDate={setDate}/>*/}
        </form>
      </Form>
    </div>
  )
}

export default ComponentTestpage
