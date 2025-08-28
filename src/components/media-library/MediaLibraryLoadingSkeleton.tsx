import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'
import { Text } from '@/components/generic/Text'

export const MediaLibraryLoadingSkeleton = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-3">
      <div className="w-full h-fit flex flex-row justify-between items-center pb-1 border-b border-brease-gray-5">
        <Text size="sm" style="medium">
          Library
        </Text>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full h-full max-h-[calc(100vh-275px)] overflow-y-scroll no-scrollbar">
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
        <Skeleton className="w-full h-[144px]" />
      </div>
    </div>
  )
}
