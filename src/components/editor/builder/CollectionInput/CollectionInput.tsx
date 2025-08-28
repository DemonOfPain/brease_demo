import { Text } from '@/components/generic/Text'
import { Collection } from '@/interface/editor'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { useSiteStore } from '@/lib/hooks/useSiteStore'
import { Library } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface CollectionInputProps {
  collection: Collection
  value?: string | null
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
}

export const CollectionInput = ({ collection, value, onChange }: CollectionInputProps) => {
  const router = useRouter()
  const { setCollection } = useManagerStore()
  const { site } = useSiteStore()
  // When mounted, set the collection UUID if no value is set
  React.useEffect(() => {
    if (!value && onChange) {
      onChange(collection.uuid)
    }
  }, [])

  const handleCollectionOpen = () => {
    setCollection(collection)
    router.push(`/editor/${site.uuid}/manager`)
  }

  return (
    <div onClick={handleCollectionOpen} className="w-fit h-fit cursor-pointer">
      <div className="flex flex-row items-center gap-4 py-2 px-3 rounded-md border border-brease-gray-5 shadow-brease-xs">
        <Library />
        <div className="w-fit h-fit">
          <Text size="sm" style="medium">
            {collection.name}
          </Text>
        </div>
      </div>
    </div>
  )
}
