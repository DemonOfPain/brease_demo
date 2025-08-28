import { CheckboxWithText } from '@/components/shadcn/ui/checkbox'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import React from 'react'

interface FormCheckboxWithTextProps {
  form: any //TODO: type this
  id?: string
  label: string
  fieldName: string
  disabled?: boolean
  required: boolean
}

export const FormCheckboxWithText = ({
  form,
  id,
  label,
  fieldName,
  disabled = false,
  required
}: FormCheckboxWithTextProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row justify-start items-start h-fit gap-1">
            <FormControl>
              <CheckboxWithText
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                // required prop is only for styling, see formSchema for actual validation!
                required={required}
                id={id ? id : fieldName}
                {...field}
              >
                {label}
              </CheckboxWithText>
            </FormControl>
            {required && <span className="text-brease-error h-full !mt-0 mb-auto"> *</span>}
            <FormMessage className="!mt-0 " />
          </FormItem>
        )
      }}
    />
  )
}
