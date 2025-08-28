'use client'

import { Text } from '@/components/generic/Text'
import lightThemeIcon from '@/images/settings-theme-light-mode.png'
import darkThemeIcon from '@/images/settings-theme-dark-mode.png'
import defaultThemeIcon from '@/images/settings-theme-auto-mode.png'
import React, { useState } from 'react'
import { ThemeCard } from './ThemeCard'
import { UserProfileDetail } from '@/interface/user'

const themesArray = [
  {
    id: 'light',
    title: 'Light theme',
    description: 'This theme will activate when your system is set to light mode.',
    image: lightThemeIcon
  },
  {
    id: 'dark',
    title: 'Dark Theme',
    description: 'This theme will activate when your system is set to dark mode.',
    image: darkThemeIcon
  },
  {
    id: 'system',
    title: 'System Default',
    description: 'This option syncs with your OS default option.',
    image: defaultThemeIcon
  }
]

export default function PreferencesForm({ user }: { user: UserProfileDetail }) {
  const [selectedTheme, setSelectedTheme] = useState('light')

  //TODO:
  function onClickTheme(id: string) {
    if (id != selectedTheme) {
      console.log(user)
      console.log(id)
      setSelectedTheme(id)
    }
  }

  return (
    <div className="w-full flex flex-col items-center gap-10">
      {/* TODO: DEV FOR V2 */}
      {/* <div className="w-full flex flex-row justify-between gap-4">
        <div className="flex flex-col">
          <Text style="semibold" size="sm">
            After login
          </Text>
          <Text style="regular" size="xs" className="text-brease-gray-8 pt-2">
            Set your first screen when you login to Brease
          </Text>
        </div>
        <div className="flex flex-col w-[416px]">
          <Text style="semibold" size="xs" className="pb-3">
            Select screen
          </Text>
          <Select onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site1">Site1</SelectItem>
              <SelectItem value="site2">Site2</SelectItem>
              <SelectItem value="site3">Site3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

      <div className="w-full flex-col">
        <div className="w-full flex flex-row justify-between border-b-2 pb-2 gap-4">
          <Text style="semibold" size="xl">
            Theme
          </Text>
        </div>
        <div className="w-full flex min-[1200px]:flex-row flex-col gap-4 justify-between mt-4">
          <div className="min-w-[240px]">
            <Text style="regular" size="sm">
              Select how you would like your interface to look. Select from the themes below or keep
              it synced with your system
            </Text>
          </div>
          <div className="flex flex-row gap-4">
            {themesArray.map((theme, idx) => {
              return (
                <ThemeCard
                  key={idx}
                  id={theme.id}
                  image={theme.image}
                  title={theme.title}
                  description={theme.description}
                  selected={theme.id === selectedTheme}
                  onClick={() => onClickTheme(theme.id)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
