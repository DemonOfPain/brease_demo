'use client'
import { DragDropContext } from '@hello-pangea/dnd'
import { BuilderKiosk } from './BuilderKiosk'
import { BuilderOutlet } from './BuilderOutlet'
import { useContext, useState, createContext } from 'react'
import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import { useBuilderDragAndDrop } from '@/lib/hooks/useBuilderDragAndDrop'
import { BuilderContentEditor } from './BuilderContentEditor'

export const ReloadContext = createContext<{
  isContentReloading: boolean
  // eslint-disable-next-line no-unused-vars
  setIsContentReloading: (loading: boolean) => void
}>({
  isContentReloading: false,
  setIsContentReloading: () => {}
})

export const BuilderMain = () => {
  const { pageContentClone, setPageContentClone } = useContext(BuilderDraftContext)
  const [recentlyMovedItem, setRecentlyMovedItem] = useState<string | null>(null)
  const [isContentReloading, setIsContentReloading] = useState(false)

  const handleItemMoved = (draggableId: string) => {
    const sectionUuid = draggableId.split('-').slice(0, -1).join('-')
    setRecentlyMovedItem(sectionUuid)
    setIsContentReloading(true)
    setTimeout(() => setRecentlyMovedItem(null), 3000)
  }

  const { onDragEnd } = useBuilderDragAndDrop(
    pageContentClone,
    setPageContentClone,
    handleItemMoved
  )

  return (
    <ReloadContext.Provider value={{ isContentReloading, setIsContentReloading }}>
      <BuilderContentEditor />
      <DragDropContext onDragEnd={onDragEnd}>
        <BuilderKiosk recentlyMovedItem={recentlyMovedItem} />
      </DragDropContext>
      <BuilderOutlet />
    </ReloadContext.Provider>
  )
}
