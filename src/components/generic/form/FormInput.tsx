'use client'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/ui/form'
import { Input, InputProps } from '@/components/shadcn/ui/input'
import { icons } from 'lucide-react'
import { HTMLInputTypeAttribute } from 'react'

interface FormInputProps extends InputProps {
  form: any //TODO: type this
  id?: string
  fieldName: string
  fieldLabel?: string
  fieldDesc?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  variant?: 'default' | 'no-border'
  icon?: keyof typeof icons
  type?: HTMLInputTypeAttribute
  className?: string
  // eslint-disable-next-line no-unused-vars
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

export const FormInput = ({
  form,
  id,
  fieldName,
  fieldLabel,
  fieldDesc,
  placeholder,
  required = false,
  disabled = false,
  variant = 'default',
  icon,
  type = 'text',
  className,
  onKeyDown
}: FormInputProps) => {
  const LucideIcon = icon ? icons[icon] : null

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
              <div className="relative group">
                {icon && LucideIcon && (
                  <LucideIcon className="z-10 absolute top-[14px] left-2 h-4 w-4 stroke-brease-gray-6 group-aria-invalid:!stroke-brease-error " />
                )}
                <Input
                  className={`${icon && '!pl-8'} ${variant === 'no-border' && 'bg-brease-gray-2 border-transparent group-aria-invalid:bg-brease-error-light group-aria-invalid:border-brease-error group-aria-invalid:text-brease-error group-aria-invalid:focus-visible:ring-brease-error group-aria-invalid:focus-visible:ring-[1px]'}`}
                  id={id ? id : fieldName}
                  // required prop is only for styling, see formSchema for actual validation!
                  required={required}
                  disabled={disabled}
                  type={type}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder ? placeholder : ''}
                  {...field}
                />
              </div>
            </FormControl>
            {fieldDesc && <FormDescription>{fieldDesc}</FormDescription>}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
