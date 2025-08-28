/* eslint-disable no-unused-vars */
// @ts-nocheck
// until dev is on
'use client'
import { Text } from '@/components/generic/Text'
import { Avatar, AvatarFallback } from '@/components/shadcn/ui/avatar'
import { UserProfile } from '@/interface/user'
import { stringtoHexColor } from '@/lib/helpers/stringtoHexColor'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import Button from '@/components/generic/Button'
import { LoadingSpinner } from '@/components/generic/LoadingSpinner'
import { blobToFile } from '@/lib/helpers/blobToFile'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/shadcn/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { LoaderCircleIcon } from 'lucide-react'

type Point = {
  x: number
  y: number
}

interface Props {
  user: UserProfile
  form: UseFormReturn<any>
}

export const ProfileAvatarInput = ({ user, form }: Props) => {
  const fieldName = 'avatar'
  const [imgError, setImgError] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const imageRef = useRef<HTMLInputElement>(null)

  const fallbackColor = stringtoHexColor(
    user.firstName && user.lastName 
      ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
      : 'DU'
  )

  // Initialize form with null avatar to ensure proper dirty checking
  useEffect(() => {
    form.setValue(fieldName, null, { shouldValidate: true })
  }, [form, fieldName])

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        setImageSrc(reader.result as string)
        setIsModalOpen(true)
      }

      reader.readAsDataURL(file)
      event.target.value = ''
    }
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImage = async () => {
    try {
      setLoading(true)

      if (!imageSrc || !croppedAreaPixels) return

      const canvas = document.createElement('canvas')
      const image = document.createElement('img')
      image.src = imageSrc

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('No 2d context')

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Failed to create blob'))
          },
          'image/jpeg',
          0.95
        )
      })

      const croppedFile = blobToFile(
        blob,
        `${user.firstName}-${user.lastName}-Avatar`,
        'image/jpeg'
      )

      form.setValue(fieldName, croppedFile, { shouldValidate: true, shouldDirty: true })
      setImageSrc(URL.createObjectURL(blob))
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error getting cropped image:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleZoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value))
  }

  const handleCancel = () => {
    setImageSrc(null)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setIsModalOpen(false)
  }

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="w-fit">
          <FormControl className="w-fit">
            <div className="w-1/2 rounded-xl border border-brease-gray-4 shadow-brease-xs flex flex-col gap-8 p-6">
              <div className="w-fit flex flex-col">
                <Text style="semibold" size="md">
                  Profile Picture
                </Text>
                <Text style="regular" size="xs" className="text-brease-gray-7">
                  Recommended Size: 300x300
                </Text>
                <Text style="regular" size="xs" className="text-brease-gray-7">
                  Max file size: 2MB
                </Text>
              </div>
              <div className="w-full flex flex-row gap-6 items-center">
                <Avatar className="w-[120px] h-[120px]">
                  {user.avatar && !imgError && !imageSrc && (
                    <Image
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={120}
                      height={120}
                      onError={() => setImgError(true)}
                    />
                  )}
                  {imageSrc && (
                    <Image
                      src={imageSrc}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={120}
                      height={120}
                      onError={() => setImgError(true)}
                    />
                  )}
                  {(!user.avatar || imgError) && !imageSrc && (
                    <AvatarFallback
                      style={{ backgroundColor: fallbackColor }}
                      className="text-white font-golos-medium !text-d-lg"
                    >
                      {user.firstName && user.lastName 
                        ? `${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}`
                        : 'DU'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png, image/jpg, image/webp, image/jpeg"
                  ref={imageRef}
                  onChange={onFileChange}
                />
                <div className="w-full flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="Upload"
                    label="Upload Image"
                    onClick={() => imageRef.current?.click()}
                  />
                  <Text style="regular" size="xs" className="text-brease-gray-7">
                    Allowed formats : png, jpg, jpeg, webp
                  </Text>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
          {isModalOpen && imageSrc && (
            <div className="fixed inset-0 bg-brease-gray-10/20 backdrop-blur-xl z-[9999] flex justify-center items-center">
              <div className="w-[650px] p-6 bg-brease-gray-1 rounded-xl flex flex-col gap-4">
                <div className="relative aspect-square w-full">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                    disabled={zoom <= 1}
                    variant="textType"
                    icon="Minus"
                    size="sm"
                  />
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={handleZoom}
                    className="w-full accent-brease-primary"
                  />
                  <Button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                    disabled={zoom >= 3}
                    variant="textType"
                    icon="Plus"
                    size="sm"
                  />
                </div>
                <div className="space-x-3 flex justify-center items-center">
                  <Button onClick={handleCancel} variant="secondary" size="md" label="Cancel" />
                  <Button
                    onClick={getCroppedImage}
                    variant="primary"
                    size="md"
                    disabled={!croppedAreaPixels}
                  >
                    {isLoading ? (
                      <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                    ) : (
                      'Save'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </FormItem>
      )}
    />
  )
}
