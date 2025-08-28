'use client'
import { Media } from '@/interface/media'
import React, { useState } from 'react'
import { Text } from '@/components/generic/Text'
import Image from 'next/image'
import {
  CassetteTapeIcon,
  Check,
  ClapperboardIcon,
  FileTextIcon,
  FolderArchiveIcon,
  ImageIcon,
  LoaderCircle
} from 'lucide-react'
import Button from '@/components/generic/Button'
import { useStore } from 'zustand'
import { useMediaStore } from '@/lib/hooks/useMediaStore'

type MediaLibraryItemProps = {
  item: Media
  selectProps?: LibrarySelectProps
}

type LibrarySelectProps = {
  selected: boolean
  selectHandler: () => void
}

const ItemContainer = ({
  item,
  children,
  selectProps
}: {
  item: Media
  children: React.ReactNode
  selectProps?: LibrarySelectProps
}) => {
  const mediaStore = useStore(useMediaStore)
  const loading = useMediaStore((state) => state.loading)
  const previewItem = useMediaStore((state) => state.previewItem)

  const handleDelete = async () => {
    mediaStore.setLoading(true)
    if (previewItem?.uuid === item.uuid) mediaStore.setPreviewItem({} as Media)
    mediaStore.delete(item.uuid)
    mediaStore.setLoading(false)
  }

  if (!loading) {
    return (
      <div
        className={`group relative flex justify-center items-center w-[144px] h-[144px] rounded-md shadow-brease-xs overflow-hidden border !bg-black/10 border-brease-gray-2 ${selectProps && selectProps.selected && 'ring-2 ring-brease-primary border-transparent'}`}
      >
        {!selectProps && (
          <Button
            size="md"
            variant={'textType'}
            icon={'Trash'}
            onClick={handleDelete}
            className="group-hover:!opacity-100 opacity-0 absolute top-2 left-2 !p-1 rounded-md !border-none !stroke-brease-gray-1 !bg-brease-gray-10/50 hover:!bg-brease-error transition-all ease-in-out"
          />
        )}
        {!selectProps && (
          <Button
            size="md"
            variant={'textType'}
            icon={'ScanEye'}
            onClick={() => mediaStore.setPreviewItem(item)}
            className="group-hover:!opacity-100 opacity-0 absolute top-2 right-2 !p-1 rounded-md !border-none !stroke-brease-gray-1 !bg-brease-gray-10/50 hover:!bg-brease-primary transition-all ease-in-out"
          />
        )}
        {children}
        <Text
          size="xxxs"
          style="regular"
          className="group-hover:!opacity-100 opacity-0 absolute max-w-[127px] bottom-2 left-2 px-1 py-[2px] bg-brease-gray-10/50 text-brease-gray-1 rounded-md line-clamp-2 transition-all ease-in-out duration-200"
        >
          {item.name}
        </Text>
        {selectProps && (
          <div
            onClick={selectProps.selectHandler}
            className={`group-hover:!opacity-100 hover:cursor-pointer hover:!bg-brease-primary ${selectProps.selected ? 'opacity-100' : 'opacity-0'} absolute bottom-2 right-2 !p-1 ${selectProps.selected ? 'bg-brease-primary' : 'bg-brease-gray-10/50'} rounded-md transition-all ease-in-out duration-200`}
          >
            <Check className="stroke-white h-4 w-4" />
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="group overflow-hidden relative flex justify-center items-center w-full h-[144px] rounded-md shadow-brease-xs border border-brease-gray-5 !cursor-pointer">
        <div className="absolute bg-black/50 w-full h-full rounded-md" />
        {children}
        <LoaderCircle className="absolute right-2 top-2 h-10 w-10 stroke-brease-gray-1 animate-spin" />
      </div>
    )
  }
}

export const MediaLibraryItem = ({ item, selectProps }: MediaLibraryItemProps) => {
  const [thumbnailError, setThubnailError] = useState<boolean>(false)
  return (
    <ItemContainer item={item} selectProps={selectProps}>
      {item.mimeGroup === 'image' ? (
        item.thumbnail && !thumbnailError ? (
          <Image
            src={item.thumbnail}
            alt={item.alt || item.name}
            height={item.height || 70}
            width={item.width || 70}
            className="w-fit h-full object-contain"
            onError={() => setThubnailError(true)}
          />
        ) : (
          <ImageIcon className="h-[20px] w-[20px] stroke-brease-gray-1 mx-auto my-auto" />
        )
      ) : item.mimeGroup === 'video' ? (
        item.thumbnail && !thumbnailError ? (
          <Image
            src={item.thumbnail}
            alt={item.alt || item.name}
            height={item.height || 70}
            width={item.width || 70}
            className="w-fit h-full object-contain"
            onError={() => setThubnailError(true)}
          />
        ) : (
          <ClapperboardIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
        )
      ) : item.mimeGroup === 'audio' ? (
        <CassetteTapeIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
      ) : item.mimeGroup === 'document' ? (
        <FileTextIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
      ) : item.mimeGroup === 'archive' ? (
        <FolderArchiveIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
      ) : (
        <Text size="xxxs" style="regular" className="text-brease-error">
          mimeType error
        </Text>
      )}
    </ItemContainer>
  )
}
