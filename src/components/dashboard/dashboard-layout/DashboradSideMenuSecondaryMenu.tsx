import React from 'react'
import { Text } from '@/components/generic/Text'
import SecondarySideMenuItem, { SecondarySideMenuItemProps } from './SecondarySideMenuItem'

interface SecondaryMenuProps {
  title: string
  items: SecondarySideMenuItemProps[]
}

const DashboradSideMenuSecondaryMenu = ({ title, items }: SecondaryMenuProps) => {
  return (
    <div className="w-full rounded-lg p-2 flex flex-col gap-2">
      <Text size="xxxs" style="medium" className="uppercase text-brease-gray-6">
        {title}
      </Text>
      <ul>
        {items.map((menuItem: SecondarySideMenuItemProps) => (
          <SecondarySideMenuItem
            key={menuItem.label}
            link={menuItem.link}
            label={menuItem.label}
            icon={menuItem.icon}
          />
        ))}
      </ul>
    </div>
  )
}

export default DashboradSideMenuSecondaryMenu
