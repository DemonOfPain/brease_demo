import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const MyAccountSkeleton = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-6 pb-10">
      <div className="w-fit h-full flex flex-col gap-6">
        <Skeleton className="w-[295px] h-[54px]" />
        <Skeleton className="w-full h-[966px]" />
      </div>
    </div>
  )
}
