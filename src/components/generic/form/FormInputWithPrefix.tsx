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

// IMPORTANT:
// the actual prefix should be placed in the
// zod schema, declaring the prefix in this component
// will not set the actual input value to be prefixed !!!
//
// ex:
// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: 'Username must be at least 2 characters.'
//   }).transform(x => x.startsWith('prefix') ? x : `${'prefix'}${x}`)
// })

interface FormInputWithPrefixProps extends InputProps {
  form: any //TODO: type this
  id?: string
  prefix: string
  fieldName: string
  fieldLabel?: string
  fieldDesc?: string
  placeholder?: string
  disabled?: boolean
  required: boolean
  variant?: 'default' | 'tag'
}

export const FormInputWithPrefix = ({
  form,
  id,
  prefix,
  fieldName,
  fieldLabel,
  fieldDesc,
  placeholder,
  required,
  disabled = false,
  variant = 'default'
}: FormInputWithPrefixProps) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => {
        if (variant === 'default') {
          return (
            <FormItem>
              {fieldLabel && (
                <FormLabel className="!text-t-xs font-golos-medium">
                  {fieldLabel}
                  {required && <span className="text-brease-error"> *</span>}
                </FormLabel>
              )}
              <FormControl>
                <div className="group flex flex-row border border-brease-gray-5 rounded-lg shadow-brease-xs focus-within:outline-none focus-within:ring-[1px] focus-within:ring-brease-gray-5 aria-invalid:border-brease-error aria-invalid:text-brease-error aria-invalid:focus-within:ring-brease-error aria-invalid:focus-within:ring-[1px]">
                  <div className="w-fit pl-3 pr-2 py-3 text-t-xs font-golos-medium text-brease-gray-8 border-r border-brease-gray-5 bg-brease-gray-2 rounded-l-lg group-aria-invalid:border-brease-error group-aria-invalid:text-brease-error group-aria-invalid:bg-brease-error-light">
                    {prefix}
                  </div>
                  <Input
                    id={id ? id : fieldName}
                    // required prop is only for styling, see formSchema for actual validation!
                    required={required}
                    disabled={disabled}
                    className="focus-visible:ring-0 shadow-none border-none rounded-l-none rounded-r-lg flex flex-1"
                    placeholder={placeholder ? placeholder : ''}
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldDesc && <FormDescription>{fieldDesc}</FormDescription>}
              <FormMessage />
            </FormItem>
          )
        } else {
          return (
            <FormItem>
              {fieldLabel && (
                <FormLabel className="!text-t-xs font-golos-medium">
                  {fieldLabel}
                  {required && <span className="text-brease-error"> *</span>}
                </FormLabel>
              )}
              <FormControl>
                <div className="group flex flex-row border border-brease-gray-5 rounded-lg shadow-brease-xs focus-within:outline-none focus-within:ring-[1px] focus-within:ring-brease-gray-5 aria-invalid:border-brease-error aria-invalid:text-brease-error aria-invalid:focus-within:ring-brease-error aria-invalid:focus-within:ring-[1px]">
                  <div
                    className={`pl-2 py-2 text-t-xs font-golos-medium bg-white rounded-l-lg ${disabled && 'opacity-50'}`}
                  >
                    <div className="py-1 px-2 rounded-md bg-brease-secondary-light-purple text-brease-secondary-purple group-aria-invalid:border-brease-error group-aria-invalid:text-brease-error group-aria-invalid:bg-brease-error-light">
                      {prefix}
                    </div>
                  </div>
                  <Input
                    required={required}
                    disabled={disabled}
                    className="peer focus-visible:ring-0 shadow-none border-none rounded-l-none rounded-r-lg"
                    placeholder={placeholder ? placeholder : ''}
                    {...field}
                  />
                </div>
              </FormControl>
              {fieldDesc && <FormDescription>{fieldDesc}</FormDescription>}
              <FormMessage />
            </FormItem>
          )
        }
      }}
    />
  )
}
