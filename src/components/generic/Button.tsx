'use client'
import { ArrowRight } from 'lucide-react'
import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import { icons } from 'lucide-react'
import Link from 'next/link'

export type RequireEither<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys]

interface Props {
  variant: 'primary' | 'secondary' | 'textType' | 'black'
  size: 'lg' | 'md' | 'sm'
  label?: string
  onClick?: () => void
  navigateTo?: string
  icon?: keyof typeof icons
  hasArrow?: boolean
  disabled?: boolean
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
  children?: ReactNode
}

type ButtonProps = RequireEither<Props, 'navigateTo' | ('onClick' | 'type')>

export const btnBase = `group w-fit flex flex-row font-golos-medium items-center focus:ring-0 focus:outline-0 disabled:cursor-not-allowed transition-all ease-in-out duration-300 `

export const getVariant = (btnVariant: ButtonProps['variant']) => {
  switch (btnVariant) {
    case 'primary':
      return 'bg-brease-green-11 ring-[1px] ring-brease-green-11 text-brease-gray-1 stroke-brease-gray-1 disabled:ring-brease-gray-5 disabled:bg-brease-gray-3 disabled:text-brease-gray-7 disabled:stroke-brease-gray-7 hover:bg-brease-gray-10 hover:ring-brease-gray-10 hover:text-brease-gray-1'
    case 'secondary':
      return 'bg-brease-gray-1 ring-[1px] ring-brease-gray-5 text-brease-gray-10 stroke-brease-gray-10 disabled:ring-brease-gray-5 disabled:bg-brease-gray-3 disabled:text-brease-gray-7 disabled:stroke-brease-gray-7 disabled:hover:ring-brease-gray-5 hover:ring-brease-green-9 hover:text-brease-green-9 hover:stroke-brease-green-9'
    case 'textType':
      return 'bg-transparent text-brease-gray-10 stroke-brease-gray-10 disabled:ring-brease-gray-7 disabled:text-brease-gray-7 disabled:stroke-brease-gray-7 hover:text-brease-green-9 hover:stroke-brease-green-9'
    case 'black':
      return 'bg-brease-gray-10 ring-[1px] ring-brease-gray-1 text-brease-gray-1 stroke-brease-gray-1 disabled:ring-brease-gray-5 disabled:bg-brease-gray-3 disabled:text-brease-gray-7 disabled:stroke-brease-gray-7 disabled:hover:ring-brease-gray-3 hover:bg-brease-green-11 hover:ring-brease-green-1 hover:text-brease-green-2'
    default:
      return 'something is wrong'
  }
}

export const getSize = (btnSize: ButtonProps['size']) => {
  switch (btnSize) {
    case 'lg':
      return 'py-3 px-5 text-t-md gap-3 rounded-[10px]'
    case 'md':
      return 'py-[10px] px-4 text-t-sm gap-[10px] rounded-[10px]'
    case 'sm':
      return 'py-1 px-2 text-t-xs gap-2 rounded-md'
    default:
      return 'something is wrong'
  }
}

const Button = ({
  variant,
  size,
  label,
  onClick,
  navigateTo,
  icon = undefined,
  hasArrow = false,
  disabled = false,
  type,
  className,
  children
}: ButtonProps) => {
  const LucideIcon = icon ? icons[icon] : null
  const isExternalUrl = navigateTo?.startsWith('http://') || navigateTo?.startsWith('https://')
  if (onClick || type) {
    return (
      <button
        className={`${btnBase} ${getVariant(variant)} ${getSize(size)} ${className ? className : ''}`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {icon && LucideIcon && <LucideIcon className="h-4 w-4 stroke-inherit" />}
        {label}
        {hasArrow && <ArrowRight className="h-4 w-4 stroke-inherit" />}
        {children}
      </button>
    )
  } else if (isExternalUrl) {
    return (
      <a
        href={navigateTo}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btnBase} ${getVariant(variant)} ${getSize(size)} ${className ? className : ''}`}
      >
        {icon && LucideIcon && <LucideIcon className="h-4 w-4 stroke-inherit" />}
        {label}
        {hasArrow && <ArrowRight className="h-4 w-4 stroke-inherit" />}
        {children}
      </a>
    )
  } else {
    return (
      <Link
        prefetch
        href={navigateTo}
        className={`${btnBase} ${getVariant(variant)} ${getSize(size)} ${className ? className : ''}`}
      >
        {icon && LucideIcon && <LucideIcon className="h-4 w-4 stroke-inherit" />}
        {label}
        {hasArrow && <ArrowRight className="h-4 w-4 stroke-inherit" />}
        {children}
      </Link>
    )
  }
}

export default Button
