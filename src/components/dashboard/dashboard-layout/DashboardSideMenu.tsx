import React from 'react'
import DashboardSideMenuPrimaryMenu from './DashboardSideMenuPrimaryMenu'
//import DashboradSideMenuSecondaryMenu from './DashboradSideMenuSecondaryMenu'

//TODO: Make menus available based on user role (eg: only admins can see pricing)

export const DashboardSideMenu = () => {
  return (
    <nav className="sticky top-0 w-[210px] h-fit flex flex-col gap-5">
      <DashboardSideMenuPrimaryMenu />
      {/* <DashboradSideMenuSecondaryMenu
        title="Get Started"
        items={[
          {
            label: 'Tutorials',
            link: '#',
            icon: 'CircleHelp'
          },
          {
            label: 'Documentation',
            link: '#',
            icon: 'FileCode'
          }
        ]}
      />
      <DashboradSideMenuSecondaryMenu
        title="Brease"
        items={[
          {
            label: 'Feedback',
            link: '#',
            icon: 'Mail'
          },
          {
            label: 'Brease Updates',
            link: '/dashboard/brease-updates',
            icon: 'MessageSquareMore'
          }
        ]}
      /> */}
    </nav>
  )
}
