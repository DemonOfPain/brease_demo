import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/ui/tooltip'
import { RequireEither } from '../generic/Button'
import { Text } from '@/components/generic/Text'
import { icons } from 'lucide-react'
import { AlertDialog, AlertDialogTrigger } from '../shadcn/ui/alert-dialog'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'

type Props = {
  buttonVariant: 'primary' | 'secondary' | 'textType' | 'black'
  buttonIcon: keyof typeof icons
  toolTipText: string
  dialogContent?: React.ReactNode
  onClick?: () => void
  tooltipDir?: 'right' | 'left' | 'top' | 'bottom'
  className?: string
}

type EditorSidebarButtonProps = RequireEither<Props, 'dialogContent' | 'onClick'>

export const EditorSidebarButton = ({
  buttonVariant,
  buttonIcon,
  dialogContent,
  onClick,
  toolTipText,
  tooltipDir = 'right',
  className
}: EditorSidebarButtonProps) => {
  if (dialogContent) {
    return (
      <AlertDialog>
        <Tooltip delayDuration={1000}>
          <TooltipTrigger onFocus={(e) => e.preventDefault()}>
            <AlertDialogTrigger asChild>
              <ButtonPlaceholder
                size="md"
                variant={buttonVariant}
                icon={buttonIcon}
                className={`!p-[10px] ${className}`}
              />
            </AlertDialogTrigger>
            {dialogContent}
          </TooltipTrigger>
          <TooltipContent side={tooltipDir}>
            <Text size="sm" style="regular">
              {toolTipText}
            </Text>
          </TooltipContent>
        </Tooltip>
      </AlertDialog>
    )
  } else if (onClick) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <ButtonPlaceholder
            size="md"
            variant={buttonVariant}
            icon={buttonIcon}
            onClick={onClick}
            className={`!p-[10px] ${className}`}
          />
        </TooltipTrigger>
        <TooltipContent side={tooltipDir}>
          <Text size="sm" style="regular">
            {toolTipText}
          </Text>
        </TooltipContent>
      </Tooltip>
    )
  }
}
