import { cn } from '@/lib//shadcn/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-brease-gray-2', className)} {...props} />
}

export { Skeleton }
