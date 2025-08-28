'use client'
import React, { useCallback, useContext, useState } from 'react'
import Button from '@/components/generic/Button'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { Copy, LoaderCircleIcon } from 'lucide-react'
import { BuilderContentEditorInput } from '../builder/BuilderContentEditorInput'
import { useManagerStore } from '@/lib/hooks/useManagerStore'
import { createBuilderContentSync } from '@/lib/helpers/createBuilderContentSync'
import { ManagerDraftContext } from '@/lib/context/ManagerDraftContext'
import { Text } from '@/components/generic/Text'
import { Badge } from '@/components/shadcn/ui/badge'
import { useUserStore } from '@/lib/hooks/useUserStore'
import { UserRole } from '@/interface/user'
import { Button as ButtonSm } from '@/components/shadcn/ui/button'
import { toast } from '@/components/shadcn/ui/use-toast'

export const ManagerContentEditor = () => {
  const { setEntryContentClone, isDraft, discardDraft } = useContext(ManagerDraftContext)
  const { user } = useUserStore()
  const { entryContent, elementValues, setElementValues, syncContent } = useManagerStore()
  const [savePublishLoading, setSavePublishLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ variant: 'success', title: 'Copied to clipboard' })
    } catch (err) {
      toast({ variant: 'error', title: 'Failed to copy' })
    }
  }, [])

  const discardValue = (uuid: string) => {
    if (!entryContent?.elements) return
    const originalElement = entryContent.elements.flat().find((el) => el.uuid === uuid)
    handleValueChange(uuid, originalElement?.value)
  }

  const handleValueChange = (uuid: string, value: any) => {
    const newValue = value === undefined || value === '' ? null : value
    setElementValues({
      ...elementValues,
      [uuid]: {
        id: uuid,
        value: newValue
      }
    })
    setEntryContentClone((prevContent) => {
      const updatedContent = JSON.parse(JSON.stringify(prevContent))
      updatedContent.elements = updatedContent.elements.map((slot: any) => {
        if (slot.uuid === uuid) {
          return { ...slot, value: newValue }
        }
        return slot
      })
      return updatedContent
    })
  }

  const handleSyncContent = async () => {
    setSaveLoading(true)
    const sync = createBuilderContentSync(elementValues)
    await syncContent(sync)
    setSaveLoading(false)
  }

  const handleSyncAndPublish = async () => {
    setSavePublishLoading(true)
    const sync = createBuilderContentSync(elementValues)
    await syncContent(sync, true)
    setSavePublishLoading(false)
  }

  return (
    <div className="w-full h-full bg-brease-gray-1 !overflow-hidden">
      <div className="w-full flex flex-col">
        <div className="w-full flex flex-col divide-y divide-brease-gray-5">
          <div className="w-full min-h-[53px] flex flex-row justify-between items-center px-4 pr-6 bg-brease-gray-1 !border-b border-brease-gray-5">
            {user.currentTeam.userRole === UserRole.administrator && (
              <div className="flex flex-row item gap-2">
                <Badge variant="secondary" className="rounded-full text-brease-gray-7">
                  {entryContent.uuid}
                </Badge>
                <ButtonSm
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(entryContent.uuid)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </ButtonSm>
              </div>
            )}
            <div className="w-fit flex flex-row gap-4">
              <Button
                variant="textType"
                size="sm"
                icon="ClipboardX"
                label="Discard Changes"
                onClick={discardDraft}
                disabled={savePublishLoading || saveLoading || !isDraft}
                className="!p-0 hover:!stroke-brease-gray-7 hover:!text-brease-gray-7"
              />
              {saveLoading ? (
                <ButtonPlaceholder
                  variant="primary"
                  size="sm"
                  className="flex justify-center !w-[122.5px]"
                >
                  {<LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />}
                </ButtonPlaceholder>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  icon="Save"
                  label="Save Content"
                  disabled={savePublishLoading || !isDraft}
                  onClick={handleSyncContent}
                />
              )}
              {savePublishLoading ? (
                <ButtonPlaceholder
                  variant="black"
                  size="sm"
                  className="flex justify-center !w-[146.5px]"
                >
                  <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                </ButtonPlaceholder>
              ) : (
                <Button
                  variant="black"
                  size="sm"
                  icon="SaveAll"
                  label="Save and Publish"
                  onClick={handleSyncAndPublish}
                  disabled={saveLoading || !isDraft}
                  className="!ring-black hover:!ring-brease-primary"
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100dvh-106px)] flex flex-col gap-4 divide-y divide-brease-gray-5 pb-6 overflow-y-scroll">
          {entryContent?.elements?.length > 0 ? (
            entryContent.elements.map((element: any) => (
              <BuilderContentEditorInput
                key={element.uuid}
                element={element}
                value={elementValues[element.uuid]}
                onChange={(value) => handleValueChange(element.uuid, value)}
                discard={discardValue}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <LoaderCircleIcon className="w-8 h-8 stroke-brease-gray-7 animate-spin" />
                <Text style="medium" size="sm" className="text-brease-gray-7">
                  Loading content...
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
