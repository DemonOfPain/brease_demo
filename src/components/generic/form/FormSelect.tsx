import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import React from 'react'
import { Text } from '../Text'

type FormSelectItem = {
  value: string
  label: string
}

interface FormSelectProps {
  form: any //TODO: type this
  items: FormSelectItem[]
  placeholder?: string
  fieldName: string
  fieldDesc?: string
  fieldLabel?: string
  disabled?: boolean
  required: boolean
}

const FormSelect = ({
  form,
  items,
  placeholder,
  fieldName,
  fieldLabel,
  fieldDesc,
  disabled,
  required
}: FormSelectProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem>
            {fieldLabel && (
              <FormLabel>
                {fieldLabel}
                {required && <span className="text-brease-error"> *</span>}
              </FormLabel>
            )}
            <Select
              // required prop is only for styling, see formSchema for actual validation!
              required={required}
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder ? placeholder : ''} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {items.length === 0 && (
                  <div className="w-full py-1 flex justify-center">
                    <Text size="sm" style="medium" className="!text-brease-gray-7">
                      No available options.
                    </Text>
                  </div>
                )}
                {items.map((selectItem) => (
                  <SelectItem key={selectItem.value} value={selectItem.value}>
                    {selectItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldDesc && <FormDescription>{fieldDesc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default FormSelect
