// @ts-nocheck
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
import { X } from 'lucide-react'

// NOTE: for form validation use the next line
// field: typeof window === 'undefined' ? z.any() : z.instanceof(FileList).refine(x => x.length > 0, {message: 'Required!'})
// this means: must include at least 1 file (any type)
// useful link : https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673

interface FormFileInputProps extends InputProps {
  form: any //TODO: type this
  id?: string
  fieldName: string
  fieldDesc?: string
  fieldLabel?: string
  disabled?: boolean
  accept?: string
  multiple?: boolean
  required: boolean
}

export const FormFileInput = ({
  form,
  id,
  fieldName,
  fieldDesc,
  fieldLabel,
  required,
  accept,
  multiple = false,
  disabled = false,
  className
}: FormFileInputProps) => {
  const fileFormRef = form.register(fieldName)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    if (!multiple && files.length > 0) {
      const dtTransfer = new DataTransfer()
      dtTransfer.items.add(files[0])
      form.setValue(fieldName, dtTransfer.files, { shouldDirty: true })
    } else {
      form.setValue(fieldName, files, { shouldDirty: true })
    }
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      // eslint-disable-next-line no-unused-vars
      render={({ field }) => {
        const fieldValue = form.getValues(fieldName)
        const handleDeleteItem = (idx: number) => {
          const files = form.getValues(fieldName)
          if (files instanceof FileList) {
            const dtTransfer = new DataTransfer()
            Array.from(files).forEach((file, fileIdx) => {
              if (fileIdx !== idx) {
                dtTransfer.items.add(file)
              }
            })
            const newFiles = dtTransfer.files
            if (newFiles.length > 0) {
              form.setValue(fieldName, newFiles, {
                shouldDirty: true
              })
            } else {
              form.setValue(fieldName, null, {
                shouldDirty: false
              })
              form.resetField(fieldName)
            }
          }
        }
        const hasFiles =
          fieldValue &&
          ((fieldValue instanceof FileList && fieldValue.length > 0) || fieldValue instanceof File)
        return (
          <FormItem>
            {fieldLabel && (
              <FormLabel>
                {fieldLabel}
                {required && <span className="text-brease-error"> *</span>}
              </FormLabel>
            )}
            <FormControl>
              <div
                className={`group flex flex-col px-2 py-3 gap-2 w-full rounded-lg border border-dashed border-brease-gray-5 bg-white text-t-xs font-golos-regular shadow-brease-xs placeholder:text-brease-gray-5 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-brease-gray-5 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brease-error aria-invalid:text-brease-error aria-invalid:focus-visible:ring-brease-error aria-invalid:focus-visible:ring-[1px] has-[:disabled]:opacity-50 has-[:disabled]:!cursor-not-allowed ${className}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  className="sr-only peer"
                  type="file"
                  id={id ? id : fieldName}
                  // required prop is only for styling, see formSchema for actual validation!
                  required={required}
                  disabled={disabled}
                  accept={accept}
                  multiple={multiple}
                  {...fileFormRef}
                />
                <label
                  htmlFor={id ? id : fieldName}
                  className="group cursor-pointer h-full w-full flex flex-col justify-center items-center gap-2 peer-disabled:!cursor-not-allowed"
                >
                  <span className="flex flex-row items-center gap-1 group-aria-invalid:text-brease-error w-fit">
                    Drag & Drop your file here or
                    <span className="font-golos-medium py-1 px-2 bg-brease-secondary-light-purple text-brease-secondary-purple rounded-md group-aria-invalid:text-brease-error group-aria-invalid:bg-brease-error-light">
                      choose file
                    </span>
                  </span>
                </label>
                {hasFiles && (
                  <div className="flex flex-row flex-wrap gap-2 w-full h-fit border-t border-brease-gray-5 pt-3 px-2">
                    {fieldValue instanceof FileList ? (
                      Array.from(fieldValue).map((file, idx) => (
                        <span
                          key={idx}
                          className={`flex flex-row items-center gap-1 py-1 px-2 bg-brease-secondary-light-purple text-brease-secondary-purple rounded-md w-fit`}
                        >
                          {file.name}
                          <div className={`cursor-pointer`} onClick={() => handleDeleteItem(idx)}>
                            <X className="w-3 h-3" />
                          </div>
                        </span>
                      ))
                    ) : fieldValue instanceof File ? (
                      <span className="py-1 px-2 bg-brease-secondary-light-purple text-brease-secondary-purple rounded-md w-fit">
                        {fieldValue.name}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </FormControl>
            {fieldDesc && (
              <FormDescription className="text-brease-gray-8">{fieldDesc}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
