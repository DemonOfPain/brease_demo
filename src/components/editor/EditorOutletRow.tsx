import React, { useContext } from 'react'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, Plus } from 'lucide-react'
import { EditorElementMatrixRow, EditorElementMatrixSlot } from '@/interface/editor'
import { EditorOutletSlot } from './EditorOutletSlot'
import { EditorDraftContext } from '@/lib/context/EditorDraftContext'
import { useHorizontalScroll } from '@/lib/hooks/useSideScroll'

interface EditorOutletRowInterface {
  row: EditorElementMatrixRow
  uuid: string
  index: number
}

export const EditorOutletRow = ({ row, uuid, index }: EditorOutletRowInterface) => {
  const { setItemClone } = useContext(EditorDraftContext)

  const handleDeleteRow = () => {
    setItemClone((prev) => {
      const newElements = [...prev.elements]
      newElements.splice(index, 1)
      return { ...prev, elements: newElements }
    })
  }

  const scrollRef = useHorizontalScroll()

  return (
    <Draggable draggableId={uuid} index={index} key={uuid}>
      {(provided, snapshot) => (
        <div
          className={`group/row relative flex flex-row justify-start items-center gap-4 w-full min-h-[108px] py-2 pr-4 mt-2 -mb-4 rounded-lg bg-brease-gray-1 ${snapshot.isDragging && 'outline-dashed outline-brease-primary shadow-brease-lg'}`}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <button
            onClick={handleDeleteRow}
            className="group/delete-row hidden group-hover/row:block cursor-pointer absolute right-2 top-0 bg-brease-gray-1 p-1 rounded-full border border-brease-gray-5"
          >
            <Plus className="w-3 h-3 stroke-black rotate-45 group-hover/delete-row:stroke-brease-error transition-colors ease-in-out duration-200" />
          </button>
          <div
            className="p-2 flex justify-center items-center border-r border-brease-gray-7"
            {...provided.dragHandleProps}
          >
            <GripVertical />
          </div>
          <Droppable droppableId={uuid} direction="horizontal" type="SECTION_SLOT">
            {(provided, snapshot) => (
              <div
                className={`w-[calc(100%-41px-16px)] flex flex-row items-center border border-brease-gray-5 border-dashed rounded-lg transition-all ease-in-out duration-200 ${snapshot.isDraggingOver && '!border-brease-primary'} [&>*]:mr-0`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {row.length > 0 ? (
                  <div
                    ref={scrollRef}
                    className={`w-fit overflow-x-auto no-scrollbar h-[90px] p-2 pl-4 gap-2 flex flex-row relative`}
                  >
                    {row.map((slot: EditorElementMatrixSlot, idx: number) => (
                      <EditorOutletSlot
                        slot={slot}
                        slotIndex={idx}
                        rowIndex={index}
                        key={slot?.uuid}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                ) : (
                  <div
                    className={`w-full h-[90px] p-1 flex flex-row flex-grow border border-brease-gray-5 border-dashed rounded-lg transition-all ease-in-out duration-200 ${snapshot.isDraggingOver && '!border-brease-primary'}`}
                  >
                    {provided.placeholder}
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
}
