'use client'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { InputProps } from '@/components/shadcn/ui/input'
import { Textarea } from '@/components/shadcn/ui/textarea'

interface FormTextAreaProps extends InputProps {
  form: any //TODO: type this
  id?: string
  fieldName: string
  fieldLabel?: string
  fieldDesc?: string
  placeholder?: string
  disabled?: boolean
  required: boolean
}

export const FormTextArea = ({
  form,
  id,
  fieldName,
  fieldLabel,
  fieldDesc,
  placeholder,
  required,
  disabled = false
}: FormTextAreaProps) => {
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
            <FormControl>
              <Textarea
                className="resize-none"
                id={id ? id : fieldName}
                // required prop is only for styling, see formSchema for actual validation!
                required={required}
                disabled={disabled}
                placeholder={placeholder ? placeholder : ''}
                {...field}
              />
            </FormControl>
            {fieldDesc && <FormDescription>{fieldDesc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
