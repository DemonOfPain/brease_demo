import * as React from 'react'

import { cn } from '@/lib//shadcn/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-brease-gray-5 bg-white px-2 py-3 text-t-xs font-golos-regular shadow-brease-xs placeholder:text-brease-gray-5 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-brease-gray-5 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brease-error aria-invalid:text-brease-error aria-invalid:focus-visible:ring-brease-error aria-invalid:focus-visible:ring-[1px]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
