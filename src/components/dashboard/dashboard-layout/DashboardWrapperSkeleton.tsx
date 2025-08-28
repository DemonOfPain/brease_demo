import { Skeleton } from '@/components/shadcn/ui/skeleton'
import React from 'react'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
//import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'

export const DashboardWrapperSkeleton = () => {
  return (
    <main className="relative w-full flex flex-col justify-start items-start overscroll-none no-scrollbar">
      <div className="sticky top-0 bg-brease-gray-1 w-full z-[9997]">
        <div className="w-full max-w-screen-xl mx-auto grid grid-cols-3 pt-3 px-4">
          <Image src={breaseLogo} className="w-[18px] h-[22.5px]" alt="Brease Logo" />
          <div className="relative w-fit h-fit">
            {/* <ButtonPlaceholder
              icon="Sparkles"
              size="sm"
              variant="secondary"
              label="Ask your assistant"
              className="bg-white shadow-brease-xs !w-[435px] justify-center"
            /> */}
          </div>
          <div className="w-full flex justify-end">
            <Skeleton className="w-[158px] h-[44px] rounded-full bg-brease-gray-3" />
          </div>
        </div>
      </div>
      <div className="sticky top-14 bg-brease-gray-1 border-b border-brease-gray-4 w-full z-[9997]">
        <div className="w-full max-w-screen-xl flex flex-row justify-between mx-auto pt-10 pb-3 px-4 ">
          <div className="w-fit max-w-1/3 flex flex-col gap-1">
            <Skeleton className="w-[212px] h-[20px] bg-brease-gray-3" />
            <Skeleton className="w-[70px] h-[20px] bg-brease-gray-3" />
          </div>
          <div className="w-fit max-w-2/3 flex flex-row gap-2">
            <Skeleton className="w-[270px] h-[60px] bg-brease-gray-3" />
            <Skeleton className="w-[257px] h-[60px] bg-brease-gray-3" />
            <Skeleton className="w-[226px] h-[60px] bg-brease-gray-3" />
          </div>
        </div>
      </div>
      <div className="w-full h-full">
        <div className="w-full h-full max-w-screen-xl mx-auto px-4 flex flex-row justify-start items-start gap-[72px] pt-6">
          <div className="sticky top-[193px] w-fit h-full">
            <nav className="w-[210px] h-fit flex flex-col gap-5">
              <Skeleton className="w-full h-[61px] rounded-lg" />
              <Skeleton className="w-full h-[186px] rounded-lg" />
              <Skeleton className="w-full h-[118px] rounded-lg" />
              <Skeleton className="w-full h-[80px] rounded-lg" />
            </nav>
          </div>
          <div className="w-full flex flex-col gap-6 no-scrollbar"></div>
        </div>
      </div>
    </main>
  )
}
