'use client'
import { DragDropContext } from '@hello-pangea/dnd'
import { EditorItem, EditorItemType, Element } from '@/interface/editor'
import { EditorKiosk } from './EditorKiosk'
import { EditorOutlet } from './EditorOutlet'
import { useEditorDrafts } from '@/lib/hooks/useEditorDrafts'
import { useEditorDragAndDrop } from '@/lib/hooks/useEditorDragAndDrop'
import { Text } from '../generic/Text'
import { EditorDraftContext } from '@/lib/context/EditorDraftContext'

interface EditorInterface {
  editorTools: Element[]
  originalItems: EditorItem[]
  // eslint-disable-next-line no-unused-vars
  setActiveItem: (item: EditorItem) => void
  activeItem: EditorItem
}

export const Editor = ({
  editorTools,
  originalItems,
  activeItem,
  setActiveItem
}: EditorInterface) => {
  const { itemClone, setItemClone } = useEditorDrafts(activeItem, setActiveItem, originalItems)
  const { onDragEnd } = useEditorDragAndDrop(itemClone, setItemClone, editorTools)

  if (!itemClone) return null
  return (
    <EditorDraftContext.Provider
      value={{
        originalItems,
        itemClone,
        setItemClone,
        setActiveItem
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="h-full max-h-[calc(100vh-52px)] flex flex-col">
          <EditorOutlet />
          <EditorKiosk />
        </div>
      </DragDropContext>
    </EditorDraftContext.Provider>
  )
}

export const EditorPlaceholder = ({ type }: { type: EditorItemType }) => {
  return (
    <div className="min-w-[500px] h-full flex flex-grow justify-center items-center border-brease-gray-5 border bg-brease-gray-1/70 shadow-brease-xs rounded-lg">
      <Text size="md" style="medium" className="text-brease-gray-5">
        Select a {type} to edit!
      </Text>
    </div>
  )
}
