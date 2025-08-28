import { PageContentMatrixSlot } from '@/interface/builder'
import {
  CassetteTapeIcon,
  ClapperboardIcon,
  FileTextIcon,
  FolderArchiveIcon,
  FolderSearch,
  GripVertical,
  ImageIcon,
  X
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { MediaLibraryItem } from '../../media-library/MediaLibraryItem'
import { Media } from '@/interface/media'
import { Text } from '@/components/generic/Text'
import Button from '../../generic/Button'
import { UploadEntry, UploadEntryType } from '@/components/media-library/UploadEntry'
import { AnimatePresence } from 'framer-motion'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaSchema, onSubmitMediaUpload } from '@/components/media-library/MediaLibrary'
import { z } from 'zod'
import { MEDIA_LIB_ALLOWED_MIME_TYPES } from '@/components/media-library/MEDIA_LIB_ALLOWED_MIME_TYPES'
import { useStore } from 'zustand'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/shadcn/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useMediaInputDragAndDrop } from '@/lib/hooks/useMediaInputDragAndDrop'

interface BreaseMediaInputProps {
  element: PageContentMatrixSlot
  className?: string
  value?: string[] | null
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void
}

export const BreaseMediaInput = ({
  element,
  className,
  value,
  onChange
}: BreaseMediaInputProps) => {
  const lib = useMediaStore((state) => state.mediaLib)
  const [showMediaLib, setShowMediaLib] = useState<boolean>(false)
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set())
  const { onDragEnd } = useMediaInputDragAndDrop(selectedMedia, onChange)

  // Init selected media from value prop and validate
  useEffect(() => {
    if (!value || !lib) {
      setSelectedMedia(new Set())
      return
    }
    const existInLib = value.filter((uuid) => lib.some((media) => media.uuid === uuid))
    const validMediaUuids = existInLib.filter((uuid) =>
      availableMedia!.some((media) => media.uuid === uuid)
    )
    if (value.length !== existInLib.length) {
      console.warn(
        'Media items not found in library:',
        value.filter((v) => !existInLib.includes(v))
      )
    }
    if (existInLib.length !== validMediaUuids.length) {
      console.warn(
        'Media items of wrong type:',
        existInLib.filter((v) => !validMediaUuids.includes(v))
      )
    }
    setSelectedMedia(new Set(validMediaUuids))
    if (validMediaUuids.length !== value.length) onChange(validMediaUuids)
  }, [value, lib])

  const availableMedia = element
    ? lib!.filter((m) => m.mimeGroup === element.element.data.type)
    : lib

  return (
    <div className={`flex flex-col gap-2 !max-h-[400px] ${className}`}>
      <div className="w-full flex flex-row gap-2 items-center justify-end pr-[2px]">
        <Button
          size="sm"
          variant="primary"
          icon="Upload"
          label={
            element.element.data.multiple ? 'Select multiple from library' : 'Select from library'
          }
          onClick={() => setShowMediaLib(true)}
        />
      </div>
      <BreaseMediaInputDialog
        open={showMediaLib}
        onOpenChange={(isOpen: boolean) => setShowMediaLib(isOpen)}
        onChange={onChange}
        element={element}
        availableMedia={availableMedia!}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={element.uuid}>
          {(provided) => (
            <div
              className="w-full h-fit  rounded-md shadow-brease-xs border border-brease-gray-5"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className="w-full h-full flex flex-col gap-2 p-2">
                {selectedMedia.size > 0 ? (
                  Array.from(selectedMedia).map((uuid, idx) => {
                    const media = availableMedia!.find((m) => m.uuid === uuid)
                    if (!media) return null
                    return (
                      <SelectedMediaItem
                        key={uuid}
                        index={idx}
                        media={media}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                        onChange={onChange}
                      />
                    )
                  })
                ) : (
                  <div className="flex flex-col gap-2 justify-center items-center w-full py-2 h-[144px]">
                    <FolderSearch className="stroke-brease-gray-4 h-10 w-10" />
                    <Text size="md" style="medium" className="text-brease-gray-5">
                      No items selected!
                    </Text>
                  </div>
                )}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

const SelectedMediaItem = ({
  index,
  media,
  selectedMedia,
  setSelectedMedia,
  onChange
}: {
  index: number
  media: Media
  selectedMedia: Set<string>
  setSelectedMedia: React.Dispatch<React.SetStateAction<Set<string>>>
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void
}) => {
  const [thumbnailError, setThubnailError] = useState<boolean>(false)
  const handleRemove = () => {
    const newSelected = new Set(selectedMedia)
    newSelected.delete(media.uuid)
    setSelectedMedia(newSelected)
    onChange(Array.from(newSelected))
  }

  return (
    <Draggable draggableId={media.uuid} index={index} key={media.uuid}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`w-full p-2 rounded-md flex flex-row items-center justify-between ${
            snapshot.isDragging
              ? 'bg-brease-gray-1 border-dashed border !border-brease-primary shadow-brease-lg'
              : ''
          }`}
        >
          <div className="w-fit flex flex-row gap-4 items-center">
            <div>
              <GripVertical />
            </div>
            <div className="relative flex justify-center items-center w-[70px] h-[70px] rounded-md shadow-brease-xs border !bg-black/10 border-brease-gray-2">
              {media.mimeGroup === 'image' ? (
                media.thumbnail && !thumbnailError ? (
                  <Image
                    src={media.thumbnail}
                    alt={media.alt || media.name}
                    height={media.height || 70}
                    width={media.width || 70}
                    className="w-fit h-full object-contain"
                    onError={() => setThubnailError(true)}
                  />
                ) : (
                  <ImageIcon className="h-[20px] w-[20px] stroke-brease-gray-1 mx-auto my-auto" />
                )
              ) : media.mimeGroup === 'video' ? (
                media.thumbnail && !thumbnailError ? (
                  <Image
                    src={media.thumbnail}
                    alt={media.alt || media.name}
                    height={media.height || 70}
                    width={media.width || 70}
                    className="w-fit h-full object-contain"
                    onError={() => setThubnailError(true)}
                  />
                ) : (
                  <ClapperboardIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
                )
              ) : media.mimeGroup === 'audio' ? (
                <CassetteTapeIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
              ) : media.mimeGroup === 'document' ? (
                <FileTextIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
              ) : media.mimeGroup === 'archive' ? (
                <FolderArchiveIcon className="h-[40px] w-[40px] stroke-brease-gray-1" />
              ) : (
                <Text size="xxxs" style="regular" className="text-brease-error">
                  mimeType error
                </Text>
              )}
            </div>
            <Text style="medium" size="sm">
              {media.name}.{media.extension}
            </Text>
          </div>
          <Button
            size="md"
            icon="Trash"
            variant="textType"
            className="!text-brease-error !bg-brease-error-light hover:!bg-brease-error !stroke-brease-error hover:!stroke-white !px-3"
            onClick={handleRemove}
          />
        </div>
      )}
    </Draggable>
  )
}

