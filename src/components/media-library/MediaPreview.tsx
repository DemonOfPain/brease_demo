'use client'
import Button from '@/components/generic/Button'
import { Form } from '@/components/shadcn/ui/form'
import { Media } from '@/interface/media'
import {
  CassetteTapeIcon,
  ClapperboardIcon,
  FileTextIcon,
  FolderArchiveIcon,
  ImageIcon,
  LoaderCircle,
  LoaderCircleIcon,
  X
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { z } from 'zod'
import { useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormInput } from '@/components/generic/form/FormInput'
import { motion } from 'framer-motion'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { toast } from '../shadcn/ui/use-toast'
import { useStore } from 'zustand'
import { useMediaStore } from '@/lib/hooks/useMediaStore'
import { appendDataToFormData } from '@/lib/helpers/appendDataToFormData'
import { ButtonPlaceholder } from '../generic/ButtonPlaceholder'

export const MediaPreview = ({ item }: { item: Media }) => {
  const mediaStore = useStore(useMediaStore)
  const lib = useMediaStore((state) => state.mediaLib)
  const loading = useMediaStore((state) => state.loading)
  const previewItem = useMediaStore((state) => state.previewItem)

  const [previewError, setPreviewError] = useState<boolean>(false)
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    setPreviewError(false)
    setIsEditing(false)
    form.setValue('name', item.name)
    form.setValue('alt', item.alt || null)
  }, [previewItem])

  const getMediaPlaceholder = () => {
    switch (item.mimeGroup) {
      case 'image':
        return <ImageIcon className="h-[100px] w-[100px] stroke-brease-gray-5 mx-auto my-auto" />
      case 'video':
        return <ClapperboardIcon className="h-[100px] w-[100px] stroke-brease-gray-5" />
      case 'audio':
        return <CassetteTapeIcon className="h-[100px] w-[100px] stroke-brease-gray-5" />
      case 'document':
        return <FileTextIcon className="h-[100px] w-[100px] stroke-brease-gray-5" />
      case 'archive':
        return <FolderArchiveIcon className="h-[100px] w-[100px] stroke-brease-gray-5" />
      default:
        return (
          <Text size="xxxs" style="regular" className="text-brease-error">
            mimeType error
          </Text>
        )
    }
  }

  const getMediaPlayer = () => {
    switch (item.mimeGroup) {
      case 'image':
        return (
          <Image
            src={item.path}
            onError={() => setPreviewError(true)}
            alt={item.alt! || item.name}
            height={item.height!}
            width={item.width!}
            className="max-w-[90%] w-fit h-fit object-contain"
          />
        )
      case 'video':
        return (
          <div className="max-w-[90%] w-full h-fit rounded-md shadow-brease-sm">
            <video
              controls
              onLoadStart={(e) => {
                if (e.target instanceof HTMLVideoElement) {
                  e.target.volume = 0.5
                }
              }}
              className="w-full h-full rounded-md"
            >
              <source src={item.path} type={item.mimeType} />
              Sorry, your browser doesn&apos;t support videos.
            </video>
          </div>
        )
      case 'audio':
        return (
          <AudioPlayer
            onError={() => setPreviewError(true)}
            className="max-w-[90%] w-full h-fit bg-brease-gray-1 rounded-md border border-brease-gray-5 shadow-brease-sm"
            volume={0.5}
            customAdditionalControls={[]}
            customProgressBarSection={[
              RHAP_UI.CURRENT_TIME,
              RHAP_UI.PROGRESS_BAR,
              RHAP_UI.CURRENT_LEFT_TIME
            ]}
            src={item.path}
          />
        )
      case 'document':
        return getMediaPlaceholder()
      case 'archive':
        return getMediaPlaceholder()
      default:
        setPreviewError(true)
        break
    }
  }

  const mediaDetailSchema = z.object({
    name: z
      .string()
      .max(30, { message: 'Media name must be less than 30 characters' })
      .regex(/^[a-zA-Z0-9-_ ]+$/, { message: 'Name cannot contain special characters' }),
    alt: z
      .string()
      .max(50, { message: 'Media alt title must be less than 50 characters' })
      .nullable()
  })

  const form = useForm<z.infer<typeof mediaDetailSchema>>({
    resolver: zodResolver(mediaDetailSchema),
    defaultValues: {
      name: item.name,
      alt: item.alt || null
    }
  })

  const { isDirty } = useFormState({ control: form.control })

  const onSubmit = async (data: z.infer<typeof mediaDetailSchema>) => {
    mediaStore.setLoading(true)
    let formData = new FormData()
    appendDataToFormData(data, formData, 'PUT')
    mediaStore.edit(formData)
    mediaStore.setLoading(false)
  }

  const handlePreviewSteps = (step: 'next' | 'prev') => {
    if (!lib || !previewItem) return
    const currentIndex = lib.findIndex((media) => media.uuid === previewItem.uuid)
    let stepIndex: number
    step === 'next'
      ? (stepIndex = currentIndex === lib.length - 1 ? 0 : currentIndex + 1)
      : (stepIndex = currentIndex === 0 ? lib.length - 1 : currentIndex - 1)
    mediaStore.setPreviewItem(lib[stepIndex])
  }

  const handleDownload = async () => {
    setDownloadLoading(true)
    try {
      const result = await mediaStore.download(item.uuid)
      if (!result.ok) {
        toast({
          variant: 'error',
          title: result.message || 'Download failed'
        })
        return
      }
      const url = window.URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = item.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      toast({
        variant: 'error',
        title: 'Internal error!'
      })
    }
    setDownloadLoading(false)
  }

  return (
    <motion.div
      initial={{ left: '-200dvw' }}
      animate={{ left: '-70dvw' }}
      exit={{ left: '-200dvw' }}
      transition={{ duration: 0.3 }}
      className={`absolute top-0 z-[9999999] flex justify-center items-center w-[calc(70dvw)] h-[100dvh]`}
    >
      <div className="relative flex flex-row w-[80%] h-[70%] justify-between bg-brease-gray-10/90 rounded-md shadow-md">
        <Button
          icon="ChevronLeft"
          size="sm"
          variant="textType"
          className="!stroke-brease-gray-1 !bg-brease-gray-10 !p-2 absolute top-[50%] -left-[2%]"
          onClick={() => handlePreviewSteps('prev')}
        />
        <Button
          icon="ChevronRight"
          size="sm"
          variant="textType"
          className="!stroke-brease-gray-1 !bg-brease-gray-10 !p-2 absolute top-[50%] -right-[2%]"
          onClick={() => handlePreviewSteps('next')}
        />
        <div className="flex justify-center items-center h-full w-[65%] border-r border-brease-gray-5 p-4">
          {!previewError ? getMediaPlayer() : getMediaPlaceholder()}
        </div>
        <div className="flex flex-col h-full w-[35%] bg-brease-gray-1 rounded-r-md border-t border-r border-b border-brease-gray-5">
          <div className="flex flex-row items-center justify-between h-fit w-full border-b border-brease-gray-5 p-4">
            <Text size="lg" style="semibold">
              Media Details
            </Text>
            <button
              onClick={() => mediaStore.setPreviewItem({} as Media)}
              className="border border-brease-gray-5 rounded-md p-1 shadow-brease-xs"
            >
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex flex-col p-4 border-b border-brease-gray-5">
              <div className="flex flex-row border-b border-brease-gray-5 pb-2 mb-2 justify-between items-start gap-2">
                <Text size="sm" style="medium">
                  Name:
                </Text>
                <Text size="sm" style="regular" className="text-right">
                  {item.name}
                </Text>
              </div>
              {item.mimeGroup === 'image' && (
                <div className="flex flex-row justify-between items-center gap-2">
                  <Text size="sm" style="medium">
                    Alt Title:
                  </Text>
                  <Text size="sm" style="regular">
                    {item.alt || '-'}
                  </Text>
                </div>
              )}
              {(item.mimeGroup === 'image' || item.mimeGroup === 'video') && (
                <div className="flex flex-row justify-between items-center gap-2">
                  <Text size="sm" style="medium">
                    Size:
                  </Text>
                  <Text size="sm" style="regular">
                    {item.width!} x {item.height!}
                  </Text>
                </div>
              )}
              {(item.mimeGroup === 'audio' || item.mimeGroup === 'video') && (
                <div className="flex flex-row justify-between items-center gap-2">
                  <Text size="sm" style="medium">
                    Duration:
                  </Text>
                  <Text size="sm" style="regular">
                    {`${Math.floor(item.duration! / 60)}:${item.duration! % 60 < 10 ? `0${item.duration! % 60}` : item.duration! % 60}`}
                  </Text>
                </div>
              )}
              <div className="flex flex-row justify-between items-center gap-2">
                <Text size="sm" style="medium">
                  File type:
                </Text>
                <Text size="sm" style="regular">
                  {item.extension}
                </Text>
              </div>
              <div className="flex flex-row justify-between items-center gap-2">
                <Text size="sm" style="medium">
                  File size:
                </Text>
                <Text size="sm" style="regular">
                  {item.size}
                </Text>
              </div>
            </div>
            {isEditing && (
              <div className="flex flex-col justify-end gap-4 h-full w-full p-4">
                <Form {...form}>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex flex-row items-center justify-between">
                      <Text size="lg" style="semibold">
                        Edit
                      </Text>
                      {loading ? (
                        <ButtonPlaceholder variant="primary" size="sm">
                          <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                        </ButtonPlaceholder>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          icon="Save"
                          disabled={!isDirty}
                          className="mr-[2px]"
                          onClick={() => onSubmit(form.getValues())}
                        />
                      )}
                    </div>
                    <FormInput
                      form={form}
                      fieldName="name"
                      placeholder="Name"
                      type="input"
                      required
                    />
                    {item.mimeGroup === 'image' && (
                      <FormInput
                        form={form}
                        fieldName="alt"
                        placeholder="Alt Title"
                        type="input"
                        required={false}
                      />
                    )}
                  </div>
                </Form>
              </div>
            )}
            <div className="flex flex-row justify-between gap-4 h-fit w-full p-4 border-t border-brease-gray-5">
              {downloadLoading ? (
                <ButtonPlaceholder variant="secondary" size="sm" className="w-full justify-center">
                  <LoaderCircle className="h-4 w-4 stroke-brease-primary animate-spin" />
                </ButtonPlaceholder>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  label="Download"
                  icon="Download"
                  className="w-full justify-center"
                  onClick={handleDownload}
                />
              )}
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                label={isEditing ? 'Cancel' : 'Edit'}
                icon={isEditing ? 'X' : 'FilePen'}
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
