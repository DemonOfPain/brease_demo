import Button from '@/components/generic/Button'
import { Text } from '@/components/generic/Text'
import { Title } from '@/components/generic/Title'
import { Layers2 } from 'lucide-react'
import React from 'react'

//TODO: add interactivity

export const CreateSiteCard = () => {
  return (
    <div className="w-full p-6 h-[289px] flex flex-col justify-between border-2 border-dashed border-brease-gray-3 rounded-lg">
      <Layers2 className="w-16 h-16 stroke-1" />
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col">
          <Title style="semibold" size="xs">
            Create a New Site
          </Title>
          <Text style="regular" size="sm">
            Start building with Brease
          </Text>
        </div>
        <Button size="md" variant="primary" label="Create" navigateTo="/dashboard/sites/new" />
      </div>
    </div>
  )
}
