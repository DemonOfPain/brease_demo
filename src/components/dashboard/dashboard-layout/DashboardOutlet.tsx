import React from 'react'
// import { DashboardBanner } from './DashboardBanner'

export const DashboardOutlet = ({
  children
  // banner
}: {
  children: React.ReactNode
  // banner?: DashboardBanner | undefined
}) => {
  return (
    <div className="w-full flex flex-col gap-6 no-scrollbar">
      {/* {banner && <DashboardBanner title={banner.title} desc={banner.desc} button={banner.button} />} */}
      {children}
    </div>
  )
}
