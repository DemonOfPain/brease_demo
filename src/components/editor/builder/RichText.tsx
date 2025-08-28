'use client'
import React, { useState, useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Heading,
  Subscript,
  Superscript,
  Link,
  List,
  Indent,
  Alignment,
  Image,
  ImageToolbar,
  ImageStyle,
  FontColor,
  ButtonView,
  MediaEmbed
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import { Media, MediaStore } from '@/interface/media'
import { MediaLibraryItem } from '@/components/media-library/MediaLibraryItem'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription
} from '@/components/shadcn/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaSchema } from '@/components/media-library/MediaLibrary'
import { z } from 'zod'
import { Text } from '@/components/generic/Text'
import { X, FolderSearch } from 'lucide-react'
import { UploadEntry, UploadEntryType } from '@/components/media-library/UploadEntry'
import { AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

interface RichTextProps {
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void
}

interface SimpleMediaDialogProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onSelect: (media: Media) => void
  mediaStore: MediaStore
}

const SimpleMediaDialog = ({ isOpen, onClose, onSelect, mediaStore }: SimpleMediaDialogProps) => {
  const [media, setMedia] = useState<Media[]>([])
  const [uploadFiles, setUploadFiles] = useState<null | UploadEntryType[]>(null)
  const [filesToSubmit, setFilesToSubmit] = useState<FileList | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<z.infer<typeof mediaSchema>>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      files: null
    }
  })

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
      mediaStore.getLibrary().then(() => {
        if (mediaStore.mediaLib) {
          setMedia(mediaStore.mediaLib)
        }
        setIsLoading(false)
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (filesToSubmit && filesToSubmit.length > 0) {
      form.handleSubmit(onSubmit)()
      setFilesToSubmit(null)
    }
  }, [filesToSubmit])

  const onSubmit = async (data: z.infer<typeof mediaSchema>) => {
    const files: File[] = Array.from(data.files || [])
    const uploadEntries: UploadEntryType[] = files.map((file) => ({
      file,
      loading: true,
      error: false
    }))
    setUploadFiles(uploadEntries)
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])

      try {
        const response = await mediaStore.upload(formData)
        if (response.ok) {
          uploadEntries[i].loading = false
          uploadEntries[i].error = false
          if (response.data.medium) {
            setMedia((prev) => [...prev, response.data.medium])
          }
        } else {
          uploadEntries[i].loading = false
          uploadEntries[i].error = true
        }
      } catch (error) {
        uploadEntries[i].loading = false
        uploadEntries[i].error = true
      }
      setUploadFiles([...uploadEntries])
    }
    await mediaStore.getLibrary()
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden>
        <DialogTitle>Brease Media Input Dialog</DialogTitle>
        <DialogDescription>Brease Media Input Dialog</DialogDescription>
      </VisuallyHidden>
      <DialogContent className="w-[75%] h-[calc(90%-57px)] mt-[28.5px] !rounded-none !rounded-b-[10px] !p-0 !gap-0 flex flex-col">
        <div className="flex flex-row items-center justify-between p-4 border-b border-brease-gray-5">
          <Text size="xl" style="medium">
            Media Library
          </Text>
          <DialogClose className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
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
                      <div className="group flex flex-col px-2 py-3 gap-2 w-full h-[100px] rounded-lg border border-dashed border-brease-gray-5 bg-white">
                        <input
                          className="sr-only"
                          type="file"
                          id="files"
                          multiple
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
                          className="cursor-pointer h-full w-full flex flex-col justify-center items-center gap-2"
                        >
                          <span className="flex flex-row items-center gap-1">
                            Upload your files or
                            <span className="font-medium py-1 px-2 bg-brease-secondary-light-purple text-brease-secondary-purple rounded-md">
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
          {isLoading ? (
            <div className="flex flex-row flex-wrap gap-2 w-full h-fit">
              {[...Array(8)].map((_, index) => (
                <Skeleton key={index} className="w-[144px] h-[144px]" />
              ))}
            </div>
          ) : media.length > 0 ? (
            <div className="flex flex-row flex-wrap gap-2 w-full h-fit">
              {media.map((item) => (
                <div key={item.uuid}>
                  <MediaLibraryItem
                    item={item}
                    selectProps={{
                      selected: false,
                      selectHandler: () => onSelect(item)
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
              <FolderSearch className="stroke-brease-gray-4 h-10 w-10" />
              <Text size="md" style="medium" className="text-brease-gray-5">
                No media available
              </Text>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const RichText = ({ value, onChange }: RichTextProps) => {
  const editorRef = React.useRef<any>(null)
  const mediaStore = useMediaStore()
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = React.useState(false)

  function MediaLibraryPlugin(editor: any) {
    editor.ui.componentFactory.add('mediaLibrary', (locale: any) => {
      const buttonView = new ButtonView(locale)
      buttonView.set({
        label: 'Insert from Media Library',
        icon: `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
          <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" d="M13.6136 15.3473L17.8651 10.9766L21 13.9844M6.96484 19L11.9688 13.9766L17.9727 19M9.96875 9.97656C9.96875 11.0811 9.07332 11.9766 7.96875 11.9766C6.86418 11.9766 5.96875 11.0811 5.96875 9.97656C5.96875 8.87199 6.86418 7.97656 7.96875 7.97656C9.07332 7.97656 9.96875 8.87199 9.96875 9.97656ZM12.0627 6.06274L11.9373 5.93726C11.5914 5.59135 11.4184 5.4184 11.2166 5.29472C11.0376 5.18506 10.8425 5.10425 10.6385 5.05526C10.4083 5 10.1637 5 9.67452 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H14.3255C13.8363 7 13.5917 7 13.3615 6.94474C13.1575 6.89575 12.9624 6.81494 12.7834 6.70528C12.5816 6.5816 12.4086 6.40865 12.0627 6.06274Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`,
        tooltip: true
      })
      buttonView.on('execute', () => {
        setIsMediaLibraryOpen(true)
      })
      return buttonView
    })
  }

  const handleMediaSelect = (selectedMedia: Media) => {
    if (!editorRef.current) return
    let htmlContent = ''
    switch (selectedMedia.mimeGroup) {
      case 'image':
        htmlContent = `<img src="${selectedMedia.path}" alt="${selectedMedia.alt || selectedMedia.name}">`
        break
      case 'video':
        htmlContent = `
          <video controls>
            <source src="${selectedMedia.path}" type="${selectedMedia.mimeType}">
            Your browser does not support the video tag.
          </video>`
        break
      default:
        htmlContent = `<a href="${selectedMedia.path}" target="_blank">${selectedMedia.name}</a>`
        break
    }

    const viewFragment = editorRef.current.data.processor.toView(htmlContent)
    const modelFragment = editorRef.current.data.toModel(viewFragment)
    editorRef.current.model.insertContent(modelFragment)
    setIsMediaLibraryOpen(false)
  }

  const availableItems = [
    'undo',
    'redo',
    '|',
    'alignment',
    '|',
    'mediaLibrary',
    'mediaEmbed',
    '|',
    'heading',
    '|',
    'bold',
    'italic',
    'subscript',
    'superscript',
    '|',
    'fontColor',
    '|',
    'link',
    'numberedList',
    'bulletedList',
    '|',
    'outdent',
    'indent'
  ]

  React.useEffect(() => {
    if (editorRef.current) {
      const editorData = editorRef.current.getData()
      if (editorData !== value) {
        editorRef.current.setData(value || '')
      }
    }
  }, [value])

  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        config={{
          toolbar: {
            items: availableItems
          },
          plugins: [
            Bold,
            Essentials,
            Italic,
            Mention,
            Paragraph,
            Undo,
            Heading,
            Subscript,
            Superscript,
            Link,
            List,
            Indent,
            Image,
            ImageToolbar,
            ImageStyle,
            Alignment,
            FontColor,
            MediaEmbed
          ],
          extraPlugins: [MediaLibraryPlugin],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          },
          image: {
            upload: {
              types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
            },
            toolbar: [
              'imageStyle:inline',
              'imageStyle:block',
              'imageStyle:side',
              '|',
              'imageTextAlternative'
            ],
            insert: {
              type: 'auto'
            }
          },
          licenseKey: '<YOUR_LICENSE_KEY>',
          initialData: value || ''
        }}
        onReady={(editor) => {
          editorRef.current = editor
        }}
        onChange={(event, editor) => {
          const data = editor.getData()
          onChange?.(data)
        }}
      />
      {isMediaLibraryOpen && (
        <SimpleMediaDialog
          isOpen={isMediaLibraryOpen}
          onClose={() => setIsMediaLibraryOpen(false)}
          onSelect={handleMediaSelect}
          mediaStore={mediaStore}
        />
      )}
    </>
  )
}
