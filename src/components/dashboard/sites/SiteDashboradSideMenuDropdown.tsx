'use client'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import { Site, SiteDetail } from '@/interface/site'
import { SiteDashboradSideMenuDropdownItem } from './SiteDashboardSideMenuDropdownItem'
import Button from '@/components/generic/Button'
import { Text } from '../../generic/Text'
import { Avatar, AvatarFallback } from '@/components/shadcn/ui/avatar'
import { stringtoHexColor } from '@/lib/helpers/stringtoHexColor'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from 'zustand'
import { useUserStore } from '@/lib/hooks/useUserStore'

export const SiteDashboradSideMenuDropdown = ({ site }: { site: SiteDetail }) => {
  const router = useRouter()
  const siteStore = useStore(useSiteStore)
  const sites = useUserStore((state) => state.userTeam.sites)
  const isSwitching = useSiteStore((state) => state.loading)

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [imgError, setImgError] = useState<boolean>(false)
  const fallbackColor = stringtoHexColor(site.name)

  const handleSiteSwitch = async (newSite: Site) => {
    if (isSwitching) return
    siteStore.setLoading(true)
    setDropdownOpen(false)
    siteStore.emptySiteStates()
    siteStore.getSite(newSite.uuid)
    router.push(`/dashboard/sites/${newSite.uuid}`)
    setTimeout(() => {
      siteStore.setLoading(false)
    }, 800)
  }

  return (
    <div
      className={`w-full rounded-lg bg-brease-gray-2 p-2 shadow-brease-xs transition-all duration-300 ease-in-out ${isSwitching ? 'opacity-50' : 'opacity-100'}`}
    >
      <ul
        className={`w-full flex flex-col items-start text-t-xs cursor-pointer transition-all duration-700 ease-in-out overflow-hidden ${dropdownOpen ? 'max-h-screen' : 'max-h-[45px]'}`}
      >
        <button
          onClick={() => !isSwitching && setDropdownOpen(!dropdownOpen)}
          disabled={isSwitching}
          className={`relative z-20 w-full pr-2 rounded-md flex flex-row justify-between items-center my-[2px] hover:bg-white transition-all duration-300 ease-in-out ${
            dropdownOpen ? 'bg-white shadow-brease-xs' : ''
          } ${isSwitching ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <li
            className={`group w-full rounded-md text-t-xs font-golos-medium cursor-pointer transition-all duration-300 ease-in-out`}
          >
            <div className="flex flex-row justify-between items-center w-full h-full p-2 rounded-md group-hover:!bg-white transition-all duration-300 ease-in-out">
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
                <Text
                  size="sm"
                  style="medium"
                  htmlTag="span"
                  className="w-full truncate text-left max-w-[116px]"
                >
                  {site.name}
                </Text>
              </div>
            </div>
          </li>
          <div className="flex flex-col">
            <ChevronUp
              className={`h-4 w-4 stroke-brease-gray-9 ${dropdownOpen && 'translate-y-4'} transition-all duration-500 ease-in-out`}
              strokeWidth={dropdownOpen ? 2.5 : 2}
            />
            <ChevronDown
              className={`h-4 w-4 stroke-brease-gray-9 ${dropdownOpen && '-translate-y-4'} transition-all duration-500 ease-in-out`}
              strokeWidth={dropdownOpen ? 2.5 : 2}
            />
          </div>
        </button>
        <ul
          className={`w-full flex flex-col gap-2 py-1 ${dropdownOpen && 'animate-fade-down animate-delay-300 animate-duration-300 animate-ease-in-out'}`}
        >
          {sites &&
            sites
              .filter((x) => x.uuid != site.uuid)
              .map((siteItem: any) => (
                <SiteDashboradSideMenuDropdownItem
                  site={siteItem}
                  key={siteItem.uuid}
                  onClick={() => handleSiteSwitch(siteItem)}
                />
              ))}
          <li className="w-full px-1 mt-2">
            <Button
              variant="secondary"
              size="sm"
              label="Add New Site"
              navigateTo="/dashboard/sites/new"
              className="w-full justify-center"
            />
          </li>
        </ul>
      </ul>
    </div>
  )
}
