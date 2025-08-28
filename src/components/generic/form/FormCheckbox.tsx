import { Checkbox } from '@/components/shadcn/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import React from 'react'

interface FormCheckboxProps {
  form: any //TODO: type this
  id?: string
  fieldName: string
  fieldLabel?: string
  disabled?: boolean
  required?: boolean
}

export const FormCheckbox = ({
  form,
  id,
  fieldName,
  fieldLabel,
  disabled = false,
  required = false
}: FormCheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-center gap-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
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
            <FormMessage className="!mt-0 " />
          </FormItem>
        )
      }}
    />
  )
}
