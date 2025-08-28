'use client'
import { BreaseUpdatesSkeleton } from '@/components/dashboard/brease-updates/BreaseUpdatesSkeleton'
import { useEffect, useState } from 'react'
import { Text } from '@/components/generic/Text'
import { BreaseUpdateEntry } from '@/components/dashboard/brease-updates/BreaseUpdateEntry'

//TODO: v2

const dummyChangelogs = [
  {
    uuid: '01',
    name: 'Brease Update 1',
    version: '1.0.1',
    changelog: undefined // ??? .md files maybe
  },
  {
    uuid: '02',
    name: 'Brease Update 2',
    version: '1.0.2',
    changelog: undefined
  },
  {
    uuid: '03',
    name: 'Brease Update 3',
    version: '1.1.0',
    changelog: undefined
  }
]

export default function BreaseUpdatesPage() {
  const [changelogs, setChangelogs] = useState<any | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setChangelogs(dummyChangelogs)
    }, 1000)
  }, [])

  if (changelogs) {
    return (
      <div className="w-full h-fit flex flex-col gap-6 pb-10">
        <div className="w-fit flex flex-col">
          <Text size="xl" style="semibold">
            Brease Updates
          </Text>
          <Text size="sm" style="regular">
            Read our latest news, updates and future implementations
          </Text>
        </div>
        <div className="w-full h-fit flex flex-col gap-2">
          {changelogs.map((chlog: any) => (
            <BreaseUpdateEntry key={chlog.uuid} data={chlog} />
          ))}
        </div>
      </div>
    )
  } else {
    return <BreaseUpdatesSkeleton />
  }
}
