'use client'
import { Text } from '@/components/generic/Text'
import { ColumnDef } from '@tanstack/react-table'
import { SiteUser } from '@/interface/user'
import { TableActionButton } from '@/components/generic/TableActionButton'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { GenericTable } from '@/components/generic/GenericTable'
import { SitesPagesLoader } from '@/components/dashboard/sites/pages/SitesPagesLoader'
import { GenericAvatar } from '@/components/generic/GenericAvatar'
import { useSiteStore } from '@/lib/hooks/useSiteStore'

export default function SiteUsersPage() {
  const site = useSiteStore((state) => state.site)

  const columns: ColumnDef<SiteUser>[] = [
    {
      accessorKey: 'fullName',
      header: 'User',
      cell: ({ row }) => {
        return (
          <div className="w-fit flex flex-row gap-4">
            <GenericAvatar
              size={45}
              image={row.original.avatar as string}
              fallbackInitials={`${row.original.firstName?.charAt(0).toUpperCase()}${row.original.lastName?.charAt(0).toUpperCase()}`}
            />
            <div className="w-fit flex flex-col items-start">
              <Text size="sm" style="semibold">
                {row.original.fullName}
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
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        return (
          <Text
            size="sm"
            style="regular"
            className="text-brease-gray-6"
          >{`${row.original.role.name}`}</Text>
        )
      }
    },
    // {
    //   accessorKey: 'lastActive',
    //   header: 'Last Active',
    //   cell: ({ row }) => {
    //     return (
    //       <Text
    //         size="sm"
    //         style="regular"
    //         className="text-brease-gray-6"
    //       >{`/${row.original.lastActive}`}</Text>
    //     )
    //   }
    // },
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
              onClick={() => console.log(row.original)}
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

  // TODO: handle add user btn
  if (!site) {
    return <SitesPagesLoader />
  } else {
    return (
      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full flex flex-row justify-between items-start">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Site Users
            </Text>
            <Text size="sm" style="regular">
              Manage user access, roles and permissions
            </Text>
          </div>
        </div>
        <div className="w-full">
          <GenericTable
            columns={columns}
            data={site.users}
            hasFilter
            filterColumn="fullName"
            filterInputRowTitle="Users"
            filterPlaceholder="Search user"
          />
        </div>
      </div>
    )
  }
}
