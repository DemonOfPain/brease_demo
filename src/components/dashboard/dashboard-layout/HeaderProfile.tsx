'use client'
import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import HeaderProfileMenuItem from './HeaderProfileMenuItem'
import { HeaderProfileTeamsItem } from './HeaderProfileTeamsItem'
import Button from '@/components/generic/Button'
import { signOut } from 'next-auth/react'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { Text } from '../../generic/Text'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { GenericAvatar } from '@/components/generic/GenericAvatar'
import { useRouter } from 'next/navigation'
import { useStore } from 'zustand'
import { useAssistantStore } from '@/lib/hooks/useAssistantStore'

const HeaderProfile = React.memo(() => {
  const router = useRouter()
  const userStore = useStore(useUserStore)
  const user = useUserStore((state) => ({
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    avatar: state.user.avatar,
    currentTeam: state.user.currentTeam || {},
    teams: state.user.teams || []
  }))

  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    // DEMO MODE: Logout doesn't actually work
    console.log('Logout clicked - demo mode')
    // useAssistantStore.persist.clearStorage()
    // useUserStore.persist.clearStorage()
    // await signOut()
  }

  const handleSwitchTeam = async (teamId: string) => {
    setOpen(false)
    router.push('/dashboard/sites')
    userStore.switchTeam(teamId)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group cursor-pointer focus:outline-none">
        <div className="flex flex-row items-center gap-3 border border-transparent px-2 py-1 rounded-full group-data-[state=open]:border-brease-gray-5 group-data-[state=open]:bg-white transition-all duration-300 ease-in-out">
          <GenericAvatar
            className="w-7 h-7"
            image={user.avatar as string}
            fallbackInitials={user.firstName && user.lastName 
              ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
              : 'DU'
            }
          />
          <div className="flex flex-col items-start">
            <Text size="xs" style="medium">
              {user.firstName || 'Demo User'}
            </Text>
            <Text size="xxs" style="regular">
              {user.currentTeam?.name || 'Demo Team'}
            </Text>
          </div>
          <ChevronDownIcon
            className="w-[14px] h-[14px] stroke-brease-gray-8 group-data-[state=open]:rotate-180 transition-all duration-300 ease-in-out"
            strokeWidth={3}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[270px] flex flex-col p-2 list-none z-[9998]">
        <div className="w-full flex flex-col border-b border-brease-gray-5 pb-2">
          {/* DEMO MODE: Commented out My Account
          <HeaderProfileMenuItem
            label={'My Account'}
            onClick={() => {
              setOpen(false)
              router.push('/dashboard/my-account')
            }}
            icon={'User'}
            className="!font-golos-medium"
          />
          */}
          {/* <HeaderProfileMenuItem
            label={'Plans & Pricing'}
            onClick={() => {
              setOpen(false)
              router.push('/dashboard/pricing')
            }}
            icon={'Layers'}
            className="!font-golos-medium"
          />
          <HeaderProfileMenuItem
            label={'Notifications'}
            link={'#'}
            icon={'Bell'}
            className="!font-golos-medium"
          /> */}
        </div>
        <div className="w-full flex flex-col divide-y divide-brease-gray-5 gap-1 pb-2">
          <div className="w-full flex flex-col gap-1 pb-1">
            <Text
              htmlTag="span"
              size="xxs"
              style="medium"
              className="text-brease-gray-8 uppercase py-2"
            >
              my teams
            </Text>
            <HeaderProfileTeamsItem
              team={user.currentTeam}
              onClick={() => {
                setOpen(false)
                router.push('/dashboard/teams')
              }}
            />
          </div>
          {
            // do not render unless there are multiple teams
            user.teams?.filter((team) => team.uuid != user.currentTeam?.uuid).length >= 1 && (
              <div className="w-full flex flex-col gap-1 pt-2">
                {
                  //TODO: add team interface
                  user.teams
                    ?.filter((team) => team.uuid != user.currentTeam?.uuid)
                    ?.map((team: any) => (
                      <HeaderProfileTeamsItem
                        key={team.uuid}
                        team={team}
                        onClick={() => handleSwitchTeam(team.uuid)}
                      />
                    ))
                }
              </div>
            )
          }
        </div>
        <Button
          label="Sign out"
          icon="LogOut"
          className="w-full justify-center"
          variant="secondary"
          size="md"
          onClick={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

HeaderProfile.displayName = 'HeaderProfile'

export default React.memo(HeaderProfile)
