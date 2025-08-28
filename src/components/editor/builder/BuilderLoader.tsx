import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const BuilderLoader = () => {
  return (
    <div className="w-full h-full flex flex-row-reverse gap-[8px]">
      <Skeleton className="h-full w-[500px]" />
      <Skeleton className="h-full w-full" />
    </div>
  )
}
