'use client'

import { Navigation } from '@/components/dashboard/sites/navigations/Navigation'
import { useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { NavigationsPageLoader } from '@/components/dashboard/sites/navigations/NavigationsPageLoader'
import { AlertDialog, AlertDialogTrigger } from '@/components/shadcn/ui/alert-dialog'
import { NavigationDialog } from '@/components/dashboard/sites/navigations/NavigationDialog'
import Button from '@/components/generic/Button'
import { NavigationItemManager } from '@/components/dashboard/sites/navigations/NavigationItemManager'
import { NavigationItemDialog } from '@/components/dashboard/sites/navigations/NavigationItemDialog'
import { SiteNavigation } from '@/interface/site'
import { Badge } from '@/components/shadcn/ui/badge'
import { mockData } from '@/lib/mockData'
import { useParams } from 'next/navigation'

export default function SiteNavigationsPage() {
  const params = useParams()
  const siteId = params.site as string
  const [navigationItems, setNavigationItems] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  // Mock navigations
  const navigations = [{
    uuid: 'nav-001',
    name: 'Main Navigation',
    status: 'active'
  }]
  
  const currentNavigation = navigations[0]

  useEffect(() => {
    // Load navigation from mock data
    setNavigationItems(mockData.getNavigation())
  }, [refreshKey])

  // For demo, always show the navigation page with data
  if (!currentNavigation || !currentNavigation.uuid) {
    return (
      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full flex flex-row justify-between">
          <div className="w-fit flex flex-col">
            <Text size="xl" style="semibold">
              Site Navigations
            </Text>
            <Text size="sm" style="regular">
              Manage navigation menus on your site
            </Text>
          </div>
          <AlertDialog>
            <AlertDialogTrigger>
              <ButtonPlaceholder size="md" variant="black" label="Add Navigation" icon="Plus" />
            </AlertDialogTrigger>
            <NavigationDialog />
          </AlertDialog>
        </div>
        <div className="w-full flex flex-col gap-2">
          {navigations.map((nav) => (
            <Navigation key={nav.uuid} nav={nav} />
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className="w-full flex flex-col items-start gap-4">
        <div className="w-full flex flex-row justify-between">
          <div className="w-fit  flex flex-row items-center gap-4">
            <Button
              icon="ChevronLeft"
              size="md"
              variant="secondary"
              onClick={() => setCurrentNavigation({} as SiteNavigation)}
            />
            <div className="w-fit flex flex-col">
              <Text size="xl" style="semibold">
                {currentNavigation.name}
              </Text>
              <Badge variant="secondary" className="rounded-full text-brease-gray-7">
                {currentNavigation.uuid}
              </Badge>
            </div>
          </div>
          <div className="w-fit flex flex-row gap-4 items-center">
            {/* <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-0">
                <ButtonPlaceholder icon="Languages" size="md" variant="secondary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={6}>
                {availableLocales!.map((locale) => (
                  <DropdownMenuItem
                    className={`hover:!bg-brease-gray-2 rounded-md ${locale.code === currentLocale && '!bg-brease-gray-2'}`}
                    key={locale.uuid}
                    onClick={() => siteStore.setNavigationLocale(locale.code)}
                  >
                    {locale.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
            <AlertDialog>
              <AlertDialogTrigger>
                <ButtonPlaceholder
                  size="md"
                  variant="black"
                  label="Add Navigation Item"
                  icon="Plus"
                />
              </AlertDialogTrigger>
              <NavigationItemDialog nav={currentNavigation} />
            </AlertDialog>
          </div>
        </div>
        <NavigationItemManager items={navigationItems!} />
      </div>
    )
  }
}
