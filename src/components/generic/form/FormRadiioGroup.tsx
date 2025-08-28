import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/ui/radio-group'
import React from 'react'

type RadioGroupItem = {
  value: any
  label: string
}

interface FormRadioGroupProps {
  form: any //TODO: type this
  items: RadioGroupItem[]
  id?: string
  fieldName: string
  fieldLabel?: string
  disabled?: boolean
  required: boolean
}

export const FormRadioGroup = ({
  form,
  items,
  id,
  fieldName,
  fieldLabel,
  disabled = false,
  required
}: FormRadioGroupProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col justify-start gap-2">
            {fieldLabel && (
              <FormLabel className="!mt-0">
                {fieldLabel}
                {required && <span className="text-brease-error"> *</span>}
              </FormLabel>
            )}
            <FormControl>
              <RadioGroup
                id={id ? id : fieldName}
                required={required}
                disabled={disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                {items.map((radio: RadioGroupItem) => (
                  <FormItem key={radio.value} className="flex flex-row items-center gap-2">
                    <FormControl>
                      <RadioGroupItem value={radio.value} />
                    </FormControl>
                    <FormLabel className="!mt-0 !font-golos-regular">{radio.label}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage className="!mt-0" />
          </FormItem>
        )
      }}
    />
  )
}
