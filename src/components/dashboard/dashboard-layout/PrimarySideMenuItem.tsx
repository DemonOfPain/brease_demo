'use client'
import { ChevronDown, icons } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import menuItemHook from '@/images/custom-icons/menu-item-hook.svg'
import menuItemHookLast from '@/images/custom-icons/menu-item-hook-last.svg'
import Image from 'next/image'
import { Text } from '@/components/generic/Text'

type SubMenuItemProps = {
  label: string
  link: string
}

type PrimarySideMenuItemProps = {
  label: string
  icon: keyof typeof icons
  link: string
} & (
  | {
      isDropdown: true
      items: SubMenuItemProps[]
    }
  | {
      isDropdown: false
      items?: SubMenuItemProps[]
    }
)

export const PrimarySideMenuItem = ({
  label,
  isDropdown,
  link,
  items,
  icon
}: PrimarySideMenuItemProps) => {
  const path = usePathname()
  const isActive = link === path
  const LucideIcon = icons[icon]
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(true)
  if (isDropdown) {
    return (
      <li
        className={`w-full flex flex-col items-start text-t-xs cursor-pointer transition-all duration-700 ease-in-out overflow-hidden ${dropdownOpen ? 'max-h-screen' : 'max-h-[38px]'}`}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`relative z-20 w-full p-2 rounded-md flex flex-row justify-between items-center my-[2px] hover:bg-white ${dropdownOpen && 'bg-white font-golos-medium shadow-brease-xs'} transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-row items-center gap-2">
            <LucideIcon
              className="h-4 w-4 stroke-brease-gray-9"
              strokeWidth={dropdownOpen ? 2.5 : 2}
            />
            {label}
          </div>
          <ChevronDown
            className={`h-4 w-4 stroke-brease-gray-9 ${dropdownOpen && 'rotate-180'} transition-all duration-500 ease-in-out`}
            strokeWidth={dropdownOpen ? 2.5 : 2}
          />
        </button>
        {items.length === 1 && (
          <ul
            className={`w-full flex flex-col pb-2 pl-2 ${dropdownOpen && 'animate-fade-down animate-delay-300 animate-duration-300 animate-ease-in-out'}`}
          >
            {items.map((menuItem: SubMenuItemProps) => (
              <li key={menuItem.label} className="group w-full">
                <Link href={menuItem.link} className="w-full flex flex-row gap-2 items-start">
                  <Image src={menuItemHookLast} alt="Menu Item Hook" />
                  <Text
                    style="regular"
                    size="xs"
                    className={`mt-1 group-hover:font-golos-medium text-brease-gray-8 ${menuItem.link === path && '!text-brease-gray-9 !font-golos-medium'}`}
                  >
                    {menuItem.label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {items.length > 1 && (
          <ul
            className={`relative z-10 w-full flex flex-col pb-2 pl-2 ${dropdownOpen && 'animate-fade-down animate-duration-700 animate-ease-in-out'}`}
          >
            {items.slice(0, -1).map((menuItem: SubMenuItemProps) => (
              <li key={menuItem.label} className="group w-full">
                <Link href={menuItem.link} className="w-full flex flex-row gap-2 items-center">
                  <Image src={menuItemHook} alt="Menu Item Hook" />
                  <Text
                    style="regular"
                    size="xs"
                    className={`group-hover:font-golos-medium text-brease-gray-8 ${menuItem.link === path && '!text-brease-gray-9 !font-golos-medium'}`}
                  >
                    {menuItem.label}
                  </Text>
                </Link>
              </li>
            ))}
            {items.slice(-1).map((menuItem: SubMenuItemProps) => (
              <li key={menuItem.label} className="group w-full">
                <Link href={menuItem.link} className="w-full flex flex-row gap-2 items-start">
                  <Image src={menuItemHookLast} alt="Menu Item Hook" />
                  <Text
                    style="regular"
                    size="xs"
                    className={`mt-1 group-hover:font-golos-medium text-brease-gray-8 ${menuItem.link === path && '!text-brease-gray-9 !font-golos-medium'}`}
                  >
                    {menuItem.label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  } else {
    return (
      <li
        className={`group w-full rounded-md text-t-xs cursor-pointer my-[2px] ${isActive && 'bg-white font-golos-medium shadow-brease-xs'} transition-all duration-300 ease-in-out`}
      >
        <Link
          href={link}
          className="flex flex-row items-center gap-2 w-full h-full p-2 rounded-md group-hover:bg-white transition-all duration-300 ease-in-out"
        >
          <LucideIcon className="h-4 w-4 stroke-brease-gray-9" strokeWidth={isActive ? 2.5 : 2} />
          {label}
        </Link>
      </li>
    )
  }
}
