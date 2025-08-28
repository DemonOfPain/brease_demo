import React from 'react'
import { Element } from '@/interface/editor'
import { Droppable } from '@hello-pangea/dnd'
import { EditorKioskItem } from './EditorKioskItem'
import { useHorizontalScroll } from '@/lib/hooks/useSideScroll'
import { useEditorStore } from '@/lib/hooks/useEditorStore'

export const EditorKiosk = () => {
  const elements = useEditorStore((state) => state.elements)
  const activeMenu = useEditorStore((state) => state.editorType)
  const kioskElements = elements!.map((element: Element) => {
    return { ...element, uuid: 'kiosk-' + element.uuid }
  })

  const scrollRef = useHorizontalScroll()

  return (
    <Droppable droppableId="KIOSK" type="SECTION_SLOT" isDropDisabled={true} direction="horizontal">
      {(provided) => (
        <div
          className="flex flex-row gap-2 w-full h-fit pb-0 bg-brease-gray-1"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <div
            ref={scrollRef}
            className="w-fit overflow-x-scroll no-scrollbar h-fit flex flex-row gap-2 pb-5 px-4"
          >
            {kioskElements
              .filter((el: Element) =>
                // when editing collection, exclude Collection element for obvious reasons
                activeMenu === 'collections' ? el.type != 'collection' : el
              )
              .map((el: Element, idx: number) => (
                <EditorKioskItem element={el} index={idx} key={el.uuid} />
              ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}
