'use client'
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
import { useMemo, useState } from 'react'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { GenericTable } from '@/components/generic/GenericTable'
import { ColumnDef } from '@tanstack/react-table'
import { SiteLocale } from '@/interface/site'
import { Text } from '@/components/generic/Text'
import { Checkbox } from '@/components/shadcn/ui/checkbox'
import { LoaderCircleIcon } from 'lucide-react'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useStore } from 'zustand'
import { useSiteStore } from '@/lib/hooks/useSiteStore'

interface LanguageSelectDialogProps {
  localesData: SiteLocale[] | null
}

export const LanguageSelectDialog = ({ localesData }: LanguageSelectDialogProps) => {
  const siteStore = useStore(useSiteStore)
  const loading = useSiteStore((state) => state.loading)

  const [selectedRows, setSelectedRows] = useState<SiteLocale[]>([])
  const [open, setOpen] = useState(false)

  const columns = useMemo<ColumnDef<SiteLocale>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'name',
        header: 'Language',
        cell: ({ row }) => {
          return (
            <Text size="sm" style="semibold">
              {row.original.name}
            </Text>
          )
        }
      },
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => {
          return (
            <Text size="sm" style="regular">
              {row.original.code.toUpperCase()}
            </Text>
          )
        }
      }
    ],
    []
  )

  const handleSelectionChange = (selectedLocales: SiteLocale[]) => {
    setSelectedRows(selectedLocales)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSelectedRows([])
    }
  }

  const onSubmit = async () => {
    siteStore.setLoading(true)
    const selectedUuids = selectedRows.map((row) => row.uuid)
    const formData = new FormData()
    appendDataToFormData({ locale_id: selectedUuids }, formData, 'POST', {
      arrayFormat: 'brackets'
    })
    siteStore.addSiteLocale(formData)
    setOpen(false)
    siteStore.setLoading(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger className="w-fit">
        <ButtonPlaceholder variant="black" label="Add Language" icon="Plus" size="md" />
      </AlertDialogTrigger>
      <AlertDialogContent className="!max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Languages</AlertDialogTitle>
          <AlertDialogDescription className="!text-brease-gray-9">
            Select languages you want to add to your site
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="pb-4">
          <GenericTable
            columns={columns}
            data={localesData || []}
            enableRowSelection
            onSelectionChange={handleSelectionChange}
            hasFilter
            filterColumn="name"
            filterPlaceholder="Search"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {loading ? (
            <ButtonPlaceholder variant="primary" size="md">
              <LoaderCircleIcon className="h-4 w-[186px] stroke-brease-gray-1 animate-spin" />
            </ButtonPlaceholder>
          ) : (
            <AlertDialogAction onClick={onSubmit} disabled={selectedRows.length === 0}>
              Add Selected Languages
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
