import React from 'react'
import { Text } from '@/components/generic/Text'
import Button from '@/components/generic/Button'

export const BreaseUpdateEntry = ({ data }: { data: any }) => {
  return (
    <div className="w-full flex flex-row items-center justify-between border border-brease-gray-5 rounded-lg shadow-brease-xs p-4">
      <div className="w-fit flex flex-col gap-1">
        <Text size="lg" style="medium">
          {data.name}
        </Text>
        <Text size="xs" style="regular" className="text-brease-gray-7">
          {data.version}
        </Text>
      </div>
      <Button
        size="sm"
        label="Read Changelog"
        variant="secondary"
        onClick={() => console.log(data.changelog)}
      />
    </div>
  )
}
