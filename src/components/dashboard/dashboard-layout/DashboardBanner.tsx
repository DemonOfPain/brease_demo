'use client'
import Button from '@/components/generic/Button'
import { Text } from '@/components/generic/Text'
import { Title } from '@/components/generic/Title'
import { icons } from 'lucide-react'
import React from 'react'

//TODO: handle banner close (possible storing to keep it closed for user ??)

export interface DashboardBanner {
  title: string
  desc: string
  button: {
    navigateTo: string
    label: string
    icon?: keyof typeof icons
  }
}

export const DashboardBanner = ({ title, desc, button }: DashboardBanner) => {
  return (
    <div className="w-full py-5 px-6 flex flex-row justify-between items-center gap-6 bg-brease-gray-2 rounded-lg shadow-brease-xs">
      <div className="w-fit flex-col items-start">
        <Title size="xs" style="semibold">
          {title}
        </Title>
        <Text size="sm" style="regular">
          {desc}
        </Text>
      </div>
      <div className="w-fit flex flex-row gap-5">
        <Button
          variant="secondary"
          label={button.label}
          icon={button.icon}
          size="sm"
          navigateTo={button.navigateTo}
          className="!bg-brease-gray-10 !text-brease-gray-1 hover:!ring-brease-gray-9"
        />
        <Button
          variant="textType"
          icon="X"
          size="sm"
          onClick={() => console.log('closed')}
          className="!bg-brease-gray-3 hover:!ring-2 hover:!ring-brease-primary hover:!bg-brease-gray-1"
        />
      </div>
    </div>
  )
}
