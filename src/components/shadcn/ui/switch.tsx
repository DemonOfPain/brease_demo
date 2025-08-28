'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { Check } from 'lucide-react'

import { cn } from '@/lib//shadcn/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'group peer shadow-brease-xs inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer items-center rounded-md border border-brease-gray-5 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 bg-white aria-invalid:border-brease-error',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'group pointer-events-none flex items-center justify-center h-5 w-5 rounded-[4px] ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-[2px] data-[state=checked]:bg-brease-green-10 bg-brease-gray-6 group-aria-invalid:!bg-brease-error-light'
      )}
    >
      <Check className="group-data-[state=unchecked]:hidden h-3 w-3 stroke-white " />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
