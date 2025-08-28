import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const TeamsPageLoader = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="w-full flex flex-row justify-between items-start">
        <Skeleton className="w-[220px] h-[44px]" />
      </div>
      <Skeleton className="w-full h-[64px]" />
      <Skeleton className="w-full h-[344px]" />
      <Skeleton className="w-full h-[344px]" />
    </div>
  )
}
