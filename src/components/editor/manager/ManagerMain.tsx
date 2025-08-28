import React, { useContext } from 'react'
import { EntryKiosk } from './EntryKiosk'
import { ManagerContentEditor } from './ManagerContentEditor'
import { ManagerDraftContext } from '@/lib/context/ManagerDraftContext'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { useManagerUrlSync } from '@/lib/hooks/useManagerUrlSync'
import { LoaderCircle } from 'lucide-react'
import { Text } from '@/components/generic/Text'

export const ManagerMain = () => {
  const { entryContentClone } = useContext(ManagerDraftContext)
  const { entries } = useManagerStore()
  const { isContentReady, isLoading } = useManagerUrlSync()

  const showEditor = entryContentClone.uuid && entries && isContentReady
  const showLoading = !entries || isLoading

  return (
    <div className="w-full h-full flex flex-row">
      <EntryKiosk />
      {showEditor && <ManagerContentEditor />}
      {showLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="w-16 h-16 stroke-brease-gray-7 animate-spin" />
            <Text style="medium" size="sm" className="text-brease-gray-7">
              {!entries ? 'Loading entries...' : 'Loading content...'}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
