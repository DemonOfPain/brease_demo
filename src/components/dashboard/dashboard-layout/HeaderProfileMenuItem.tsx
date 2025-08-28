import React, { ReactNode } from 'react'
import { icons } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'

export interface BaseProps {
  label: string
  icon: keyof typeof icons
  className?: string
  iconClassName?: string
  textClassName?: string
  children?: ReactNode
}

interface PropsWithLink extends BaseProps {
  link: string
  onClick?: never
  dialog?: never
  customDialog?: never
  dialogProps?: never
}

interface PropsWithOnClick extends BaseProps {
  link?: never
  onClick: () => void
  dialog?: never
  customDialog?: never
  dialogProps?: never
}

interface PropsWithCustomDialog extends BaseProps {
  link?: never
  onClick?: never
  dialog: true
  customDialog: ReactNode
  dialogProps?: never
}

interface PropsWithDialogProps extends BaseProps {
  link?: never
  onClick?: never
  dialog: true
  customDialog?: never
  dialogProps: {
    title: string
    description: string
    cancelBtnLabel?: string
    actionBtnLabel?: string
    actionBtnOnClick: () => void
  }
}

export type Props = PropsWithLink | PropsWithOnClick | PropsWithCustomDialog | PropsWithDialogProps

const HeaderProfileMenuItem = ({
  label,
  link,
  onClick,
  dialog,
  customDialog = false,
  dialogProps = {
    title: 'Title',
    description: 'Description',
    cancelBtnLabel: 'Cancel',
    actionBtnLabel: 'Continue',
    actionBtnOnClick() {
      console.log('action btn clicked')
    }
  },
  icon,
  className,
  iconClassName,
  textClassName,
  children
}: Props) => {
  const LucideIcon = icons[icon]
  if (dialog)
    return (
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <li
            className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer my-1 transition-all duration-300 ease-in-out ${className ? className : ''}`}
          >
            <div
              className={`flex flex-row items-center gap-2 w-full h-full px-2 py-1 rounded-md group-hover:shadow-brease-xs group-hover:bg-brease-gray-2 transition-all duration-300 ease-in-out ${textClassName}`}
            >
              <LucideIcon
                className={`h-4 w-4 stroke-brease-gray-9 ${iconClassName}`}
                strokeWidth={2.5}
              />
              {label}
              {children}
            </div>
          </li>
        </AlertDialogTrigger>
        {customDialog ? (
          customDialog
        ) : (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{dialogProps.title}</AlertDialogTitle>
              <AlertDialogDescription>{dialogProps.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="!justify-between">
              <AlertDialogCancel className="hover:!text-brease-gray-7 hover:ring-brease-gray-7">
                {dialogProps.cancelBtnLabel}
              </AlertDialogCancel>
              <AlertDialogAction onClick={dialogProps.actionBtnOnClick}>
                {dialogProps.actionBtnLabel}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialog>
    )
  if (link)
    return (
      <li
        className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer my-1 transition-all duration-300 ease-in-out ${className ? className : ''}`}
      >
        <Link
          prefetch
          href={link}
          className={`flex flex-row items-center gap-2 w-full h-full px-2 py-1 rounded-md group-hover:shadow-brease-xs group-hover:bg-brease-gray-2 transition-all duration-300 ease-in-out ${textClassName}`}
        >
          <LucideIcon
            className={`h-4 w-4 stroke-brease-gray-9 ${iconClassName}`}
            strokeWidth={2.5}
          />
          {label}
          {children}
        </Link>
      </li>
    )
  if (onClick)
    return (
      <li
        className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer my-1 transition-all duration-300 ease-in-out ${className ? className : ''}`}
      >
        <button
          onClick={onClick}
          className={`flex flex-row items-center gap-2 w-full h-full px-2 py-1 rounded-md group-hover:shadow-brease-xs group-hover:bg-brease-gray-2 transition-all duration-300 ease-in-out ${textClassName}`}
        >
          <LucideIcon
            className={`h-4 w-4 stroke-brease-gray-9 ${iconClassName}`}
            strokeWidth={2.5}
          />
          {label}
          {children}
        </button>
      </li>
    )
}

export default HeaderProfileMenuItem
