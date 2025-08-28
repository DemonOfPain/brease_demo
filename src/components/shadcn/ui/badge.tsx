import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib//shadcn/utils'

const badgeVariants = cva(
  'inline-flex items-center border rounded-md shadow-xs px-2.5 py-0.5 !text-t-xxs font-golos-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brease-primary text-white hover:bg-brease-primary/80',
        secondary: 'border-brease-gray-5 text-brease-gray-7 bg-white text-brease-gray-9',
        builderListCardPage: 'border-brease-gray-3 bg-brease-gray-3 text-brease-gray-9',
        teamProBadge:
          'border-transparent bg-brease-secondary-light-purple text-brease-secondary-purple hover:bg-brease-secondary-light-purple/80',
        teamStandardBadge:
          'border-transparent bg-brease-success-light text-brease-success hover:bg-brease-success-light/80',
        publishedSite:
          'border-transparent bg-brease-success-light text-brease-success hover:bg-brease-success-light/80',
        unpublishedSite:
          'border-transparent bg-brease-warning-light text-brease-warning hover:bg-brease-warning-light/80',
        builderPublished: 'border-transparent bg-brease-success text-brease-gray-1',
        builderUnpublished: 'border-transparent bg-brease-warning text-brease-gray-1'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
