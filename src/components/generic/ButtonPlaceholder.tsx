import { ArrowRight, icons } from 'lucide-react'
import React, { ReactNode } from 'react'
import { btnBase, getSize, getVariant } from './Button'

interface ButtonPlaceholderProps {
  variant: 'primary' | 'secondary' | 'textType' | 'black'
  size: 'lg' | 'md' | 'sm'
  label?: string
  icon?: keyof typeof icons
  onClick?: () => void
  hasArrow?: boolean
  className?: string
  children?: ReactNode
}

export const ButtonPlaceholder = React.forwardRef<HTMLDivElement, ButtonPlaceholderProps>(
  ({ variant, size, label, icon, hasArrow, className, onClick, children }, ref) => {
    const LucideIcon = icon ? icons[icon] : null
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`hover:cursor-pointer ${btnBase} ${getVariant(variant)} ${getSize(size)} ${className ? className : ''}`}
      >
        {icon && LucideIcon && <LucideIcon className="h-4 w-4 stroke-inherit" />}
        {label}
        {hasArrow && <ArrowRight className="h-4 w-4 stroke-inherit" />}
        {children}
      </div>
    )
  }
)

ButtonPlaceholder.displayName = 'ButtonPlaceholder'
