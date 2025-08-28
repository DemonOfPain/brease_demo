'use client'
import { SiteLocale } from '@/interface/site'
import { ColumnDef } from '@tanstack/react-table'
import { Text } from '@/components/generic/Text'
import { TableActionButton } from '@/components/generic/TableActionButton'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { GenericTable } from '@/components/generic/GenericTable'
import { Badge } from '@/components/shadcn/ui/badge'
import { LanguageSelectDialog } from '@/components/dashboard/sites/languages/LanguageSelectDialog'
import { TeamsPageLoader } from '@/components/dashboard/teams/TeamsPageLoader'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useStore } from 'zustand'

export default function SiteLanguagesPage() {
  const siteStore = useStore(useSiteStore)
  const siteLocales = useSiteStore((state) => state.locales)
  const allLocales = useSiteStore((state) => state.allLocales)

  if (!allLocales) siteStore.getAllLocales()

  const handleRemoveLocale = async (locale: SiteLocale) => {
    const formData = new FormData()
    appendDataToFormData({ locale_id: locale.uuid }, formData, 'DELETE')
    siteStore.deleteSiteLocale(formData)
  }

  const handleUpdateLocale = async (locale: SiteLocale) => {
    const formData = new FormData()
    appendDataToFormData(
      { locale_id: locale.uuid, status: locale.status === 'active' ? 'inactive' : 'active' },
      formData,
      'POST'
    )
    siteStore.updateSiteLocale(formData)
  }

  const siteLocalesTable: ColumnDef<SiteLocale>[] = [
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
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.status === 'active' ? 'builderPublished' : 'builderUnpublished'}
          >
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </Badge>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <TableActionButton>
            <HeaderProfileMenuItem
              label={row.original.status === 'active' ? 'Deactivate' : 'Activate'}
              onClick={() => handleUpdateLocale(row.original)}
              icon={row.original.status === 'active' ? 'PowerOff' : 'Power'}
              className="!font-golos-medium"
            />
            <HeaderProfileMenuItem
              label={'Remove Language'}
              onClick={() => handleRemoveLocale(row.original)}
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

  if (!allLocales || !siteLocales) {
    return <TeamsPageLoader />
  } else {
    return (
      <div className="w-full h-full flex flex-col items-start gap-4 pb-16">
        <div className="w-full flex flex-row justify-between items-start border-b border-brease-gray-4 pb-4">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Languages
            </Text>
            <Text size="sm" style="regular">
              Manage the languages on your site
            </Text>
          </div>
        </div>
        <div className="w-full">
          <GenericTable
            columns={siteLocalesTable}
            data={siteLocales}
            hasFilter
            filterColumn="name"
            filterInputRowButton={<LanguageSelectDialog localesData={allLocales} />}
            filterPlaceholder="Search"
          />
        </div>
      </div>
    )
  }
}
