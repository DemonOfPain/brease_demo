'use client'
import { Text } from '@/components/generic/Text'
import { ColumnDef } from '@tanstack/react-table'
import { TableActionButton } from '@/components/generic/TableActionButton'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { GenericTable } from '@/components/generic/GenericTable'
import { useEffect, useState } from 'react'
import Button from '@/components/generic/Button'
import { GenericAvatar } from '@/components/generic/GenericAvatar'
import { Badge } from '@/components/shadcn/ui/badge'
import { useRouter } from 'next/navigation'
import { SiteDetail } from '@/interface/site'
import { TeamsInviteDialog } from '@/components/dashboard/teams/TeamsInviteDialog'
import { TableUserAvatar } from '@/components/generic/TableUserAvatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/shadcn/ui/tooltip'
import { mockData } from '@/lib/mockData'

export default function TeamsPage() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [sitesList, setSitesList] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Mock user and team data
  const user = {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@brease.com',
    currentTeam: {
      uuid: 'team-001',
      name: 'Brease Demo Team',
      image: null
    },
    teams: []
  }

  const team = {
    uuid: 'team-001',
    name: 'Brease Demo Team',
    users: teamMembers,
    sites: sitesList
  }

  useEffect(() => {
    // Load mock data
    setTeamMembers(mockData.getTeamMembers())
    setSitesList(mockData.getSites())
  }, [refreshKey])

  // Poll for updates every second for demo - more aggressive refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const newMembers = mockData.getTeamMembers()
      const newSites = mockData.getSites()
      // Force re-render by creating new array references
      setTeamMembers([...newMembers])
      setSitesList([...newSites])
    }, 1000)
    
    // Also listen for explicit update events
    const handleUpdate = () => {
      const newMembers = mockData.getTeamMembers()
      const newSites = mockData.getSites()
      setTeamMembers([...newMembers])
      setSitesList([...newSites])
    }
    
    window.addEventListener('demo-data-updated', handleUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('demo-data-updated', handleUpdate)
    }
  }, [])

  const handleEditDetails = (site: SiteDetail) => {
    router.push(`/dashboard/sites/${site.uuid}/pages`)
  }

  const handleManageUsers = (site: SiteDetail) => {
    router.push(`/dashboard/sites/${site.uuid}/users`)
  }

  const handleManageRoles = (site: SiteDetail) => {
    router.push(`/dashboard/sites/${site.uuid}/roles`)
  }

  const handleRemoveTeamMember = (memberId: string) => {
    // Remove team member
    mockData.removeTeamMember(memberId)
    // Trigger refresh
    setRefreshKey(prev => prev + 1)
  }

  const users: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Member',
      cell: ({ row }) => {
        return (
          <div className="w-fit flex flex-row gap-4">
            <GenericAvatar
              image={row.original.avatar as string}
              fallbackInitials={row.original.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              size={42}
            />
            <div className="w-fit flex flex-col items-start">
              <Text size="sm" style="semibold">
                {row.original.name}
              </Text>
              <Text size="sm" style="regular" className="text-brease-gray-8">
                {row.original.email}
              </Text>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'bio',
      header: 'Bio',
      cell: ({ row }) => {
        return (
          <Text
            size="sm"
            style="regular"
            className="text-brease-gray-6 line-clamp-2 max-w-md"
          >{row.original.bio}</Text>
        )
      }
    },
    {
      // TODO: handle row actions
      id: 'actions',
      cell: ({ row }) => {
        return (
          <TableActionButton>
            <HeaderProfileMenuItem
              label={'Manage Permissions'}
              onClick={() => console.log(row.original)}
              icon={'UserRoundCog'}
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label={'Remove User'}
              onClick={() => handleRemoveTeamMember(row.original.id)}
              icon={'Trash2'}
              className="!font-golos-medium"
              textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
              iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
            />
          </TableActionButton>
        )
      }
    }
  ]

  const sites: ColumnDef<SiteDetail>[] = [
    {
      accessorKey: 'name',
      header: 'Site',
      cell: ({ row }) => {
        return (
          <div className="w-fit flex flex-row items-center gap-4">
            <GenericAvatar
              image={row.original.siteAvatar}
              fallbackInitials={row.original.name?.charAt(0).toUpperCase()}
              size={42}
            />
            <div className="w-fit flex flex-col items-start">
              <Text size="sm" style="semibold">
                {row.original.name}
              </Text>
              <Text size="sm" style="regular" className="text-brease-gray-8">
                {row.original.domain}
              </Text>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.status === 'published' ? 'publishedSite' : 'unpublishedSite'}
            className="uppercase py-1"
          >
            {row.original.status}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'users',
      header: 'Users',
      cell: ({ row }) => {
        return (
          <div className="flex flex-row">
            {row.original.users?.length <= 3 ? (
              row.original.users?.map((user, idx) => {
                const className =
                  idx != 0
                    ? `z-[${-idx}] -ml-[15px] border-2 border-brease-gray-3`
                    : `z-[${idx}] border-2 border-brease-gray-3`
                return <TableUserAvatar key={user.uuid} user={user} className={className} />
              })
            ) : (
              <>
                {row.original.users?.slice(0, 2).map((user, idx) => {
                  const className =
                    idx > 0
                      ? `z-[${-idx}] -ml-[15px] border-2 border-brease-gray-3`
                      : `z-[${idx}] border-2 border-brease-gray-3`
                  return <TableUserAvatar key={user.uuid} user={user} className={className} />
                })}
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                      <Text
                        size="sm"
                        style="regular"
                        className="ml-2"
                      >{`+${row.original.users?.slice(2, row.original.users?.length).length}`}</Text>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="flex flex-col gap-2">
                      {row.original.users?.slice(2, row.original.users?.length).map((user) => (
                        <Text key={user.uuid} size="sm" style="regular">
                          {`${user.firstName} ${user.lastName}`}
                        </Text>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <TableActionButton>
            <HeaderProfileMenuItem
              label={'Edit Pages'}
              onClick={() => handleEditDetails(row.original)}
              icon={'FilePen'}
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label={'Manage Users'}
              onClick={() => handleManageUsers(row.original)}
              icon={'Users'}
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label={'Manage Roles'}
              onClick={() => handleManageRoles(row.original)}
              icon={'UserCog'}
              className="!font-golos-medium"
            />
          </TableActionButton>
        )
      }
    }
  ]

  // Always show the page with mock data
  return (
      <div className="w-full flex flex-col items-start gap-4 pb-16">
        <div className="w-full flex flex-row justify-between items-start border-b border-brease-gray-4 pb-4">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Team Overview
            </Text>
            <Text size="sm" style="regular">
              Manage current team members, roles and subscriptions
            </Text>
          </div>
        </div>
        <div className="w-full flex justify-between items-center border-b border-brease-gray-4 pb-4">
          <div className="w-fit flex flex-row divide-x border-brease-gray-4 gap-4 ">
            <div className="flex flex-row items-center gap-4">
              <GenericAvatar
                image={user.currentTeam.image}
                fallbackInitials={user.currentTeam?.name?.charAt(0).toUpperCase()}
                className="w-12 h-12"
              />
              <div className="flex flex-col gap-1">
                <Text size="xl" style="semibold">
                  {user.currentTeam.name}
                </Text>
                {/*<Badge
                  variant={team.subscription.name === 'Free' ? 'teamStandardBadge' : 'teamProBadge'}
                  className="uppercase py-1 h-6 w-fit"
                >
                  {team.subscription.name}
                </Badge>*/}
              </div>
            </div>
            <div className="flex flex-col gap-2 pl-4">
              <Text size="sm" style="regular">
                {`Members: ${team.users?.length}`}
              </Text>
              <Text size="sm" style="regular">
                {`Sites: ${team.sites?.length}`}
              </Text>
            </div>
          </div>
          {/*<Button
            variant="secondary"
            label="Change Subscription Plan"
            icon="Layers"
            size="md"
            navigateTo={`/dashboard/pricing`}
            className="h-fit"
          />*/}
        </div>
        <div className="w-fit flex flex-col">
          <Text size="xl" style="semibold">
            Members
          </Text>
        </div>
        <div className="w-full">
          <GenericTable
            className="!max-h-none !h-fit"
            tableClassName="!max-h-none !h-full !flex-grow-0"
            columns={users}
            data={teamMembers}
            hasFilter
            filterColumn="name"
            filterInputRowButton={<TeamsInviteDialog />}
            filterPlaceholder="Search Users"
          />
        </div>
        <div className="w-fit flex flex-col">
          <Text size="xl" style="semibold">
            Sites
          </Text>
        </div>
        <div className="w-full">
          <GenericTable
            className="!max-h-none !h-fit"
            tableClassName="!max-h-none !h-full !flex-grow-0"
            columns={sites}
            data={sitesList}
            hasFilter
            noResultPlaceholder={`There aren't any sites belonging to your team!`}
            filterColumn="name"
            filterInputRowButton={
              <Button
                variant="black"
                label="Add New Site"
                icon="Plus"
                size="md"
                navigateTo={`/dashboard/sites/new`}
              />
            }
            filterPlaceholder="Search Sites"
          />
        </div>
      </div>
    )
}
