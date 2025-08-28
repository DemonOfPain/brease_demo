// @ts-nocheck
// until dev is on
import { SitePage } from '@/interface/site'
import React, { useState, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormFileInput } from '@/components/generic/form/FormFileInput'
import OGImageTop from '@/images/og-top.svg'
import OGImageBottom from '@/images/og-bottom.svg'
import Placeholder from '@/images/brease-icon-black.svg'
import Image from 'next/image'
import { Text } from '@/components/generic/Text'
import Button from '@/components/generic/Button'
import { useSiteStore } from '@/lib/hooks/useSiteStore'

export const OGImageInput = ({
  page,
  form
}: {
  page?: SitePage | any
  form: UseFormReturn<any>
}) => {
  const site = useSiteStore((state) => state.site)
  const [imgError, setImgError] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const formValues = form.watch()

  useEffect(() => {
    setImgError(false)
    if (formValues.openGraphImage) {
      const file =
        formValues.openGraphImage instanceof FileList
          ? formValues.openGraphImage[0]
          : formValues.openGraphImage

      if (file && (file instanceof File || file instanceof Blob)) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target?.result as string
          setImageSrc(imageData)
        }
        reader.onerror = () => {
          setImgError(true)
        }
        reader.readAsDataURL(file)
      } else {
        setImageSrc(null)
      }
    } else {
      setImageSrc(null)
    }
  }, [formValues.openGraphImage])

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Removing image')
    form.setValue('openGraphImage', null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
    setImageSrc(null)
    setImgError(false)
  }

  const renderImage = () => {
    if (formValues.openGraphImage && imageSrc) {
      return (
        <Image
          src={imageSrc}
          alt={`${page?.name || 'New Page'} - Open Graph Image`}
          width={400}
          height={300}
          className="w-full max-h-[300px] object-cover"
          onError={() => {
            console.error('Error loading new image')
            setImgError(true)
          }}
        />
      )
    }
    if (page?.openGraphImage && !imgError && formValues.openGraphImage !== null) {
      return (
        <Image
          src={page.openGraphImage}
          alt={`${page?.name || 'Page'} - Open Graph Image`}
          width={400}
          height={300}
          className="w-full max-h-[300px] object-cover"
          onError={() => {
            console.error('Error loading existing image')
            setImgError(true)
          }}
        />
      )
    }
    return (
      <div className="overflow-hidden flex items-center justify-center bg-brease-gray-4 h-[300px]">
        <Image
          src={Placeholder}
          alt={`${page?.name || 'New Page'} - Open Graph Image`}
          className="scale-150"
          width={48}
          height={60}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-row justify-between w-full h-fit border border-brease-gray-4 rounded-2xl p-4 shadow-brease-xs">
      <div className="flex flex-col gap-4 w-full max-w-[35%]">
        <div className="flex flex-col">
          <Text style="semibold" size="sm" className="text-brease-gray-9">
            Open Graph Image
          </Text>
          <Text style="regular" size="xs" className="text-brease-gray-8">
            Images should be the exact same size as the guide says. Adding bigger images will cause
            the image to crop or be resized by the Brease system.
          </Text>
        </div>
        <FormFileInput
          accept="image/png, image/jpg, image/webp, image/jpeg"
          form={form}
          fieldDesc="Recommended size : 1200x630, Max file size : 5MB"
          fieldName="openGraphImage"
        />
        {(formValues.openGraphImage || page?.openGraphImage) && (
          <Button
            variant="textType"
            label="Remove Current Image"
            icon="Trash2"
            size="md"
            className="-ml-4 !text-brease-error !stroke-brease-error hover:!text-brease-error/80 hover:!stroke-brease-error/80"
            onClick={handleRemoveImage}
          />
        )}
      </div>
      <div className="h-[564px] rounded-lg bg-brease-gray-2 w-full max-w-[60%] flex justify-center items-center">
        <div className="flex flex-col w-full max-w-[80%]">
          <Image src={OGImageTop} alt="Open Graph Image Preview Top" />
          {renderImage()}
          <div className="flex flex-col w-full bg-brease-gray-3 px-3 py-2">
            <Text style="semibold" size="xxs" className="text-brease-gray-8">
              {site.domain.toUpperCase()}
            </Text>
            <Text style="semibold" size="xs" className="text-brease-gray-9">
              {formValues.name}
            </Text>
            <Text style="regular" size="xxs" className="text-brease-gray-8">
              {formValues.metaDescription}
            </Text>
          </div>
          <Image src={OGImageBottom} alt="Open Graph Image Preview Bottom" />
        </div>
      </div>
    </div>
  )
}
