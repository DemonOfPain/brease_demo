'use client'
import React, { useState } from 'react'
import { Text } from '../../generic/Text'
import { Avatar, AvatarFallback } from '@/components/shadcn/ui/avatar'
import { stringtoHexColor } from '@/lib/helpers/stringtoHexColor'
import Image from 'next/image'
import { SiteDetail } from '@/interface/site'
import Link from 'next/link'

export const SiteDashboradSideMenuDropdownItem = ({
  site,
  onClick
}: {
  site: SiteDetail | any
  onClick?: () => void
}) => {
  const [imgError, setImgError] = useState<boolean>(false)
  const fallbackColor = stringtoHexColor(site.name)
  return (
    <li
      onClick={onClick}
      className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer transition-all duration-300 ease-in-out`}
    >
      <Link
        href={`/dashboard/sites/${site.uuid}/pages`}
        className="flex flex-row justify-between items-center w-full h-full p-2 rounded-md group-hover:!bg-white transition-all duration-300 ease-in-out"
      >
        <div className="flex flex-row items-center gap-2 w-full">
          <Avatar className="w-[30px] h-[30px]">
            {site.siteAvatar && !imgError ? (
              <Image
                src={site.siteAvatar}
                alt={site.name}
                width={30}
                height={30}
                onError={() => setImgError(true)}
              />
            ) : (
              <AvatarFallback
                style={{ backgroundColor: `${fallbackColor}` }}
                className="text-white font-golos-medium !text-t-xs"
              >
                {site.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <Text size="sm" style="medium" htmlTag="span" className="truncate w-full">
            {site.name}
          </Text>
        </div>
      </Link>
    </li>
  )
}
