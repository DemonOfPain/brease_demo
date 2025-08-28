import { UserProfile, UserProfileDetail } from '@/interface/user'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcn/ui/tooltip'
import { Text } from './Text'
import { GenericAvatar } from './GenericAvatar'

export const TableUserAvatar = ({
  user,
  className
}: {
  user: UserProfile | UserProfileDetail | any
  className?: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <GenericAvatar
            className={className}
            image={user.avatar}
            fallbackInitials={`${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <Text size="sm" style="regular">
            {`${user.firstName} ${user.lastName}`}
          </Text>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
