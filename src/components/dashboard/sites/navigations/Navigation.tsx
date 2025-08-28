'use client'

import { SiteNavigation } from '@/interface/site'
import React, { useCallback } from 'react'
import { Text } from '@/components/generic/Text'
import { TableActionButton } from '@/components/generic/TableActionButton'
import HeaderProfileMenuItem from '../../dashboard-layout/HeaderProfileMenuItem'
import { useStore } from 'zustand'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { NavigationDialog } from './NavigationDialog'
import { Badge } from '@/components/shadcn/ui/badge'
import { toast } from '@/components/shadcn/ui/use-toast'
import { Button } from '@/components/shadcn/ui/button'
import { Copy } from 'lucide-react'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { UserRole } from '@/interface/user'

export const Navigation = ({ nav }: { nav: SiteNavigation }) => {
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)
  const { user } = useUserStore()

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ variant: 'success', title: 'Copied to clipboard' })
    } catch (err) {
      toast({ variant: 'error', title: 'Failed to copy' })
    }
  }, [])

  const handleNavDelete = async () => {
    siteStore.setLoading(true)
    siteStore.deleteNavigation(nav.uuid)
    siteStore.setLoading(false)
  }

  return (
    <div className="hover:cursor-default w-full rounded-md border-brease-gray-4 border shadow-brease-xs p-4 flex flex-row justify-between items-center">
      <div className="w-fit flex flex-col gap-1">
        <Text size="xl" style="semibold">
          {nav.name}
        </Text>
        {user.currentTeam.userRole === UserRole.administrator && (
          <div className="w-fit flex flex-row items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-brease-gray-7">
              {nav.uuid}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(nav.uuid)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      <TableActionButton>
        <HeaderProfileMenuItem
          label={'Manage Navigation Items'}
          onClick={() => siteStore.setCurrentNavigation(nav)}
          icon={'AlignLeft'}
          className="!font-golos-medium"
        />
        <HeaderProfileMenuItem
          label={'Edit Navigation'}
          dialog
          customDialog={<NavigationDialog nav={nav} />}
          icon={'FilePen'}
          className="!font-golos-medium"
        />
        <HeaderProfileMenuItem
          label={'Delete Navigation'}
          dialog
          dialogProps={{
            title: 'Are you sure about deleting this Navigation?',
            description:
              'This is an irreversible action, the navigation will be deleted permanently.',
            cancelBtnLabel: 'Cancel',
            actionBtnLabel: loading ? 'Deleting page...' : 'Yes, I am sure',
            actionBtnOnClick: handleNavDelete
          }}
          icon={'Trash2'}
          className="w-full !font-golos-medium"
          textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
          iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
        />
      </TableActionButton>
    </div>
  )
}
