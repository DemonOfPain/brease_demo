'use client'
import React, { useState } from 'react'
import { Text } from '../../generic/Text'
import { Badge } from '@/components/shadcn/ui/badge'
import { Avatar, AvatarFallback } from '@/components/shadcn/ui/avatar'
import { stringtoHexColor } from '@/lib/helpers/stringtoHexColor'
import Image from 'next/image'

interface HeaderProfileTeamsItemProps {
  team: any //TODO: add team interface
  className?: string
  onClick: () => void
}

export const HeaderProfileTeamsItem = ({
  team,
  className,
  onClick
}: HeaderProfileTeamsItemProps) => {
  const [imgError, setImgError] = useState<boolean>(false)
  let getTeamBadge = () => {
    switch (team.subscription) {
      case 'pro':
        return 'teamProBadge'
      case 'standard':
        return 'teamStandardBadge'
      default:
        return 'default'
    }
  }
  const fallbackColor = stringtoHexColor(team.name)
  return (
    <li
      className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer transition-all duration-300 ease-in-out ${className ? className : ''}`}
    >
      <button
        onClick={onClick}
        className="flex flex-row justify-between items-center w-full h-full p-2 rounded-md group-hover:shadow-brease-xs group-hover:bg-brease-gray-2 transition-all duration-300 ease-in-out"
      >
        <div className="flex flex-row items-center gap-2">
          <Avatar className="w-[30px] h-[30px]">
            {team.image && !imgError ? (
              <Image
                src={team.image}
                alt={team.name}
                width={30}
                height={30}
                onError={() => setImgError(true)}
              />
            ) : (
              <AvatarFallback
                style={{ backgroundColor: `${fallbackColor}` }}
                className="text-white font-golos-medium !text-t-xs"
              >
                {team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <Text size="sm" style="medium" htmlTag="span">
            {team.name}
          </Text>
        </div>
        {team.subscription && (
          <Badge variant={getTeamBadge()} className="uppercase">
            {team.subscription}
          </Badge>
        )}
      </button>
    </li>
  )
}
