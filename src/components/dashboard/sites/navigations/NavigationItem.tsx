import { SiteNavigationItem } from '@/interface/site'
import React from 'react'
import { Text } from '@/components/generic/Text'
import HeaderProfileMenuItem from '../../dashboard-layout/HeaderProfileMenuItem'
import { NavigationItemDialog } from './NavigationItemDialog'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { Draggable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { NavigationChildrenDialog } from './NavigationChildrenDialog'
import { NavigationSubItem } from './NavigationSubItem'

export const NavigationItem = ({ item, index }: { item: SiteNavigationItem; index: number }) => {
  const { loading, setLoading, deleteNavigationItem, currentNavigation } = useSiteStore()

  const handleNavItemDelete = async () => {
    setLoading(true)
    await deleteNavigationItem(item.uuid)
    setLoading(false)
  }

  return (
    <Draggable draggableId={item.uuid} index={index} key={item.uuid}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            draggable relative flex flex-col gap-2
            ${snapshot.isDragging ? 'z-[99999999999]' : 'z-0'}
            ${snapshot.isDragging ? 'w-[300px]' : 'w-full'}
          `}
          style={{
            ...provided.draggableProps.style
          }}
        >
          <div
            className={`
              w-full flex flex-row items-center bg-brease-gray-1 px-2 py-4 rounded-md
              ${snapshot.isDragging ? 'shadow-lg opacity-95' : 'shadow-brease-xs'}
              transition-all duration-200
            `}
          >
            <div
              {...provided.dragHandleProps}
              className="p-2 flex justify-center items-center mr-2 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>
            <Text size="md" style="medium" className="flex-grow">
              {item.value}
            </Text>
            <div
              className={`${snapshot.isDragging && '!hidden'} flex w-fit flex-row items-center gap-2 list-none`}
            >
              <HeaderProfileMenuItem
                label={''}
                dialog
                customDialog={<NavigationChildrenDialog navItem={item} />}
                icon={'Plus'}
                className="!font-golos-medium bg-brease-gray-3"
              />
              <HeaderProfileMenuItem
                label={''}
                dialog
                customDialog={<NavigationItemDialog nav={currentNavigation!} navItem={item} />}
                icon={'FilePen'}
                className="!font-golos-medium bg-brease-gray-3"
              />
              <HeaderProfileMenuItem
                label={''}
                dialog
                dialogProps={{
                  title: 'Are you sure about deleting this Navigation Item?',
                  description:
                    'This is an irreversible action, the navigation will be deleted permanently.',
                  cancelBtnLabel: 'Cancel',
                  actionBtnLabel: loading ? 'Deleting item...' : 'Yes, I am sure',
                  actionBtnOnClick: handleNavItemDelete
                }}
                icon={'Trash2'}
                className="w-full !font-golos-medium"
                textClassName="!text-brease-error bg-brease-error-light group-hover:!bg-brease-error group-hover:!text-white"
                iconClassName="!stroke-brease-error group-hover:!stroke-white transition-all duration-300 ease-in-out"
              />
            </div>
          </div>
          {item.children.length != 0 && (
            <div className="ml-8 flex flex-grow flex-col">
              {item.children.map((sub) => (
                <NavigationSubItem key={sub.uuid} subItem={sub} />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
