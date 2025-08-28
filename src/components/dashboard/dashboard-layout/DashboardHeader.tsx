'use client'
import Image from 'next/image'
import React from 'react'
import breaseLogo from '@/images/brease-icon-primary.svg'
//import Button from '../../generic/Button'
import HeaderProfile from './HeaderProfile'
//import { useAssistantStore } from '@/lib/hooks/useAssistantStore'
import AssistantDialog from '../../assistant/AssistantDialog'
//import { usePathname } from 'next/navigation'

const DashboardHeader = () => {
  //const { setOpen } = useAssistantStore()
  //const path = usePathname()
  //const isSiteDashboard = new RegExp(
  //  `^/dashboard/sites/(sit-[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[1-8][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12})(/|$)`
  //).test(path)

  return (
    <div className="sticky top-0 bg-brease-gray-1 w-full z-[9997]">
      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-3 pt-3 px-4">
        <Image src={breaseLogo} className="w-[18px] h-[22.5px]" alt="Brease Logo" />
        <div className="relative w-fit h-fit">
          {/*{isSiteDashboard && (
            <div className="relative">
              <Button
                icon="Sparkles"
                size="sm"
                variant="secondary"
                label="Ask your assistant"
                onClick={() => setOpen(true)}
                className="bg-white shadow-brease-xs !w-[435px] justify-center"
              />
            </div>
          )}*/}
        </div>
        <div className="w-full flex justify-end">
          <HeaderProfile />
        </div>
      </div>
      <AssistantDialog />
    </div>
  )
}

export default DashboardHeader
