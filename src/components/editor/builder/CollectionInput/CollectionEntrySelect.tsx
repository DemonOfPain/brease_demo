'use client'
import React from 'react'
import { Text } from '@/components/generic/Text'
import { Checkbox } from '@/components/shadcn/ui/checkbox'

interface CollectionEntry {
  uuid: string
  name: string
}

interface CollectionEntrySelectProps {
  entries: CollectionEntry[]
  value: any
  // eslint-disable-next-line no-unused-vars
  onChange: (value: any) => void
}

export const CollectionEntrySelect = ({ entries, value, onChange }: CollectionEntrySelectProps) => {
  const selectedEntries = Array.isArray(value?.value?.entries)
    ? value.value.entries
    : Array.isArray(value?.entries)
      ? value.entries
      : []
  const handleEntryToggle = (entryUuid: string) => {
    const isCurrentlySelected = selectedEntries.includes(entryUuid)
    let updatedEntries: string[]
    isCurrentlySelected
      ? (updatedEntries = selectedEntries.filter((uuid: string) => uuid !== entryUuid))
      : (updatedEntries = [...selectedEntries, entryUuid])
    onChange({
      ...value.value,
      entries: updatedEntries
    })
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="w-full h-fit p-4 flex items-center justify-center">
        <Text size="sm" style="regular" className="text-brease-gray-7">
          No entries available
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full h-fit max-h-[200px] overflow-y-auto border border-brease-gray-5 rounded-md">
      {entries.map((entry) => (
        <div
          key={entry.uuid}
          className="flex items-center gap-3 p-3 hover:bg-brease-gray-1 cursor-pointer border-b border-brease-gray-4 last:border-b-0"
          onClick={() => handleEntryToggle(entry.uuid)}
        >
          <Checkbox
            checked={selectedEntries.includes(entry.uuid)}
            onCheckedChange={() => handleEntryToggle(entry.uuid)}
            className="pointer-events-none"
          />
          <Text
            size="sm"
            style="regular"
            className={
              selectedEntries.includes(entry.uuid) ? 'text-brease-gray-9' : 'text-brease-gray-7'
            }
          >
            {entry.name}
          </Text>
        </div>
      ))}
    </div>
  )
}
