import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn/ui/select'
import { EditorElementMatrixSlot } from '@/interface/editor'
import { toNormalCase } from '@/lib/helpers/toNormalCase'

interface CollectionOrderInputProps {
  elements: EditorElementMatrixSlot[]
  order_field: string | null
  order_direction: 'asc' | 'desc' | null
  is_filtered: boolean
  // eslint-disable-next-line no-unused-vars
  onChange: (order: {
    order_field: string | null
    order_direction: 'asc' | 'desc' | null
    is_filtered: boolean
    entries: null
  }) => void
}

export const CollectionOrderInput = ({
  elements,
  order_field,
  order_direction,
  is_filtered,
  onChange
}: CollectionOrderInputProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <Select
        value={is_filtered ? '' : order_field || ''}
        onValueChange={(newValue) => {
          onChange({
            order_field: newValue,
            order_direction: order_direction || 'asc',
            is_filtered: false,
            entries: null
          })
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select field to order by" />
        </SelectTrigger>
        <SelectContent>
          {elements.map((element) => (
            <SelectItem key={element.uuid} value={element.uuid}>
              {toNormalCase(element.key)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={is_filtered ? '' : order_direction || ''}
        onValueChange={(newValue) => {
          onChange({
            order_field: order_field || elements[0]?.uuid || null,
            order_direction: newValue as 'asc' | 'desc',
            is_filtered: false,
            entries: null
          })
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select order direction" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CollectionOrderInput
