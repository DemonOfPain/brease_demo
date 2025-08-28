'use client'
import { SiteRedirect } from '@/interface/site'
import { ColumnDef } from '@tanstack/react-table'
import { Text } from '@/components/generic/Text'
import { TableActionButton } from '@/components/generic/TableActionButton'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { GenericTable } from '@/components/generic/GenericTable'
import { Badge } from '@/components/shadcn/ui/badge'
import { RedirectDialog } from '@/components/dashboard/sites/redirects/RedirectDialog'
import { TeamsPageLoader } from '@/components/dashboard/teams/TeamsPageLoader'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useStore } from 'zustand'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'

export default function SiteRedirectsPage() {
  const siteStore = useStore(useSiteStore)
  const redirects = useSiteStore((state) => state.redirects)
  const [editingRedirect, setEditingRedirect] = useState<SiteRedirect | undefined>()
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  if (!redirects) siteStore.getRedirects()

  const handleDeleteRedirect = async (redirect: SiteRedirect) => {
    siteStore.deleteRedirect(redirect.uuid, undefined, { showSuccessToast: true })
  }

  const handleEditRedirect = (redirect: SiteRedirect) => {
    setEditingRedirect(redirect)
    setEditDialogOpen(true)
  }

  const redirectsTable: ColumnDef<SiteRedirect>[] = [
    {
      accessorKey: 'source',
      header: 'Source URL',
      cell: ({ row }) => {
        return (
          <Text size="sm" style="semibold" className="font-mono">
            {row.original.source}
          </Text>
        )
      }
    },
    {
      accessorKey: 'destination',
      header: 'Destination URL',
      cell: ({ row }) => {
        return (
          <Text size="sm" style="regular" className="font-mono">
            {row.original.destination}
          </Text>
        )
      }
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return <Badge variant={'builderUnpublished'}>{row.original.type}</Badge>
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <TableActionButton>
            <HeaderProfileMenuItem
              label="Edit Redirect"
              onClick={() => handleEditRedirect(row.original)}
              icon="FilePen"
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label="Delete Redirect"
              onClick={() => handleDeleteRedirect(row.original)}
              icon="Trash2"
              className="!font-golos-medium"
              textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
              iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
            />
          </TableActionButton>
        )
      }
    }
  ]

  if (!redirects) {
    return <TeamsPageLoader />
  } else {
    return (
      <div className="w-full h-full flex flex-col items-start gap-4">
        <div className="w-full flex flex-row justify-between items-start border-b border-brease-gray-4 pb-4">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Redirects
            </Text>
            <Text size="sm" style="regular">
              Manage URL redirects for your site
            </Text>
          </div>
        </div>
        <div className="w-full">
          <GenericTable
            columns={redirectsTable}
            data={redirects}
            hasFilter
            filterColumn="source"
            filterInputRowButton={<RedirectDialog />}
            filterPlaceholder="Search redirects"
          />
        </div>

        {/* Edit Dialog */}
        <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <AlertDialogTrigger className="hidden" />
          <AlertDialogContent>
            <RedirectDialog
              redirect={editingRedirect}
              onClose={() => {
                setEditDialogOpen(false)
                setEditingRedirect(undefined)
              }}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }
}
