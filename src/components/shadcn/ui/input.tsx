import * as React from 'react'

import { cn } from '@/lib//shadcn/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'relative flex w-full rounded-lg border border-brease-gray-5 bg-white px-2 py-3 text-t-xs font-golos-regular shadow-brease-xs file:border-0 placeholder:text-brease-gray-5 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-brease-gray-5 disabled:cursor-not-allowed disabled:opacity-50 group-aria-invalid:border-brease-error group-aria-invalid:text-brease-error group-aria-invalid:focus-visible:ring-brease-error group-aria-invalid:focus-visible:ring-[1px] file:bg-brease-secondary-light-purple file:text-brease-secondary-purple file:py-1 file:px-2 file:rounded-md data-[type=file]:!border-dashed',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
