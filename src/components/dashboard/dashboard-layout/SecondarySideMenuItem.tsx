'use client'
import React from 'react'
import { icons } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface SecondarySideMenuItemProps {
  label: string
  link: string
  icon: keyof typeof icons
  className?: string
}

const SecondarySideMenuItem = ({ label, link, icon, className }: SecondarySideMenuItemProps) => {
  const path = usePathname()
  const isActive = link === path
  const LucideIcon = icons[icon]
  return (
    <li
      className={`group w-full rounded-md text-t-xs cursor-pointer my-1 ${isActive && 'bg-brease-gray-2 font-golos-medium shadow-brease-xs'} transition-all duration-300 ease-in-out ${className ? className : ''}`}
    >
      <Link
        href={link}
        className="flex flex-row items-center gap-2 w-full h-full p-2 rounded-md group-hover:shadow-brease-xs group-hover:bg-brease-gray-2 transition-all duration-300 ease-in-out"
      >
        <LucideIcon className="h-4 w-4 stroke-brease-gray-9" strokeWidth={isActive ? 2.5 : 2} />
        {label}
      </Link>
    </li>
  )
}

export default SecondarySideMenuItem
