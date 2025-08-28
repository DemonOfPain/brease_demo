import React, { useCallback } from 'react'
import Image from 'next/image'
import breaseLogo from '@/images/brease-icon-primary.svg'
import { ChevronDown, Copy, LayoutPanelLeft, PanelsTopLeft, SquareLibrary } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import HeaderProfileMenuItem from '@/components/dashboard/dashboard-layout/HeaderProfileMenuItem'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Text } from '@/components/generic/Text'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import { UserRole } from '@/interface/user'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { useUserStore } from '@/lib/hooks/useUserStore'
import Button from '@/components/generic/Button'
import { useBuilderStore } from '@/lib/hooks/useBuilderStore'
import { File, Search } from 'lucide-react'
import { useStore } from 'zustand'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { useState, useMemo } from 'react'
import { Input } from '@/components/shadcn/ui/input'
import { Badge } from '@/components/shadcn/ui/badge'
import { Button as ButtonSm } from '@/components/shadcn/ui/button'
import { toast } from '@/components/shadcn/ui/use-toast'

export const EditorNavbar = () => {
  const builderStore = useStore(useBuilderStore)
  const managerStore = useStore(useManagerStore)
  const site = useSiteStore((state) => state.site)
  const siteLocales = useSiteStore((state) => state.locales)
  const sitePages = useSiteStore((state) => state.pages)
  const pageContent = useBuilderStore((state) => state.pageContent)
  const pageContentLocale = useBuilderStore((state) => state.locale)
  const entryContentLocale = useManagerStore((state) => state.locale)
  const userRole = useUserStore((state) => state.user.currentTeam?.userRole || 'admin')
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const [pageSearchTerm, setPageSearchTerm] = useState('')

  let currentView: string = 'editor'
  if (params.page) {
    currentView = 'builder'
  } else if (pathname.includes('/manager')) {
    currentView = 'manager'
  }

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ variant: 'success', title: 'Copied to clipboard' })
    } catch (err) {
      toast({ variant: 'error', title: 'Failed to copy' })
    }
  }, [])

  const filteredPages = useMemo(() => {
    if (!sitePages || !pageSearchTerm.trim()) {
      return sitePages?.filter((x) => x.uuid != pageContent.uuid) || []
    }
    return sitePages
      .filter((x) => x.uuid != pageContent.uuid)
      .filter((page) => page.name.toLowerCase().includes(pageSearchTerm.toLowerCase()))
  }, [sitePages, pageContent.uuid, pageSearchTerm])

  const handlePageSelect = (value: string) => {
    setPageSearchTerm('')
    router.push(`/editor/${site.uuid}/${value}`)
  }

  return (
    <nav className="w-full flex flex-row justify-between px-[20px] border-b">
      <div className="w-fit h-full flex flex-row items-center gap-2">
        <div className="w-fit h-full flex items-center border-r pr-[20px]">
          <Button
            variant="textType"
            icon="ArrowLeft"
            size="sm"
            className="!p-0"
            onClick={() => {
              router.push(`/dashboard/sites/${site.uuid}/pages`)
            }}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="group focus:outline-none flex flex-row items-center gap-1 pl-[8px]">
            <Image src={breaseLogo} className="w-[18px] h-[22.5px]" alt="Brease Logo" />
            <ChevronDown className="stroke-[1.5px] w-4 h-4 group-hover:stroke-brease-primary transition-colors ease-in-out duration-200" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={14}
            className="-ml-[10px] w-[200px] flex flex-col gap-1 p-2 list-none z-[9998]"
          >
            <div className="w-full flex flex-col">
              <HeaderProfileMenuItem
                label={'Pages'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/pages`)
                }}
                icon={'Layers'}
                className="!font-golos-medium"
              />
              {userRole === UserRole.administrator && (
                <>
                  <HeaderProfileMenuItem
                    label={'Navigations'}
                    onClick={() => {
                      router.push(`/dashboard/sites/${site.uuid}/navigations`)
                    }}
                    icon={'Route'}
                    className="!font-golos-medium"
                  />
                  <HeaderProfileMenuItem
                    label={'Redirects'}
                    onClick={() => {
                      router.push(`/dashboard/sites/${site.uuid}/redirects`)
                    }}
                    icon="Milestone"
                    className="!font-golos-medium"
                  />
                </>
              )}
              <HeaderProfileMenuItem
                label={'Languages'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/languages`)
                }}
                icon="Languages"
                className="!font-golos-medium"
              />
              {/* <HeaderProfileMenuItem
                label={'Integrations'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/integrations`)
                }}
                icon="Package"
                className="!font-golos-medium"
              />
              <HeaderProfileMenuItem
                label={'Users'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/users`)
                }}
                icon={'Users'}
                className="!font-golos-medium"
              />
              <HeaderProfileMenuItem
                label={'Roles'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/roles`)
                }}
                icon={'FileCheck'}
                className="!font-golos-medium"
              /> */}
              <HeaderProfileMenuItem
                label={'Site Settings'}
                onClick={() => {
                  router.push(`/dashboard/sites/${site.uuid}/settings`)
                }}
                icon={'Settings'}
                className="!font-golos-medium"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-[6px] pl-4 h-full border-l flex gap-4 items-center">
          <Button
            variant="secondary"
            size="sm"
            icon="Globe"
            label="Live"
            className="!px-2 !py-[7px]"
            navigateTo={`https://www.${site.domain}`}
          />
          {currentView === 'builder' && pageContent.uuid && sitePages && siteLocales && (
            <>
              <Select onValueChange={handlePageSelect} value={pageContent.uuid}>
                <SelectTrigger className="w-full !px-2 !py-[6px] rounded-md shadow-none focus-visible:!ring-0">
                  <SelectValue>
                    <SelectPageItem name={pageContent.name} icon={<File className="h-4 w-4" />} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-full" align="center" sideOffset={5}>
                  <div className="pb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-brease-gray-7" />
                      <Input
                        placeholder="Search pages..."
                        value={pageSearchTerm}
                        onChange={(e) => setPageSearchTerm(e.target.value)}
                        className="h-8 text-sm bg-brease-gray-2 border-transparent font-golos-medium"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key === 'Escape') {
                            setPageSearchTerm('')
                          }
                        }}
                        onFocus={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  {filteredPages.length > 0 ? (
                    filteredPages.map((page) => (
                      <SelectItem className="px-3 " key={page.uuid} value={page.uuid}>
                        <SelectPageItem name={page.name} icon={<File className="h-4 w-4" />} />
                      </SelectItem>
                    ))
                  ) : (
                    <div className="w-full flex flex-row justify-center items-center py-1">
                      <Text size="sm" style="regular" className="text-brease-gray-7">
                        {pageSearchTerm.trim() ? 'No pages found' : 'No other pages'}
                      </Text>
                    </div>
                  )}
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-0 border rounded-md flex divide-x items-center bg-brease-gray-1 border-brease-gray-5">
                  <Text size="sm" style="medium" className="!px-2 !py-[6px]">
                    Language
                  </Text>
                  <Text size="sm" style="semibold" className="!px-2 !py-[6px] uppercase">
                    {pageContentLocale}
                  </Text>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" sideOffset={9}>
                  {siteLocales!.map((locale) => (
                    <DropdownMenuItem
                      className={`hover:!bg-brease-gray-2 rounded-md ${locale.code === pageContentLocale && '!bg-brease-gray-2'}`}
                      key={locale.uuid}
                      onClick={() => builderStore.setLocale(locale.code)}
                    >
                      {locale.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {currentView === 'manager' && siteLocales && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-0 border rounded-md flex divide-x items-center bg-brease-gray-1 border-brease-gray-5">
                  <Text size="sm" style="medium" className="!px-2 !py-[6px]">
                    Language
                  </Text>
                  <Text size="sm" style="semibold" className="!px-2 !py-[6px] uppercase">
                    {entryContentLocale}
                  </Text>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" sideOffset={9}>
                  {siteLocales!.map((locale) => (
                    <DropdownMenuItem
                      className={`hover:!bg-brease-gray-2 rounded-md ${locale.code === entryContentLocale && '!bg-brease-gray-2'}`}
                      key={locale.uuid}
                      onClick={() => managerStore.setLocale(locale.code)}
                    >
                      {locale.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {userRole === UserRole.administrator && (
                <>
                  <Badge variant="secondary" className="rounded-full text-brease-gray-7">
                    {managerStore.collection.uuid}
                  </Badge>
                  <ButtonSm
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(managerStore.collection.uuid)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </ButtonSm>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-fit flex flex-row items-center gap-4 py-2">
        <div className="relative w-fit h-fit">
          {/* <Button
            icon="Sparkles"
            size="sm"
            variant="secondary"
            label="Ask your assistant"
            onClick={() => console.log('AI dialog open')}
            className="ml-2 ring-[1px] bg-white shadow-brease-xs !w-[250px] justify-start stroke-brease-primary !fill-brease-primary"
          /> */}
        </div>
        <SwitchEditorButton currentView={currentView} />
      </div>
    </nav>
  )
}

const SelectPageItem = ({ icon, name }: { icon: React.ReactNode; name: string }) => {
  return (
    <div className="w-full flex flex-row items-center gap-2 justify-between">
      <div className="w-fit">{icon}</div>
      <div className="w-[220px] flex flex-row  items-center justify-between">
        <Text size="sm" style="medium" className="w-full truncate">
          {name}
        </Text>
      </div>
    </div>
  )
}

const SwitchEditorButton = ({ currentView }: { currentView: string }) => {
  const router = useRouter()
  const site = useSiteStore((state) => state.site)
  const pageUuid = useSiteStore((state) => state.pages![0].uuid)
  const userRole = useUserStore((state) => state.user.currentTeam?.userRole || 'admin')

  const switchView = (editor: string) => {
    switch (editor) {
      case 'editor':
        router.push(`/editor/${site.uuid}`)
        break
      case 'builder':
        router.push(`/editor/${site.uuid}/${pageUuid}`)
        break
      case 'manager':
        router.push(`/editor/${site.uuid}/manager`)
        break
      default:
        break
    }
  }

  const viewOptions =
    userRole === UserRole.administrator
      ? [
          { value: 'editor', label: 'Editor', icon: <LayoutPanelLeft className="h-4 w-4" /> },
          {
            value: 'builder',
            label: 'Page Builder',
            icon: <PanelsTopLeft className="h-4 w-4" />
          },
          {
            value: 'manager',
            label: 'Collection Manager',
            icon: <SquareLibrary className="h-4 w-4" />
          }
        ]
      : [
          {
            value: 'builder',
            label: 'Page Builder',
            icon: <PanelsTopLeft className="h-4 w-4" />
          },
          {
            value: 'manager',
            label: 'Collection Manager',
            icon: <SquareLibrary className="h-4 w-4" />
          }
        ]

  const currentViewLabel = viewOptions.find((option) => option.value === currentView)?.label
  const availableOptions = viewOptions.filter((option) => option.value !== currentView)

  const optionStyles = [
    { value: 'editor', style: 'bg-brease-gray-10' },
    { value: 'manager', style: 'bg-brease-secondary-purple' },
    { value: 'builder', style: 'bg-brease-primary' }
  ]

  const optionStyle = optionStyles.find((option) => option.value === currentView)?.style

  return (
    <Select onValueChange={(value) => switchView(value)} value={currentView}>
      <SelectTrigger className={`gap-2 h-[35px] px-4 border-0 ${optionStyle}`}>
        <SelectValue>
          <SwitchEditorItem
            className="!text-brease-gray-1"
            label={currentViewLabel!}
            icon={viewOptions.find((x) => x.label === currentViewLabel)?.icon}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" sideOffset={4}>
        {availableOptions.map((option) => (
          <SelectItem className="px-4" key={option.value} value={option.value}>
            <SwitchEditorItem icon={option.icon} label={option.label} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const SwitchEditorItem = ({
  icon,
  label,
  className
}: {
  icon: React.ReactNode
  label: string
  className?: string
}) => {
  return (
    <div className={`flex flex-row gap-2 items-center justify-center ${className}`}>
      {icon}
      <Text size="sm" style="medium" className={`truncate ${className}`}>
        {label}
      </Text>
    </div>
  )
}
