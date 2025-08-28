import React from 'react'
import { EditorLoader } from './EditorLoader'
import { Skeleton } from '@/components/shadcn/ui/skeleton'

export const WrapperLoader = () => {
  return (
    <main className="relative w-full h-screen max-h-screen z-[20] bg-brease-gray-1 flex flex-col justify-start items-start overscroll-none no-scrollbar">
      <nav className="w-full flex flex-row justify-between px-[20px] border-b border-brease-gray-5">
        <div className="w-fit h-full flex flex-row items-center gap-2">
          <div className="w-fit h-full flex items-center border-r pr-[20px]">
            <Skeleton className="w-[16px] h-[16px]" />
          </div>
          <div className="group focus:outline-none flex flex-row items-center gap-1 pl-[8px]">
            <Skeleton className="w-[46px] h-[34px]" />
          </div>
          <div className="ml-[6px] pl-4 h-full border-l flex gap-4 items-center">
            <Skeleton className="w-[65px] h-[34px]" />
            <Skeleton className="w-[278px] h-[34px]" />
            <Skeleton className="w-[119px] h-[34px]" />
          </div>
        </div>
        <div className="w-fit flex flex-row items-center gap-4 py-2">
          <div className="relative w-fit h-fit">
            {/* <Button
              icon="Sparkles"
              size="sm"
              variant="secondary"
              label="Ask your assistant"
              onClick={() => console.log('AI dialog open')}
              className="ml-2 ring-[1px] bg-white shadow-brease-xs !w-[250px] justify-start stroke-brease-primary !fill-brease-primary"
            /> */}
          </div>
          <Skeleton className="w-[164px] h-[34px]" />
        </div>
      </nav>
      <div className="relative z-[20] overflow-hidden w-full h-full flex flex-row gap-4 bg-brease-gray-4">
        <EditorLoader />
      </div>
    </main>
  )
}
