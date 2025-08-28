import { PageContent } from '@/interface/builder'
import { useBuilderStore } from './useBuilderStore'
import { useEffect, useState } from 'react'
import { compareBuilderSections } from '../helpers/compareBuilderSections'
import { compareBuilderContents } from '../helpers/compareBuilderContents'

export const useBuilderDrafts = (currentContent: PageContent) => {
  const { locale, activeContent, elementValues, setElementValues, pageContent } = useBuilderStore()
  const [isSectionDirty, setIsSectionDirty] = useState<boolean>(false)
  const [pageContentClone, setPageContentClone] = useState<PageContent>({} as PageContent)
  const [hasContentChanged, setHasContentChanged] = useState<boolean>(false)

  // PageContent init
  useEffect(() => setPageContentClone(currentContent), [currentContent])

  // PageContentSection init
  useEffect(() => {
    if (!activeContent.uuid || !pageContentClone.uuid) return
    const initialValues: Record<string, any> = {}
    activeContent.elements.forEach((row) => {
      row.forEach((slot) => {
        initialValues[slot.uuid] = {
          id: slot.uuid,
          value: slot.value ?? null
        }
      })
    })
    setElementValues(initialValues)
  }, [activeContent])

  // Drafts observer
  useEffect(() => {
    if (!pageContentClone?.uuid || !currentContent?.uuid) return
    const sectionsChanged = compareBuilderSections(
      currentContent.sections,
      pageContentClone.sections
    )
    const contentsChanged = currentContent.sections.some((section, index) => {
      const cloneSection = pageContentClone.sections[index]
      if (!cloneSection) return false
      return compareBuilderContents(section, cloneSection)
    })
    if (contentsChanged || sectionsChanged) {
      setHasContentChanged(true)
    } else {
      setHasContentChanged(false)
    }
  }, [pageContentClone, currentContent, locale])

  // Active Section observer
  useEffect(() => {
    if (!pageContentClone.uuid || !currentContent.uuid || !activeContent.uuid) return
    const currSection = pageContentClone.sections.find((s) => s.uuid === activeContent!.uuid)
    const prevSection = currentContent.sections.find((s) => s.uuid === activeContent!.uuid)
    if (!prevSection || !currSection) return
    setIsSectionDirty(compareBuilderContents(prevSection, currSection))
  }, [elementValues, pageContentClone])

  const discardDraft = () => {
    setPageContentClone(pageContent)
  }

  const discardSection = () => {
    const initialValues: Record<string, any> = {}
    currentContent.sections
      .find((c) => c.uuid === activeContent.uuid)!
      .elements.forEach((row) => {
        row.forEach((slot) => {
          initialValues[slot.uuid] = {
            id: slot.uuid,
            value: slot.value ?? null
          }
        })
      })
    setElementValues(initialValues)
    const originalSectionContent = pageContent.sections.find((s) => s.uuid === activeContent.uuid)
    setPageContentClone({
      ...pageContentClone,
      sections: pageContentClone.sections.map((section) =>
        section.uuid === activeContent.uuid && originalSectionContent
          ? originalSectionContent
          : section
      )
    })
  }

  return {
    pageContentClone,
    setPageContentClone,
    isDraft: hasContentChanged,
    isSectionDirty,
    discardSection,
    discardDraft
  }
}
