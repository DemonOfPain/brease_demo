'use client'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { CustomCodeEditor } from '@/components/editor/builder/CustomCodeEditor'

interface FormCodeInputProps {
  form: any //TODO: type this
  fieldName: string
  fieldLabel?: string
  fieldDesc?: string
  required?: boolean
  className?: string
  height?: string | number
  width?: string | number
}

export const FormCodeInput = ({
  form,
  fieldName,
  fieldLabel,
  fieldDesc,
  required = false,
  className,
  height = '200px',
  width = '100%'
}: FormCodeInputProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        return (
          <FormItem className={className && className}>
            {fieldLabel && (
              <FormLabel>
                {fieldLabel}
                {required && <span className="text-brease-error"> *</span>}
              </FormLabel>
            )}
            <FormControl>
              <CustomCodeEditor
                initialValue={field.value}
                height={height}
                width={width}
                onChange={field.onChange}
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
