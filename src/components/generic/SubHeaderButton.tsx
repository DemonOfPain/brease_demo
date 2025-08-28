'use client'
import { ChevronDownIcon, FilePlus, Images, Server, SquareLibrary } from 'lucide-react'
import React, { useState } from 'react'
import { Text } from './Text'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { SiteDetail } from '@/interface/site'
import { Drawer, DrawerTrigger } from '../shadcn/ui/drawer'

interface SubHeaderButtonInterface {
  title: string
  desc: string
  icon: React.ReactNode
  onClick?: () => void
}

const SubHeaderButton = React.forwardRef<HTMLDivElement, SubHeaderButtonInterface>(
  ({ title, desc, icon, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className="w-fit cursor-pointer bg-white border border-brease-gray-3 rounded-lg p-2 pr-3 flex flex-row items-center gap-[10px] shadow-brease-xs hover:border-brease-gray-5 transition-all ease-in-out duration-200"
      >
        <div className="w-[42px] h-[42px] flex items-center justify-center bg-brease-gray-2 rounded">
          {icon}
        </div>
        <div className="flex flex-col items-start justify-between">
          <Text size={'sm'} style={'medium'}>
            {title}
          </Text>
          <Text size={'sm'} style={'regular'} className="text-brease-gray-8">
            {desc}
          </Text>
        </div>
      </div>
    )
  }
)

SubHeaderButton.displayName = 'SubHeaderButton'

interface MediaLibraryChildProps {
  open: boolean
}

export const MediaLibraryButton = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen} handleOnly>
      <DrawerTrigger asChild>
        <SubHeaderButton
          title="Media Library"
          desc="Manage all media on your site"
          icon={<Images className="w-[20px] h-[20px]" />}
        />
      </DrawerTrigger>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<MediaLibraryChildProps>, {
            open
          })
        : children}
    </Drawer>
  )
}

export const EditorButton = () => {
  const router = useRouter()
  const handleClick = () => {
    const site = useSiteStore.getState().site as SiteDetail
    router.push(`/editor/${site.uuid}`)
  }
  return (
    <SubHeaderButton
      icon={<Server className="w-[20px] h-[20px]" />}
      title="Editor"
      desc="Create sections, collections"
      onClick={handleClick}
    />
  )
}

export const ManagerButton = () => {
  const router = useRouter()
  const handleClick = () => {
    const site = useSiteStore.getState().site as SiteDetail
    router.push(`/editor/${site.uuid}/manager`)
  }
  return (
    <SubHeaderButton
      icon={<SquareLibrary className="w-[20px] h-[20px]" />}
      title="Collection Manager"
      desc="Edit and create collection items"
      onClick={handleClick}
    />
  )
}

export const CreateSiteButton = () => {
  const router = useRouter()
  const handleClick = () => router.push('/dashboard/sites/new')
  return (
    <SubHeaderButton
      icon={<FilePlus className="w-[20px] h-[20px]" />}
      title="Create Site"
      desc="Start building with Brease"
      onClick={handleClick}
    />
  )
}

// ??? TODO: wtf does this do?
export const PublishButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group cursor-pointer">
        <div className="w-fit bg-white border border-brease-gray-3 rounded-lg p-2 px-3 flex flex-row items-center gap-[10px] shadow-brease-xs hover:border-brease-gray-5 transition-all ease-in-out duration-200">
          <div className="w-fit h-[42px] flex items-start justify-start pt-2">
            <div className="w-[6px] h-[6px] rounded-full bg-brease-success" />
          </div>
          <div className="flex flex-col items-start justify-between">
            <Text size={'sm'} style={'medium'}>
              Publish
            </Text>
            <div className="flex flex-row items-center gap-1">
              <Text size={'sm'} style={'regular'} className="text-brease-gray-8">
                Latest publish:
              </Text>
              <Text size={'sm'} style={'medium'}>
                1hr ago
              </Text>
            </div>
          </div>
          <div className="w-[24px] h-[24px] flex items-center justify-center bg-brease-gray-2 rounded-full">
            <ChevronDownIcon
              className="w-[14px] h-[14px] stroke-brease-gray-8 group-data-[state=open]:rotate-180 transition-all duration-300 ease-in-out"
              strokeWidth={3}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[270px] flex flex-col p-2 list-none">
        ???
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
