'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib//shadcn/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-5 w-5 rounded-md border shadow-brease-xs border-brease-gray-5 bg-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brease-green-10 data-[state=checked]:border-brease-green-10 data-[state=checked]:!text-white aria-invalid:border-brease-error transition-all duration-200 ease-in-out',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-3 w-3 stroke-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const CheckboxWithText = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-fit w-fit rounded-lg px-3 py-2 border text-t-sm font-golos-medium shadow-brease-xs border-brease-gray-5 bg-brease-gray-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-brease-success-light data-[state=checked]:border-brease-green-10 data-[state=checked]:!text-brease-green-10 aria-invalid:border-brease-error aria-invalid:bg-brease-error-light aria-invalid:text-brease-error transition-all duration-200 ease-in-out',
      className
    )}
    {...props}
  >
    {children}
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    ></CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
CheckboxWithText.displayName = 'CheckboxWithText'

export { Checkbox, CheckboxWithText }
