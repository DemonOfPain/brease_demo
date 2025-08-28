'use client'
import { BuilderDraftContext } from '@/lib/context/BuilderDraftContext'
import React, { useContext, useState } from 'react'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Text } from '@/components/generic/Text'
import { LoaderCircleIcon, X } from 'lucide-react'
import { BuilderContentEditorInput } from './BuilderContentEditorInput'
import Button from '@/components/generic/Button'
import { PageContentSection } from '@/interface/builder'
import { useBuilderStore } from '@/lib/hooks/useBuilderStore'
import { ButtonPlaceholder } from '@/components/generic/ButtonPlaceholder'
import { createBuilderContentSync } from '@/lib/helpers/createBuilderContentSync'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/shadcn/ui/dialog'
import { Badge } from '@/components/shadcn/ui/badge'
import { toast } from '@/components/shadcn/ui/use-toast'

export const BuilderContentEditor = () => {
  const { setPageContentClone, discardSection, isSectionDirty } = useContext(BuilderDraftContext)
  const {
    contentEditorOpen,
    pageContent,
    activeContent,
    elementValues,
    setElementValues,
    syncContent,
    setContentEditorOpen
  } = useBuilderStore()
  const [savePublishLoading, setSavePublishLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  const discardValue = (uuid: string) => {
    if (!activeContent.uuid) return
    const originalElement = pageContent.sections
      .find((s) => s.uuid === activeContent.uuid)!
      .elements.flat()
      .find((el) => el.uuid === uuid)
    handleValueChange(uuid, originalElement?.value)
  }

  const handleValueChange = (uuid: string, value: any) => {
    const newValue = value === undefined || value === '' || value === null ? null : value
    // Update all element values
    setElementValues({
      ...elementValues,
      [uuid]: {
        id: uuid,
        value: newValue
      }
    })
    // Update page content clone
    if (activeContent) {
      setPageContentClone((prevContent) => {
        const updatedContent = JSON.parse(JSON.stringify(prevContent))
        updatedContent.sections = updatedContent.sections.map((section: PageContentSection) => {
          if (section.uuid === activeContent.uuid) {
            section.elements = section.elements.map((row) =>
              row.map((slot) => {
                if (slot.uuid === uuid) {
                  return { ...slot, value: newValue }
                }
                return slot
              })
            )
          }
          return section
        })
        return updatedContent
      })
    }
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
    const res = (await syncContent(sync, true)) as PageContentSection
    const newSection = {
      ...res,
      status: 'published' as 'draft' | 'published'
    }
    setPageContentClone((prev) => {
      const sectionIndex = prev.sections.findIndex((s) => s.uuid === res.uuid)
      const updatedSections = [...prev.sections]
      updatedSections[sectionIndex] = newSection
      return {
        ...prev,
        sections: updatedSections
      }
    })
    toast({ variant: 'success', title: 'Content saved and published!' })
    setSavePublishLoading(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (
      !open &&
      event?.type === 'click' &&
      (event.target as HTMLElement).closest('.dialog-close-btn')
    ) {
      setContentEditorOpen(false)
    }
  }

  const activeSection = pageContent.sections.find((s) => s.uuid === activeContent.uuid)
  if (!activeContent.uuid || !activeSection?.uuid) return

  const allElements = activeSection.elements.flat()
  return (
    <Dialog open={contentEditorOpen} onOpenChange={handleOpenChange} modal={false}>
      <DialogContent className="w-[75%] h-[90%] !rounded-[10px] !p-0 !gap-0 flex flex-col !transform-none top-[calc(50%-45%)] left-[calc(50%-37.5%)]">
        <VisuallyHidden.Root>
          <DialogTitle>Content Editor Dialog</DialogTitle>
          <DialogDescription>Content Editor Dialog</DialogDescription>
        </VisuallyHidden.Root>
        <div className="flex flex-row items-center justify-between p-4 border-b border-brease-gray-5">
          <Text size="xl" style="medium">
            {activeContent.section.name}
          </Text>
          <div className="w-fit flex gap-4">
            <Badge variant="secondary" className="rounded-full text-brease-gray-7">
              {activeContent.section.uuid}
            </Badge>
            <DialogClose className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 dialog-close-btn">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </div>
        <div className="h-full flex flex-col gap-4 pb-4 divide-y divide-brease-gray-5 overflow-y-scroll">
          {allElements.map((element) => (
            <BuilderContentEditorInput
              key={element.uuid}
              element={element}
              value={elementValues[element.uuid]}
              onChange={(value) => handleValueChange(element.uuid, value)}
              discard={discardValue}
            />
          ))}
        </div>
        {isSectionDirty && (
          <div className="flex flex-row w-full border-t border-brease-gray-5 justify-between items-center p-4">
            <>
              <Button
                variant="secondary"
                size="md"
                icon="Trash"
                disabled={savePublishLoading || saveLoading}
                onClick={discardSection}
              >
                Discard All
              </Button>
              <div className="flex gap-4">
                {saveLoading ? (
                  <ButtonPlaceholder
                    variant="primary"
                    size="md"
                    className="flex justify-center !w-[135px]"
                  >
                    <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                  </ButtonPlaceholder>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    icon="Save"
                    disabled={savePublishLoading}
                    onClick={handleSyncContent}
                  >
                    Save Content
                  </Button>
                )}
                {savePublishLoading ? (
                  <ButtonPlaceholder
                    variant="primary"
                    size="md"
                    className="flex justify-center !w-[171px]"
                  >
                    <LoaderCircleIcon className="h-4 w-4 stroke-brease-gray-1 animate-spin" />
                  </ButtonPlaceholder>
                ) : (
                  <Button
                    variant="black"
                    size="md"
                    icon="SaveAll"
                    disabled={saveLoading}
                    onClick={handleSyncAndPublish}
                  >
                    Save and Publish
                  </Button>
                )}
              </div>
            </>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
