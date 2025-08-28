import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from '@/components/shadcn/ui/drawer'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import React, { useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { FolderSearch, X } from 'lucide-react'
import { useStore } from 'zustand'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import { toast } from '@/components/shadcn/ui/use-toast'
import { AnimatePresence } from 'framer-motion'
import { MEDIA_LIB_ALLOWED_MIME_TYPES } from './MEDIA_LIB_ALLOWED_MIME_TYPES'
import { UploadEntry, UploadEntryType } from './UploadEntry'
import { Media, MediaStore } from '@/interface/media'
import { MediaLibraryItem } from './MediaLibraryItem'
import { MediaLibraryLoadingSkeleton } from './MediaLibraryLoadingSkeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import { MediaPreview } from './MediaPreview'

export const MAX_FILE_SIZE = 64000000 //64MB

export const mediaSchema = z.object({
  files: z.union([
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine(
            (fileList) => Array.from(fileList).every((file) => file.size <= MAX_FILE_SIZE),
            `Max file size is 64MB!`
          )
          .refine(
            (fileList) =>
              Array.from(fileList).every((file) =>
                MEDIA_LIB_ALLOWED_MIME_TYPES.includes(file.type)
              ),
            `Not allowed file format!`
          ),
    z.null()
  ])
})

export const onSubmitMediaUpload = async ({
  data,
  setUploadFiles,
  mediaStore,
  form,
  onUploadComplete
}: {
  data: z.infer<typeof mediaSchema>
  setUploadFiles: React.Dispatch<React.SetStateAction<UploadEntryType[] | null>>
  mediaStore: MediaStore
  form: UseFormReturn<
    {
      files?: any
    },
    any,
    any
  >
  // eslint-disable-next-line no-unused-vars
  onUploadComplete?: (uploadedMedia: Media[]) => void
}) => {
  const uploads = Array.from(data.files as FileList).map((file: File) => {
    return {
      file: file,
      loading: true,
      error: false
    }
  })
  setUploadFiles(uploads)
  const successfulUploads: Media[] = []
  try {
    await Promise.all(
      uploads.map(async (upload: UploadEntryType, index: number) => {
        let formData = new FormData()
        formData.append('file', upload.file, upload.file.name)
        const result = await mediaStore.upload(formData)
        if (!result.ok) {
          toast({
            variant: 'error',
            title: `Couldn't upload file: '${upload.file.name}'`
          })
          console.error(result)
          setUploadFiles((prev) =>
            prev!.map((item, i) => (i === index ? { ...item, error: true, loading: false } : item))
          )
        } else {
          setUploadFiles((prev) =>
            prev!.map((item, i) => (i === index ? { ...item, loading: false } : item))
          )
          if (result.data) {
            successfulUploads.push(result.data.medium)
          }
        }
      })
    )
    if (onUploadComplete && successfulUploads.length > 0) {
      onUploadComplete(successfulUploads)
    }
  } catch (error) {
    console.error(error)
    toast({
      variant: 'error',
      title: 'Internal error!'
    })
  }
  // Start clearing uploads only after all are complete
  const interval = setInterval(() => {
    setUploadFiles((prev) => {
      if (!prev || prev.length === 0) {
        // Reset form after all uploads are complete
        form.reset()
        clearInterval(interval)
        return null
      }
      return prev.slice(0, -1)
    })
  }, 800)
}

export const MediaLibrary = ({ open = false }: { open?: boolean }) => {
  const mediaStore = useStore(useMediaStore)
  const mediaLib = useMediaStore((state) => state.mediaLib)
  const previewItem = useMediaStore((state) => state.previewItem)
  const [uploadFiles, setUploadFiles] = useState<null | UploadEntryType[]>(null)
  const [filterGroup, setFilterGroup] = useState<string>('all')

  useEffect(() => {
    if (open && !mediaLib) mediaStore.getLibrary()
    mediaStore.setPreviewItem({} as Media), setFilterGroup('all')
  }, [open])

  useEffect(() => {
    if (previewItem && filterGroup != 'all' && filterGroup != previewItem.mimeGroup)
      mediaStore.setPreviewItem({} as Media)
  }, [filterGroup])

  const form = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      files: null
    }
  })

  const onSubmit = (data: z.infer<typeof mediaSchema>) => {
    onSubmitMediaUpload({
      data,
      setUploadFiles,
      mediaStore,
      form
    })
  }

  return (
    <DrawerContent className="right-0 bottom-0 rounded-l-[10px] ml-24">
      <VisuallyHidden.Root>
        <DrawerHeader>
          <DrawerTitle>Media Library</DrawerTitle>
          <DrawerDescription>Manage site media</DrawerDescription>
        </DrawerHeader>
      </VisuallyHidden.Root>
      <div className="relative w-[30dvw] h-full flex flex-col">
        <AnimatePresence>
          {open && mediaLib && previewItem.uuid && <MediaPreview item={previewItem} />}
        </AnimatePresence>
        <div className="w-full flex flex-row items-center p-6 gap-4 border-b border-brease-gray-5">
          <DrawerClose className="border border-brease-gray-5 rounded-md p-1 shadow-brease-xs">
            <X className="w-[18px] h-[18px]" />
          </DrawerClose>
          <Text style="semibold" size="lg">
            Media Library
          </Text>
        </div>
        <div className="w-full h-full max-h-[calc(100vh-77px)] flex flex-col p-6 gap-6 overflow-y-scroll no-scrollbar">
          <div className="relative w-full h-fit">
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
                            accept={MEDIA_LIB_ALLOWED_MIME_TYPES.join(', ')}
                            multiple
                            onChange={(e) => {
                              fieldOnChange(e.target.files)
                              if (e.target.files && e.target.files.length > 0) {
                                form.handleSubmit(onSubmit)()
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
            <div className="w-fil h-fit flex flex-col gap-2">
              <AnimatePresence>
                {uploadFiles.map((entry: UploadEntryType, idx: number) => (
                  <UploadEntry key={idx} entry={entry} />
                ))}
              </AnimatePresence>
            </div>
          )}
          {mediaLib ? (
            <div className="w-full h-fit flex flex-col gap-3">
              <div className="w-full h-fit flex flex-row justify-between items-center pb-1 border-b border-brease-gray-5">
                <Text size="sm" style="medium">
                  Library
                </Text>
                <Select onValueChange={(value) => setFilterGroup(value)}>
                  <SelectTrigger className="w-[147px] !h-fit py-0 border-none shadow-none">
                    <SelectValue placeholder="Filter media" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all" value="all">
                      All
                    </SelectItem>
                    <SelectItem key="image" value="image">
                      Images
                    </SelectItem>
                    <SelectItem key="video" value="video">
                      Videos
                    </SelectItem>
                    <SelectItem key="audio" value="audio">
                      Audios
                    </SelectItem>
                    <SelectItem key="document" value="document">
                      Documents
                    </SelectItem>
                    <SelectItem key="archive" value="archive">
                      Archives
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {mediaLib.filter((media: Media) => {
                return filterGroup === 'all' ? media : filterGroup === media.mimeGroup
              }).length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(144px,1fr))] gap-2 w-full h-full max-h-[calc(100vh-314px)] overflow-y-scroll no-scrollbar">
                  {mediaLib
                    .filter((media: Media) => {
                      return filterGroup === 'all' ? media : filterGroup === media.mimeGroup
                    })
                    .map((media: Media) => (
                      <div key={media.uuid} className="w-full flex items-start justify-center">
                        <MediaLibraryItem item={media} />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2 justify-center items-center w-full h-[calc(100vh-314px)]">
                  <FolderSearch className="stroke-brease-gray-4 h-10 w-10" />
                  <Text size="md" style="semibold" className="text-brease-gray-5">
                    No media found!
                  </Text>
                </div>
              )}
            </div>
          ) : (
            <MediaLibraryLoadingSkeleton />
          )}
        </div>
      </div>
    </DrawerContent>
  )
}
