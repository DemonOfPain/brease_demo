import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'

export const EditorLoader = () => {
  return (
    <div className="w-full h-full flex flex-row p-[8px]">
      <Skeleton className="h-full flex-grow" />
    </div>
  )
}
