import React from 'react'
import { Skeleton } from '@/components/shadcn/ui/skeleton'

export const SitesPageLoader = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-6 pb-6">
      <div className="relative w-full flex flex-col gap-5 pb-3">
        <div className="w-full grid grid-cols-3 gap-5">
          <Skeleton className="w-full h-[289px]" />
          <Skeleton className="w-full h-[289px]" />
          <Skeleton className="w-full h-[289px]" />
          <Skeleton className="w-full h-[289px]" />
          <Skeleton className="w-full h-[289px]" />
          <Skeleton className="w-full h-[289px]" />
        </div>
      </div>
    </div>
  )
}