const BreaseMediaInputDialog = ({
  open,
  onOpenChange,
  onChange,
  element,
  availableMedia,
  selectedMedia,
  setSelectedMedia
}: {
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (isOpen: boolean) => void
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void
  element: PageContentMatrixSlot
  availableMedia: Media[]
  selectedMedia: Set<string>
  setSelectedMedia: React.Dispatch<React.SetStateAction<Set<string>>>
}) => {
  const mediaStore = useStore(useMediaStore)
  const [uploadFiles, setUploadFiles] = useState<null | UploadEntryType[]>(null)
  const [filesToSubmit, setFilesToSubmit] = useState<FileList | null>(null)
  const form = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      files: null
    }
  })

  useEffect(() => {
    if (filesToSubmit && filesToSubmit.length > 0) {
      form.handleSubmit(onSubmit)()
      setFilesToSubmit(null)
    }
  }, [filesToSubmit])

  const handleMediaClick = (media: Media) => {
    const newSelected = new Set(selectedMedia)
    if (element.element.data.multiple) {
      if (newSelected.has(media.uuid)) {
        newSelected.delete(media.uuid)
      } else {
        newSelected.add(media.uuid)
      }
    } else {
      newSelected.clear()
      newSelected.add(media.uuid)
    }
    setSelectedMedia(newSelected)
    onChange(Array.from(newSelected))
  }

  const formInputAccept = () => {
    switch (element.element.data.type) {
      case 'image':
        return MEDIA_LIB_ALLOWED_MIME_TYPES.filter((mime) => mime.startsWith('image/')).join(',')
      case 'video':
        return MEDIA_LIB_ALLOWED_MIME_TYPES.filter((mime) => mime.startsWith('video/')).join(',')
      case 'audio':
        return MEDIA_LIB_ALLOWED_MIME_TYPES.filter((mime) => mime.startsWith('audio/')).join(',')
      case 'document':
        return MEDIA_LIB_ALLOWED_MIME_TYPES.filter(
          (mime) => mime.startsWith('application/') || mime.startsWith('text/')
        )
          .filter(
            (mime) =>
              !mime.includes('zip') &&
              !mime.includes('rar') &&
              !mime.includes('tar') &&
              !mime.includes('gzip') &&
              !mime.includes('7z')
          )
          .join(',')
      case 'archive':
        return MEDIA_LIB_ALLOWED_MIME_TYPES.filter(
          (mime) =>
            mime.includes('zip') ||
            mime.includes('rar') ||
            mime.includes('tar') ||
            mime.includes('gzip') ||
            mime.includes('7z')
        ).join(',')
      default:
        return MEDIA_LIB_ALLOWED_MIME_TYPES.join(',')
    }
  }

  const onSubmit = (data: z.infer<typeof mediaSchema>) => {
    onSubmitMediaUpload({
      data,
      setUploadFiles,
      mediaStore,
      form,
      onUploadComplete: (uploadedMedia) => {
        if (uploadedMedia.length > 0) {
          const newSelected = new Set(selectedMedia)
          if (!element.element.data.multiple) {
            newSelected.clear()
          }
          uploadedMedia.forEach((media) => newSelected.add(media.uuid))
          setSelectedMedia(newSelected)
          onChange(Array.from(newSelected))
        }
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[75%] h-[calc(90%-57px)] mt-[28.5px] !rounded-none !rounded-b-[10px] !p-0 !gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Brease Media Input Dialog</DialogTitle>
          <DialogDescription>Brease Media Input Dialog</DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-row items-center justify-between p-4 border-b border-brease-gray-5">
          <Text size="xl" style="medium">
            Media library
          </Text>
          <div className="w-fit flex gap-4">
            <DialogClose className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </div>
        <div className="relative w-full h-fit p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="files"
                render={({ field: { onChange: fieldOnChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={`group flex flex-col px-2 py-3 gap-2 w-full h-[100px] rounded-lg border border-dashed border-brease-gray-5 bg-white text-t-xs font-golos-regular shadow-brease-xs placeholder:text-brease-gray-5 focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-brease-gray-5 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-brease-error aria-invalid:text-brease-error aria-invalid:focus-visible:ring-brease-error aria-invalid:focus-visible:ring-[1px] has-[:disabled]:opacity-50 has-[:disabled]:!cursor-not-allowed`}
                      >
                        <input
                          className="sr-only peer"
                          type="file"
                          id="files"
                          accept={formInputAccept()}
                          multiple={element.element.data.multiple}
                          onChange={(e) => {
                            fieldOnChange(e.target.files)
                            if (e.target.files && e.target.files.length > 0) {
                              setFilesToSubmit(e.target.files)
                            }
                          }}
                          {...fieldProps}
                        />
                        <label
                          htmlFor="files"
                          className="group cursor-pointer h-full w-full flex flex-col justify-center items-center gap-2 peer-disabled:!cursor-not-allowed"
                        >
                          <span className="flex flex-row items-center gap-1 group-aria-invalid:text-brease-error w-fit">
                            Drag & Drop your file here or
                            <span className="font-golos-medium py-1 px-2 bg-brease-secondary-light-purple text-brease-secondary-purple rounded-md group-aria-invalid:text-brease-error group-aria-invalid:bg-brease-error-light">
                              choose file
                            </span>
                          </span>
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        {uploadFiles && (
          <div className="w-fil h-fit flex flex-col gap-2 px-4 pb-4">
            <AnimatePresence>
              {uploadFiles.map((entry: UploadEntryType, idx: number) => (
                <UploadEntry key={idx} entry={entry} />
              ))}
            </AnimatePresence>
          </div>
        )}
        <div className="h-[calc(100%-57px-156px)] flex flex-col gap-4 p-4 overflow-y-scroll">
          {availableMedia.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-2 w-full h-fit">
              {availableMedia.map((media) => (
                <MediaLibraryItem
                  key={media.uuid}
                  item={media}
                  selectProps={{
                    selected: selectedMedia.has(media.uuid),
                    selectHandler: () => handleMediaClick(media)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
              <FolderSearch className="stroke-brease-gray-4 h-10 w-10" />
              <Text size="md" style="medium" className="text-brease-gray-5">
                No available media to select from!
              </Text>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
