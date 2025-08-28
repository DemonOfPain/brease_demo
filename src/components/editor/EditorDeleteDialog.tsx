import React from 'react'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/shadcn/ui/alert-dialog'
import { EditorItem } from '@/interface/editor'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { LoaderCircleIcon, Plus } from 'lucide-react'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'
import { useStore } from 'zustand'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export const EditorDeleteDialog = ({ editorData }: { editorData: EditorItem }) => {
  const editorStore = useStore(useEditorStore)
  const loading = useEditorStore((state) => state.loading)
  const itemType = useEditorStore((state) => state.editorType)

  const onDelete = async () => {
    editorStore.setLoading(true)
    editorStore.delete()
    editorStore.setLoading(false)
  }
  return (
    <AlertDialogContent>
      <VisuallyHidden>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogDescription></AlertDialogDescription>
      </VisuallyHidden>
      <AlertDialogCancel className="group cursor-pointer absolute -right-2 -top-2 ring-0 !bg-white p-1 rounded-full border-2 border-brease-gray-5 transition-colors !ease-in-out !duration-200">
        <Plus className="w-3 h-3 stroke-black rotate-45 group-hover:stroke-brease-gray-8" />
      </AlertDialogCancel>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {editorData
            ? `Delete ${itemType === 'sections' ? 'Section' : 'Collection'}`
            : `Delete${itemType === 'sections' ? 'Section' : 'Collection'}`}
        </AlertDialogTitle>
        <AlertDialogDescription className="!text-brease-gray-9 !-mb-2 flex flex-row gap-1">
          {`Are you sure you want to delete`}
          <b>{editorData.name}</b>
          {`?`}
        </AlertDialogDescription>
        <AlertDialogDescription className="!text-brease-gray-9">
          {`This ${itemType} might be in use on your site. This action could result in serious site breaking changes!`}
        </AlertDialogDescription>
        <AlertDialogDescription className="!text-brease-error">
          {`This action is not reverisble!`}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        {loading ? (
          <ButtonPlaceholder variant="primary" size="md">
            <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
          </ButtonPlaceholder>
        ) : (
          <AlertDialogAction
            onClick={onDelete}
            className="w-full justify-center !bg-brease-error !ring-brease-error  hover:!bg-brease-error-light hover:!text-brease-error"
          >
            Delete
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
