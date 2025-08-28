'use client'
import { useEditorStore } from '@/lib/hooks/useEditorStore'
import { Editor, EditorPlaceholder } from './Editor'
import { EditorSidebar } from './EditorSidebar'
import { Section } from '@/interface/editor'
import { EditorLoader } from './layout/EditorLoader'

export const EditorMain = () => {
  const elements = useEditorStore((state) => state.elements)
  const sections = useEditorStore((state) => state.sections)
  const collections = useEditorStore((state) => state.collections)
  const activeSection = useEditorStore((state) => state.activeSection)
  const activeCollection = useEditorStore((state) => state.activeCollection)
  const setActiveSection = useEditorStore((state) => state.setActiveSection)
  const setActiveCollection = useEditorStore((state) => state.setActiveCollection)
  const activeMenu = useEditorStore((state) => state.editorType)

  if (!sections || !collections || !elements) {
    return <EditorLoader />
  }

  return (
    <div className="w-full h-full flex flex-row overflow-hidden">
      <EditorSidebar
        sectionProps={{
          sections: sections,
          activeSection,
          setActiveSection
        }}
        collectionProps={{
          collections: collections,
          activeCollection,
          setActiveCollection
        }}
      />
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {activeSection.uuid && activeMenu === 'sections' && (
          <Editor
            editorTools={elements}
            originalItems={sections}
            activeItem={activeSection}
            setActiveItem={(item) => setActiveSection(item as Section)}
          />
        )}
        {activeCollection.uuid && activeMenu === 'collections' && (
          <Editor
            editorTools={elements}
            originalItems={collections}
            activeItem={activeCollection}
            setActiveItem={setActiveCollection}
          />
        )}
        {((!activeCollection && activeMenu === 'collections') ||
          (!activeSection && activeMenu === 'sections')) && <EditorPlaceholder type={activeMenu} />}
      </div>
    </div>
  )
}
