'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/shadcn/ui/toast'
import { useToast } from '@/components/shadcn/ui/use-toast'
import { icons } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()
  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, icon, ...props }) {
        let iconStroke = ''

        if (!icon) {
          switch (props.variant) {
            case 'success':
            case 'successLight':
              icon = 'CheckCheck'
              iconStroke = 'stroke-brease-success'
              break
            case 'error':
            case 'errorLight':
              icon = 'X'
              iconStroke = 'stroke-brease-error'
              break
            case 'warning':
            case 'warningLight':
              icon = 'CircleAlert'
              iconStroke = 'stroke-brease-warning'
              break
            case 'notification':
              icon = 'BellDot'
              iconStroke = 'stroke-white'
              break
            case 'notificationLight':
              icon = 'BellDot'
              iconStroke = 'stroke-brease-gray-10'
              break
            default:
              break
          }
        }

        const LucideIcon = icon ? icons[icon] : null

        return (
          <Toast key={id} {...props}>
            <div className="w-full flex flex-col items-left justify-between pr-5">
              <div className="flex flex-row gap-4">
                {icon && LucideIcon && <LucideIcon className={`w-6 h-6 ${iconStroke}`} />}
                <div className="w-full flex flex-col gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}
                  <div className="flex flex-row items-center gap-4 pt-0 ">{action}</div>
                </div>
              </div>
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
