import { SiteNavigationItem } from '@/interface/site'
import React from 'react'
import { Text } from '@/components/generic/Text'

export const NavigationSubItem = ({ subItem }: { subItem: SiteNavigationItem }) => {
  return (
    <>
      <div className="flex-grow bg-brease-gray-1 my-1 p-2 rounded-md shadow-brease-xs">
        <Text style="medium" size="sm">
          {subItem.value}
        </Text>
      </div>
      {subItem.children.length != 0 && (
        <div className="flex-grow ml-4 flex flex-col">
          {subItem.children.map((deeperSub) => (
            <NavigationSubItem key={deeperSub.uuid} subItem={deeperSub} />
          ))}
        </div>
      )}
    </>
  )
}
