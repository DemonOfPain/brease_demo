import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const FormLoader = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <Skeleton className="w-[220px] h-[60px]" />
      <div className="w-full flex flex-row justify-between">
        <Skeleton className="w-[220px] h-[20px]" />
        <div className="w-1/2 flex flex-col gap-4">
          <Skeleton className="w-full h-[75px]" />
          <Skeleton className="w-full h-[75px]" />
        </div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <Skeleton className="w-[220px] h-[20px]" />
        <div className="w-1/2 flex flex-col gap-4">
          <Skeleton className="w-full h-[75px]" />
          <Skeleton className="w-full h-[75px]" />
        </div>
      </div>
      <div className="w-full flex flex-row justify-between">
        <Skeleton className="w-[220px] h-[20px]" />
        <div className="w-1/2 flex flex-col gap-4">
          <Skeleton className="w-full h-[75px]" />
          <Skeleton className="w-full h-[75px]" />
        </div>
      </div>
    </div>
  )
}
