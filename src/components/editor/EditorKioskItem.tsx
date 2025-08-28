import { Element } from '@/interface/editor'
import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import Image from 'next/image'
import { MenuSquare } from 'lucide-react'
import { Text } from '@/components/generic/Text'

export interface EditorKioskItemInterface {
  element: Element
  index: number
}

export const EditorKioskItem = ({ element, index }: EditorKioskItemInterface) => {
  return (
    <Draggable draggableId={element.uuid} index={index} key={element.uuid}>
      {(provided, snapshot) => (
        <>
          <div
            className={`flex min-w-fit flex-row px-4 justify-start items-center gap-4 h-[54px] p-2 rounded-lg shadow-brease-xs border border-brease-gray-5 bg-brease-gray-1 ${snapshot.isDragging && 'outline-dashed !bg-brease-gray-2 outline-brease-primary shadow-brease-lg'}`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {element.icon ? (
              <Image
                src={element.icon}
                alt={element.name}
                width={20}
                height={20}
                className="w-[20px] h-[20px]"
              />
            ) : (
              <MenuSquare width={20} height={20} className="min-w-[20px] min-h-[20px]" />
            )}
            <div className="flex flex-col">
              <Text size="sm" style="semibold">
                {element.name}
              </Text>
            </div>
          </div>
          {snapshot.isDragging && (
            <div className="flex flex-row px-4 justify-start items-center gap-4 min-w-fit py-2 rounded-lg shadow-brease-xs bg-brease-gray-4 opacity-50">
              {element.icon ? (
                <Image
                  src={element.icon}
                  alt={element.name}
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px]"
                />
              ) : (
                <MenuSquare width={20} height={20} className="min-w-[20px] min-h-[20px]" />
              )}
              <div className="flex flex-col">
                <Text size="sm" style="semibold">
                  {element.name}
                </Text>
              </div>
            </div>
          )}
        </>
      )}
    </Draggable>
  )
}
