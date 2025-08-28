import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const BreaseUpdatesSkeleton = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-6 pb-10">
      <Skeleton className="h-[44px] w-[385px]" />
      <div className="w-full h-fit flex flex-col gap-2">
        <Skeleton className="w-full h-[80px]" />
        <Skeleton className="w-full h-[80px]" />
        <Skeleton className="w-full h-[80px]" />
        <Skeleton className="w-full h-[80px]" />
        <Skeleton className="w-full h-[80px]" />
      </div>
    </div>
  )
}
