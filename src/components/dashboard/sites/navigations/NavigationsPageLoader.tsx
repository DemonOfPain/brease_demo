import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const NavigationsPageLoader = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <Skeleton className="w-full h-[64px]" />
      <Skeleton className="w-full h-[420px]" />
    </div>
  )
}
