import { Text } from '@/components/generic/Text'
import { Input } from '@/components/shadcn/ui/input'
import { Switch } from '@/components/shadcn/ui/switch'
import React from 'react'

interface LinkInputProps {
  value?: { label: string; url: string; isExternal: boolean } | null
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: { label: string; url: string; isExternal: boolean }) => void
}

export const LinkInput = ({ value, onChange }: LinkInputProps) => {
  const handleChange = (field: string, fieldValue: string | boolean) => {
    if (!onChange) return
    onChange({
      ...(value || { label: '', url: '', isExternal: false }),
      [field]: fieldValue
    })
  }

  return (
    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row gap-4 items-center">
        <Input
          placeholder="Label"
          className="w-[250px]"
          value={value?.label || ''}
          onChange={(e) => handleChange('label', e.target.value)}
        />
        <Input
          placeholder="href"
          className="w-[250px]"
          value={value?.url || ''}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      </div>
      <div className="flex flex-row gap-2 justify-between items-center">
        <Text size="sm" style="medium">
          External?
        </Text>
        <Switch
          checked={value?.isExternal || false}
          onCheckedChange={(checked) => handleChange('isExternal', checked)}
        />
      </div>
    </div>
  )
}
