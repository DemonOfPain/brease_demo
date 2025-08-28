'use client'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { GenericTable } from '@/components/generic/GenericTable'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { SiteToken } from '@/interface/site'
import { Button } from '@/components/shadcn/ui/button'
import { Input } from '@/components/shadcn/ui/input'
import { Label } from '@/components/shadcn/ui/label'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/shadcn/ui/alert-dialog'
import { Trash2, Plus, Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from '@/components/shadcn/ui/use-toast'
import { Text } from '@/components/generic/Text'
import { LoaderCircleIcon } from 'lucide-react'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { DatePicker } from '@/components/generic/DatePicker'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import { Badge } from '@/components/shadcn/ui/badge'

export const TokensTable = () => {
  const { tokens, getTokens, createToken, deleteToken, loading, environment } = useSiteStore()
  const [visibleTokens, setVisibleTokens] = useState<Record<string, boolean>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newToken, setNewToken] = useState({
    name: '',
    livePreview: false,
    expiry_at: null as Date | null
  })

  useEffect(() => {
    getTokens()
  }, [getTokens])

  const handleCreateToken = useCallback(async () => {
    if (!newToken.name.trim()) {
      toast({ variant: 'error', title: 'Token name is required' })
      return
    }

    await createToken({
      name: newToken.name,
      livePreview: newToken.livePreview,
      expiry_at: newToken.expiry_at
    })

    setNewToken({ name: '', livePreview: false, expiry_at: null })
    setDialogOpen(false)
  }, [newToken, createToken])

  const toggleTokenVisibility = useCallback((tokenId: string) => {
    setVisibleTokens((prev) => ({ ...prev, [tokenId]: !prev[tokenId] }))
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ variant: 'success', title: 'Copied to clipboard' })
    } catch (err) {
      toast({ variant: 'error', title: 'Failed to copy' })
    }
  }, [])

  const columns: ColumnDef<SiteToken>[] = useMemo(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>
      },
      {
        id: 'token',
        accessorKey: 'token',
        header: 'Token',
        cell: ({ row }) => {
          const token = row.getValue('token') as string
          const tokenId = row.original.uuid
          const isVisible = visibleTokens[tokenId]

          return (
            <div className="flex items-center gap-2 w-80">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono truncate flex-1 min-w-0">
                {isVisible ? token : '•••••••••••••••••••••••••••••••••'}
              </code>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTokenVisibility(tokenId)}
                  className="h-6 w-6 p-0"
                >
                  {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(token)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )
        }
      },
      {
        id: 'livePreview',
        accessorKey: 'livePreview',
        header: 'Live Preview',
        cell: ({ row }) => (
          <Checkbox
            checked={row.getValue('livePreview')}
            disabled
            className="pointer-events-none"
          />
        )
      },
      {
        id: 'expiry_at',
        accessorKey: 'expiry_at',
        header: 'Expires',
        cell: ({ row }) => {
          const expiryDate = row.getValue('expiry_at') as Date | null
          return <div>{expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Never'}</div>
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Token</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the token &quot;{row.original.name}&quot;? This
                  action cannot be undone and will immediately revoke access for this token.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteToken(row.original.uuid)}
                  className="!bg-brease-error !ring-brease-error hover:!bg-brease-error-light hover:!text-brease-error"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      }
    ],
    [visibleTokens, toggleTokenVisibility, copyToClipboard, deleteToken]
  )

  return (
    <div className="w-full flex flex-col gap-6 border-t border-brease-gray-4 py-6">
      <div className="w-full flex flex-row items-end justify-between">
        <div className="w-fit flex flex-col">
          <Text size="xl" style="semibold">
            Tokens
          </Text>
          <Text size="sm" style="regular" className="pb-2">
            Manage API tokens for the following environment
          </Text>
          <div className="w-fit flex flex-row items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-brease-gray-7 w-fit">
              {environment.uuid}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(environment.uuid)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Token
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <VisuallyHidden>
              <AlertDialogTitle></AlertDialogTitle>
              <AlertDialogDescription></AlertDialogDescription>
            </VisuallyHidden>
            <AlertDialogCancel className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200">
              <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
            </AlertDialogCancel>

            <div className="w-full flex flex-col gap-4 p-4">
              <Text size="lg" style="semibold">
                Create New Token
              </Text>

              <div>
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  value={newToken.name}
                  onChange={(e) => setNewToken((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter token name"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="livePreview"
                  checked={newToken.livePreview}
                  onCheckedChange={(checked) =>
                    setNewToken((prev) => ({ ...prev, livePreview: checked as boolean }))
                  }
                />
                <Label htmlFor="livePreview">Enable Live Preview</Label>
              </div>

              <div>
                <Label>Expiry Date (Optional)</Label>
                <DatePicker
                  value={newToken.expiry_at}
                  onChange={(date) =>
                    setNewToken((prev) => ({
                      ...prev,
                      expiry_at: date ? new Date(date) : null
                    }))
                  }
                  className="!w-full"
                />
              </div>
            </div>

            <AlertDialogFooter>
              {loading ? (
                <ButtonPlaceholder variant="primary" size="md">
                  <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                </ButtonPlaceholder>
              ) : (
                <AlertDialogAction
                  className="w-full justify-center mx-4 -mt-2 mb-2"
                  disabled={!newToken.name.trim()}
                  onClick={handleCreateToken}
                >
                  Create
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {tokens === null ? (
        <Skeleton className="w-full h-[263px]" />
      ) : (
        <GenericTable
          data={tokens}
          columns={columns}
          noResultPlaceholder="No tokens found. Create your first token to get started."
        />
      )}
    </div>
  )
}
