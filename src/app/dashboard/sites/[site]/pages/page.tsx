'use client'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import Button from '@/components/generic/Button'
import { TableActionButton } from '@/components/generic/TableActionButton'
import { SitePage } from '@/interface/site'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo, useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { GenericTable } from '@/components/generic/GenericTable'
import { TableUserAvatar } from '@/components/generic/TableUserAvatar'
import { SitesPagesLoader } from '@/components/dashboard/sites/pages/SitesPagesLoader'
import { mockData } from '@/lib/mockData'
import { useParams } from 'next/navigation'

export default function SitesPages() {
  const params = useParams()
  const siteId = params.site as string
  const [pages, setPages] = useState<any[]>([])
  const [site, setSite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Load mock data
    setLoading(true)
    const siteData = mockData.getSite(siteId)
    setSite(siteData)
    const pagesData = mockData.getPages(siteId)
    console.log('Loading pages for site:', siteId, 'Found:', pagesData?.length || 0, 'Pages:', pagesData)
    setPages(pagesData || [])
    setLoading(false)
  }, [siteId, refreshKey])

  // Poll for updates every 2 seconds for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const pagesData = mockData.getPages(siteId)
      setPages(pagesData || [])
    }, 2000)
    return () => clearInterval(interval)
  }, [siteId])

  const handlePageDelete = async (pageId: string) => {
    // For demo, we don't actually delete
    console.log('Delete page:', pageId)
  }

  const columns = useMemo<ColumnDef<SitePage>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          return (
            <Text size="sm" style="semibold">
              {row.original.name}
            </Text>
          )
        }
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ row }) => {
          return (
            <Text
              size="sm"
              style="regular"
              className="text-brease-gray-6"
            >{`${row.original.slug}`}</Text>
          )
        }
      },
      {
        accessorKey: 'lastUpdated',
        header: 'Last edited',
        cell: ({ row }) => {
          return (
            <div className="flex flex-row gap-4 items-center">
              <Text size="sm" style="regular" className="text-brease-gray-6">
                {row.original.lastUpdated || '-'}
              </Text>
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
                label={'Open in Page Builder'}
                link={`/editor/${site?.uuid || siteId}/${row.original.uuid}`}
                icon={'LayoutPanelLeft'}
                className="!font-golos-medium"
              />
              <HeaderProfileMenuItem
                label={'Edit page details'}
                link={`/dashboard/sites/${site?.uuid || siteId}/pages/${row.original.uuid}`}
                icon={'FilePen'}
                className="!font-golos-medium"
              />
              {row.original.slug !== '' && (
                <HeaderProfileMenuItem
                  label={'Delete Page'}
                  dialog
                  dialogProps={{
                    title: 'Are you sure about deleting this page?',
                    description:
                      'This is an irreversible action, the page will be deleted permanently.',
                    cancelBtnLabel: 'Cancel',
                    actionBtnLabel: loading ? 'Deleting page...' : 'Yes, I am sure',
                    actionBtnOnClick: () => handlePageDelete(row.original.uuid)
                  }}
                  icon={'Trash2'}
                  className="w-full !font-golos-medium"
                  textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
                  iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
                />
              )}
            </TableActionButton>
          )
        }
      }
    ],
    [siteId, loading]
  )

  if (loading) return <SitesPagesLoader />

  return (
    <div className="w-full h-full transition-opacity duration-300 ease-in-out">
      <div className="w-full h-full flex flex-col items-start gap-4">
        <div className="w-full flex flex-row justify-between items-start">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Pages
            </Text>
            <Text size="sm" style="regular">
              Create, modify and build pages
            </Text>
          </div>
        </div>
        <GenericTable
          columns={columns}
          data={pages}
          hasFilter
          noResultPlaceholder="There are no pages on this site yet!"
          filterColumn="name"
          filterInputRowButton={
            <Button
              variant="black"
              label="Create New Page"
              icon="Plus"
              size="md"
              navigateTo={`/dashboard/sites/${site?.uuid || siteId}/pages/new-page`}
            />
          }
          filterPlaceholder="Search Page"
        />
      </div>
    </div>
  )
}
