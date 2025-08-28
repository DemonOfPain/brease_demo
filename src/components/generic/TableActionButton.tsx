import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/shadcn/ui/dropdown-menu'
import { ButtonPlaceholder } from './ButtonPlaceholder'

export const TableActionButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-fit flex justify-end cursor-pointer">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <ButtonPlaceholder
            variant="secondary"
            icon="Ellipsis"
            size="sm"
            className="!bg-brease-gray-3 hover:!bg-transparent !ring-0 hover:!ring-1 !ring-brease-gray-5 !py-1 !px-1 !stroke-brease-gray-10  "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="list-none flex flex-col !z-[9999999999999999999999999]"
        >
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
