import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { Switch } from '@/components/shadcn/ui/switch'
import React from 'react'

interface FormSwitchProps {
  form: any //TODO: type this
  id?: string
  fieldName: string
  fieldLabel?: string
  disabled?: boolean
  required: boolean
}

export const FormSwitch = ({
  form,
  id,
  fieldName,
  fieldLabel,
  disabled = false,
  required
}: FormSwitchProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-center gap-2">
            <FormControl>
              <Switch
                disabled={disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
                // required prop is only for styling, see formSchema for actual validation!
                required={required}
                id={id ? id : fieldName}
                {...field}
              />
            </FormControl>
            {fieldLabel && (
              <FormLabel className="!mt-0 !font-golos-regular">
                {fieldLabel}
                {required && <span className="text-brease-error"> *</span>}
              </FormLabel>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
