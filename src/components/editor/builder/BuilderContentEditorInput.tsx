'use client'
import React, { useEffect, useState } from 'react'
import { DatePicker } from '@/components/generic/DatePicker'
import { Text } from '@/components/generic/Text'
import { Input } from '@/components/shadcn/ui/input'
import { Switch } from '@/components/shadcn/ui/switch'
import { Textarea } from '@/components/shadcn/ui/textarea'
import { PageContentMatrixSlot } from '@/interface/builder'
import { Collection, ElementTypes } from '@/interface/editor'
import { CircleAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
import { BreaseMediaInput } from './BreaseMediaInput'
import { CollectionInput } from './CollectionInput/CollectionInput'
import { LinkInput } from './LinkInput'
import Button from '@/components/generic/Button'
import { Skeleton } from '@/components/shadcn/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import { MultiSelect } from '@/components/shadcn/ui/multi-select'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { toNormalCase } from '@/lib/helpers/toNormalCase'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { CollectionEntrySelect } from './CollectionInput/CollectionEntrySelect'
import { CollectionEntry } from '@/interface/manager'
import CollectionOrderInput from './CollectionInput/CollectionOrderInput'

const CustomCodeEditor = dynamic(
  () => import('@/components/editor/builder/CustomCodeEditor').then((mod) => mod.CustomCodeEditor),
  { ssr: false, loading: () => <Skeleton className="w-full h-[94px]" /> }
)

const RichText = dynamic(
  () => import('@/components/editor/builder/RichText').then((mod) => mod.RichText),
  { ssr: false, loading: () => <Skeleton className="w-full h-[94px]" /> }
)

interface BuilderContentEditorInputProps {
  element: PageContentMatrixSlot
  value: any
  // eslint-disable-next-line no-unused-vars
  onChange: (value: any) => void
  // eslint-disable-next-line no-unused-vars
  discard: (uuid: string) => void
}

const ContentEditorInputWrapper = ({
  element,
  layout,
  children,
  discard,
  value
}: {
  element: PageContentMatrixSlot
  layout: 'row' | 'col'
  children: React.ReactNode
  // eslint-disable-next-line no-unused-vars
  discard: (uuid: string) => void
  value: any
}) => {
  const discardable = () => {
    if (value === '') return false
    if (typeof value === 'object' && (value != '' || !value)) {
      return JSON.stringify(element.value) !== JSON.stringify(value.value)
    } else {
      return JSON.stringify(element.value) !== JSON.stringify(value)
    }
  }
  if (layout === 'row') {
    return (
      <div className="w-full h-fit flex flex-row justify-between gap-4 p-4 pb-0 group">
        <div className="w-fit flex flex-row items-center divide-x divide-brease-gray-7 gap-2">
          <div className="flex flex-row gap-2 items-center">
            {element.element.data?.validation.required &&
              (element.value === null || element.value === '') && (
                <CircleAlert className="stroke-brease-warning w-4 h-4" />
              )}
            <Text size="md" style="medium">
              {toNormalCase(element.element.key)}
            </Text>
          </div>
          <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
            {element.element.element.name}
          </Text>
          {element.element.data?.validation.required && (
            <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
              Required
            </Text>
          )}
          {discardable() && (
            <div>
              <Button
                size="sm"
                variant="textType"
                label="Discard"
                className="!py-0 text-brease-gray-7 hover:!text-brease-gray-6"
                onClick={() => discard(element.uuid)}
              />
            </div>
          )}
        </div>
        {children}
      </div>
    )
  } else {
    return (
      <div className="w-full h-fit flex flex-col gap-4 p-4 pb-0 group">
        <div className="w-fit flex flex-row items-center divide-x divide-brease-gray-7 gap-2">
          <div className="flex flex-row gap-2 items-center">
            {element.element.data?.validation.required &&
              (element.value === null || element.value === '') && (
                <CircleAlert className="stroke-brease-warning w-4 h-4" />
              )}
            <Text size="md" style="medium">
              {toNormalCase(element.element.key)}
            </Text>
          </div>
          <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
            {element.element.element.name}
          </Text>
          {element.element.data?.validation.required && (
            <Text size="xxs" style="regular" className="text-brease-gray-7 pl-2">
              Required
            </Text>
          )}
          {discardable() && (
            <div>
              <Button
                size="sm"
                variant="textType"
                label="Discard"
                className="!py-0 text-brease-gray-7 hidden group-hover:block hover:!stroke-brease-gray-6 hover:!text-brease-gray-6"
                onClick={() => discard(element.uuid)}
              />
            </div>
          )}
        </div>
        {children}
      </div>
    )
  }
}

export const BuilderContentEditorInput = ({
  element,
  value,
  onChange,
  discard
}: BuilderContentEditorInputProps) => {
  // For collection input field get entries from collection
  const { collections } = useEditorStore()
  const { getCollectionEntries } = useManagerStore()
  const [entries, setEntries] = useState<CollectionEntry[]>([])
  let collection = {} as Collection
  if (element.element.element.type === ElementTypes.collection)
    collection = collections!.find((c) => c.uuid === element.element.data.collectionUuid)!
  const getEntries = async () => {
    const entries = (await getCollectionEntries(collection.uuid)) as CollectionEntry[]
    setEntries(entries)
  }
  useEffect(() => {
    if (element.element.element.type === ElementTypes.collection && collection.uuid) getEntries()
  }, [])

  switch (element.element.element.type) {
    case ElementTypes.option:
      if (element.element.data.type === 'select') {
        // Handle case where value is an array but we need a string
        const normalizedValue = Array.isArray(value)
          ? value[0] || ''
          : typeof value === 'object'
            ? (value?.value ?? '')
            : (value ?? '')
        return (
          <ContentEditorInputWrapper
            value={normalizedValue}
            element={element}
            discard={discard}
            layout="row"
          >
            <Select value={normalizedValue} onValueChange={onChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {element.element.data.values.map((option: { label: string; value: string }) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </ContentEditorInputWrapper>
        )
      } else if (element.element.data.type === 'multiselect') {
        // Handle case where value is a string but we need an array
        const normalizedValue =
          typeof value === 'string'
            ? [value]
            : typeof value === 'object'
              ? (value?.value ?? [])
              : (value ?? [])
        return (
          <ContentEditorInputWrapper value={value} element={element} discard={discard} layout="row">
            <div className="w-[300px]">
              <MultiSelect
                options={element.element.data.values}
                onChange={onChange}
                selected={normalizedValue}
              />
            </div>
          </ContentEditorInputWrapper>
        )
      }
    case ElementTypes.collection:
      return (
        <div className="w-full h-fit flex flex-col items-center justify-between gap-4 p-4 pb-0">
          <div className="w-full h-fit flex flex-row items-center justify-between">
            <div className="w-fit flex flex-row items-center divide-x divide-brease-gray-7 gap-2">
              <div className="flex flex-row gap-2 items-center">
                {!element.value && <CircleAlert className="stroke-brease-warning w-4 h-4" />}
                <Text size="md" style="medium">
                  {element.element.element.name}
                </Text>
              </div>
              <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
                {toNormalCase(element.element.key)}
              </Text>
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-2">
                <Text size="sm" style="medium">
                  Custom select
                </Text>
              </div>
              <Switch
                checked={value?.value?.is_filtered || false}
                onCheckedChange={(checked) =>
                  onChange({
                    is_filtered: checked,
                    entries: [],
                    order_field: null,
                    order_direction: null
                  })
                }
              />
              <CollectionOrderInput
                elements={collection.elements.flatMap((row) => row)}
                order_field={value?.value?.value?.order_field || null}
                order_direction={value?.value?.value?.order_direction || null}
                is_filtered={value?.value?.is_filtered || false}
                onChange={({ order_field, order_direction, is_filtered, entries }) => {
                  onChange({
                    ...value.value,
                    is_filtered,
                    entries,
                    value: {
                      order_field,
                      order_direction
                    }
                  })
                }}
              />
              <CollectionInput
                collection={collection}
                value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
                onChange={onChange}
              />
            </div>
          </div>
          {value?.value?.is_filtered && (
            <CollectionEntrySelect entries={entries || []} value={value} onChange={onChange} />
          )}
        </div>
      )
    case ElementTypes.json:
      // Convert value to string if it's an object, otherwise use the value or empty string
      const jsonValue =
        typeof value?.value === 'object' && value?.value !== null
          ? JSON.stringify(value?.value, null, 2)
          : typeof value?.value === 'string'
            ? value?.value
            : ''
      return (
        <ContentEditorInputWrapper
          value={jsonValue}
          element={element}
          discard={discard}
          layout="col"
        >
          <CustomCodeEditor initialValue={jsonValue} onChange={onChange} />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.boolean:
      // Set init null value to false
      if (value?.value === null || value === null) onChange(false)
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? value?.value || false : value || false}
          element={element}
          discard={discard}
          layout="row"
        >
          <Switch
            checked={typeof value === 'object' ? value?.value || false : value || false}
            onCheckedChange={onChange}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.richtext:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="col"
        >
          <RichText
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={onChange}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.longText:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="col"
        >
          <Textarea
            className="w-full resize-none"
            rows={5}
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={(e) => onChange(e.target.value)}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.shortText:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="col"
        >
          <Input
            className="w-full"
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={(e) => onChange(e.target.value)}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.integer:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="row"
        >
          <Input
            className="w-1/3"
            type="number"
            step={1}
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={(e) => onChange(parseInt(e.target.value) || null)}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.decimal:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="row"
        >
          <Input
            className="w-1/3"
            type="number"
            step={0.001}
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={(e) => onChange(parseFloat(e.target.value) || null)}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.dateTime:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="row"
        >
          <DatePicker
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={onChange}
          />
        </ContentEditorInputWrapper>
      )
    case ElementTypes.location:
      //TODO: (v2)
      return (
        <div className="w-full h-full flex justify-center items-center p-4 pb-0">
          <div className="flex flex-col gap-2 justify-center items-center">
            <span>{element.uuid}</span>
            <span>{element.element.element.type}</span>
            <span>{String(typeof value === 'object' ? (value?.value ?? '') : (value ?? ''))}</span>
          </div>
        </div>
      )
    case ElementTypes.media: //Custom media input for this element type
      const discardable = () => {
        if (value === null || value?.value === null) return false
        if (typeof value === 'object' && (value !== '' || !value)) {
          return JSON.stringify(element.value) !== JSON.stringify(value?.value)
        } else {
          return JSON.stringify(element.value) !== JSON.stringify(value)
        }
      }
      return (
        <div className="group w-full h-fit flex flex-col gap-4 p-4 pb-0">
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-fit flex flex-row items-center divide-x divide-brease-gray-7 gap-2">
              <div className="flex flex-row gap-2 items-center">
                {element.element.data?.validation.required &&
                  (element.value === null || element.value === '') && (
                    <CircleAlert className="stroke-brease-warning w-4 h-4" />
                  )}
                <Text size="md" style="medium">
                  {toNormalCase(element.element.key)}
                </Text>
              </div>
              <Text size="md" style="medium" className="pl-2">
                {element.element.data!.type.charAt(0).toUpperCase() +
                  element.element.data!.type.slice(1)}
              </Text>
              {element.element.data?.multiple && (
                <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
                  Multiple
                </Text>
              )}
              {element.element.data?.validation.required && (
                <Text size="xs" style="regular" className="text-brease-gray-7 pl-2">
                  Required
                </Text>
              )}
              {discardable() && (
                <div>
                  <Button
                    size="sm"
                    variant="textType"
                    label="Discard"
                    className="!py-0 text-brease-gray-7 hidden group-hover:block relative z-10 hover:!stroke-brease-gray-6 hover:!text-brease-gray-6"
                    onClick={() => discard(element.uuid)}
                  />
                </div>
              )}
            </div>
          </div>
          <BreaseMediaInput
            element={element}
            className="-mt-10"
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={onChange}
          />
        </div>
      )
    case ElementTypes.link:
      return (
        <ContentEditorInputWrapper
          value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
          element={element}
          discard={discard}
          layout="col"
        >
          <LinkInput
            value={typeof value === 'object' ? (value?.value ?? '') : (value ?? '')}
            onChange={onChange}
          />
        </ContentEditorInputWrapper>
      )
    default:
      return (
        <div className="w-full h-full flex justify-center items-center p-4 pb-0">
          <div className="!text-brease-error flex flex-col gap-2 justify-center items-center">
            <span>{element.uuid}</span>
            <span>{element.element.element.type}</span>
            <span>{String(typeof value === 'object' ? (value?.value ?? '') : (value ?? ''))}</span>
          </div>
        </div>
      )
  }
}
