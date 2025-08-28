import { Collection, EditorElementMatrixSlot, EditorItem } from '@/interface/editor'
import React, { useContext, useEffect, useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Text } from '@/components/generic/Text'
import Image from 'next/image'
import { MenuSquare, Plus, Save } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../shadcn/ui/dropdown-menu'
import { EditorDraftContext } from '@/lib/context/EditorDraftContext'
import { MediaMimeGroup } from '@/interface/media'
import { Switch } from '../shadcn/ui/switch'
import { useEditorStore } from '@/lib/hooks/useEditorStore'

interface EditorOutletSlotInterface {
  slot: EditorElementMatrixSlot
  slotIndex: number
  rowIndex: number
}

export const EditorOutletSlot = ({ slot, slotIndex, rowIndex }: EditorOutletSlotInterface) => {
  const { collections } = useEditorStore()
  const { itemClone, setItemClone } = useContext(EditorDraftContext)

  const [editedKey, setEditedKey] = useState(slot.key)
  const [error, setError] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  useEffect(() => {
    if (slot.element.type === 'media' && slot.data?.multiple === undefined) {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return {
                  ...s,
                  data: {
                    ...s.data,
                    multiple: false
                  }
                }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    if (slot.data?.validation?.required === undefined) {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return {
                  ...s,
                  data: {
                    ...s.data,
                    validation: {
                      ...s.data.validation,
                      required: s.element.type === 'collection' ? false : true
                    }
                  }
                }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }
  }, [])

  const handleDeleteSlot = () => {
    setItemClone((prevSection: EditorItem) => {
      const newElements = [...prevSection.elements].map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.filter((_, sIndex) => sIndex !== slotIndex)
        }
        return [...row]
      })
      return { ...prevSection, elements: newElements }
    })
  }

  const handleEditSlotKey = () => {
    const rawValue = editedKey.trim()
    const words = rawValue.split(/[^a-zA-Z0-9]+/)
    const camelCased = words
      .map((word, index) => {
        if (index === 0) {
          return word
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join('')
    const newKey = camelCased || ''
    setEditedKey(newKey)
    const isKeyUnique = !itemClone.elements
      .flat()
      .some((s) => s.uuid !== slot.uuid && s.key === newKey)

    if (isKeyUnique && newKey !== '') {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return { ...s, key: newKey }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleToggleRequired = (required: boolean) => {
    setItemClone((prevSection: EditorItem) => {
      const newElements = [...prevSection.elements].map((row, rIndex) => {
        if (rIndex === rowIndex) {
          return row.map((s, sIndex) => {
            if (sIndex === slotIndex) {
              return {
                ...s,
                data: {
                  ...s.data,
                  validation: {
                    ...s.data.validation,
                    required: required
                  }
                }
              }
            }
            return s
          })
        }
        return [...row]
      })
      return { ...prevSection, elements: newElements }
    })
  }

  const renderCommonDropdownContent = () => (
    <>
      {slot.element.type !== 'collection' && (
        <div className="flex flex-row items-center justify-between pl-1 pb-2">
          <Text size="sm" style="regular" className="text-brease-gray-7">
            Required?
          </Text>
          <Switch
            checked={slot.data?.validation?.required}
            onCheckedChange={handleToggleRequired}
          />
        </div>
      )}
      <div className="pl-1 py-1 pb-2">
        <Text size="sm" style="regular" className="text-brease-gray-7 mb-1">
          Edit key
        </Text>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editedKey}
            onChange={(e) => {
              e.stopPropagation()
              setEditedKey(e.target.value)
              setError(false)
            }}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.key === 'Enter') handleEditSlotKey()
            }}
            className={`font-golos-regular ${error ? 'text-brease-error !outline-brease-error' : 'text-brease-gray-9'} text-left w-full text-t-xxs py-1 px-2 rounded-md !bg-brease-gray-3 !outline-none`}
          />
          <button
            onClick={handleEditSlotKey}
            className="group flex items-center justify-center p-1 bg-brease-gray-3 rounded-md hover:bg-brease-primary transition-colors duration-200 ease-in-out"
          >
            <Save className="w-4 h-4 group-hover:stroke-white transition-colors duration-200 ease-in-out" />
          </button>
        </div>
        {error && (
          <Text size="xs" style="regular" className="text-brease-error mt-1">
            Key must be unique and not empty
          </Text>
        )}
      </div>
    </>
  )

  const renderCollectionDropdownContent = () => {
    const handleSelectCollection = (collection: Collection) => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return { ...s, data: { ...s.data, collectionUuid: collection.uuid } }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    return (
      <>
        {renderCommonDropdownContent()}
        <Text size="sm" style="regular" className="text-brease-gray-7 border-b pl-1 py-1">
          Select a collection
        </Text>
        {collections!
          .filter((x) => x.status === 'published')
          .map((collection: Collection) => (
            <DropdownMenuItem
              key={collection.uuid}
              onSelect={() => handleSelectCollection(collection)}
              className="group flex flex-col items-start w-full p-1 hover:cursor-pointer hover:!bg-transparent"
            >
              <Text
                size="sm"
                style="medium"
                className={`${itemClone.elements[rowIndex][slotIndex]?.data?.collectionUuid === collection.uuid && '!text-brease-primary'} group-hover:text-brease-primary transition-all duration-200 ease-in-out`}
              >
                {collection.name}
              </Text>
              <Text size="sm" style="regular" className="text-brease-gray-7">
                {collection.description}
              </Text>
            </DropdownMenuItem>
          ))}
      </>
    )
  }

  const renderMediaDropdownContent = () => {
    const mediaOptions = Object.values(MediaMimeGroup)

    const handleSelectMediaGroup = (mediaGroup: MediaMimeGroup) => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return { ...s, data: { ...s.data, type: mediaGroup } }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    const handleSelectMediaMultiple = (isMultiple: boolean) => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return { ...s, data: { ...s.data, multiple: isMultiple } }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    return (
      <>
        {renderCommonDropdownContent()}
        <div className="flex flex-row items-center justify-between border-b pl-1 py-1">
          <Text size="sm" style="regular" className="text-brease-gray-7">
            Multiple?
          </Text>
          <Switch
            checked={slot.data?.multiple || false}
            onCheckedChange={(checked) => {
              handleSelectMediaMultiple(checked)
            }}
          />
        </div>
        <Text size="sm" style="regular" className="text-brease-gray-7 border-b pl-1 py-1">
          Select media type
        </Text>
        {mediaOptions.map((mediaType: MediaMimeGroup) => (
          <DropdownMenuItem
            key={mediaType}
            onSelect={() => handleSelectMediaGroup(mediaType)}
            className="group flex flex-col items-start w-full p-1 hover:cursor-pointer hover:!bg-transparent"
          >
            <Text
              size="sm"
              style="medium"
              className={`${itemClone.elements[rowIndex][slotIndex]?.data?.type === mediaType && '!text-brease-primary'} group-hover:text-brease-primary transition-all duration-200 ease-in-out`}
            >
              {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
            </Text>
          </DropdownMenuItem>
        ))}
      </>
    )
  }

  const renderLinkDropdownContent = () => {
    const handleSelectLinkType = (linkType: 'link' | 'button') => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return { ...s, data: { ...s.data, type: linkType } }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    return (
      <>
        {renderCommonDropdownContent()}
        <Text size="sm" style="regular" className="text-brease-gray-7 border-b pl-1 py-1">
          Select link type
        </Text>
        <DropdownMenuItem
          key={'link-type-button'}
          onSelect={() => handleSelectLinkType('button')}
          className="group flex flex-col items-start w-full p-1 hover:cursor-pointer hover:!bg-transparent"
        >
          <Text
            size="sm"
            style="medium"
            className={`${itemClone.elements[rowIndex][slotIndex]?.data?.type === 'button' && '!text-brease-primary'} group-hover:text-brease-primary transition-all duration-200 ease-in-out`}
          >
            Button
          </Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          key={'link-type-link'}
          onSelect={() => handleSelectLinkType('link')}
          className="group flex flex-col items-start w-full p-1 hover:cursor-pointer hover:!bg-transparent"
        >
          <Text
            size="sm"
            style="medium"
            className={`${itemClone.elements[rowIndex][slotIndex]?.data?.type === 'link' && '!text-brease-primary'} group-hover:text-brease-primary transition-all duration-200 ease-in-out`}
          >
            Link
          </Text>
        </DropdownMenuItem>
      </>
    )
  }

  const renderOptionDropdownContent = () => {
    const handleSelectOptionType = (
      // TODO: v2
      //optionType: 'select' | 'multiselect' | 'radio' | 'checkbox'
      optionType: 'select' | 'multiselect'
    ) => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                return {
                  ...s,
                  data: {
                    ...s.data,
                    type: optionType,
                    values: s.data?.values || []
                  }
                }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    const handleAddValue = () => {
      if (!newLabel.trim() || !newValue.trim()) {
        setInputError('Both label and value are required')
        return
      }

      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                const currentValues = s.data?.values || []
                return {
                  ...s,
                  data: {
                    ...s.data,
                    values: [...currentValues, { label: newLabel.trim(), value: newValue.trim() }]
                  }
                }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
      setNewLabel('')
      setNewValue('')
      setInputError(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation()
      if (e.key === 'Enter') {
        handleAddValue()
      }
    }

    const handleDeleteValue = (valueToDelete: string) => {
      setItemClone((prevSection: EditorItem) => {
        const newElements = [...prevSection.elements].map((row, rIndex) => {
          if (rIndex === rowIndex) {
            return row.map((s, sIndex) => {
              if (sIndex === slotIndex) {
                const currentValues = s.data?.values || []
                return {
                  ...s,
                  data: {
                    ...s.data,
                    values: currentValues.filter(
                      (v: { label: string; value: string }) => v.value !== valueToDelete
                    )
                  }
                }
              }
              return s
            })
          }
          return [...row]
        })
        return { ...prevSection, elements: newElements }
      })
    }

    return (
      <>
        {renderCommonDropdownContent()}
        <div className="w-full flex flex-col py-1">
          {['select', 'multiselect'].map((type) => (
            <DropdownMenuItem
              key={type}
              onSelect={(e) => {
                e.preventDefault()
                handleSelectOptionType(type as any)
              }}
              className="group w-full p-1 hover:cursor-pointer hover:!bg-transparent"
            >
              <Text
                size="sm"
                style="medium"
                className={`${itemClone.elements[rowIndex][slotIndex]?.data?.type === type && '!text-brease-primary'} group-hover:text-brease-primary transition-all duration-200 ease-in-out`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="pt-2">
          <div className="w-full flex flex-row items-center justify-between pb-2">
            <Text size="sm" style="regular" className="text-brease-gray-7 pl-1">
              Add values
            </Text>
            <button
              onClick={() => handleAddValue()}
              className="group flex items-center justify-center p-1 bg-brease-gray-3 rounded-md hover:bg-brease-primary transition-colors duration-200 ease-in-out"
            >
              <Save className="w-4 h-4 group-hover:stroke-white transition-colors duration-200 ease-in-out" />
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => {
                setNewLabel(e.target.value)
                setInputError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Label"
              className={`w-full p-1 text-sm border rounded !outline-none ${inputError && 'border-brease-error'}`}
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.target.value)
                setInputError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Value"
              className={`w-full p-1 text-sm border rounded !outline-none ${inputError && 'border-brease-error'}`}
            />
            {inputError && (
              <Text size="xs" style="regular" className="text-brease-error">
                {inputError}
              </Text>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {slot.data?.values?.map((option: { label: string; value: string }) => (
              <div
                key={option.value}
                className="group/value flex flex-row w-full justify-between items-center gap-1 bg-brease-gray-3 px-2 py-1 rounded"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-brease-gray-7">{option.value}</span>
                </div>
                <button
                  onClick={() => handleDeleteValue(option.value)}
                  className="hidden group-hover/value:block"
                >
                  <Plus className="w-3 h-3 stroke-brease-gray-8 rotate-45" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  const renderDropdownContent = () => {
    switch (slot.element.type) {
      case 'collection':
        return renderCollectionDropdownContent()
      case 'media':
        return renderMediaDropdownContent()
      case 'link':
        return renderLinkDropdownContent()
      case 'option':
        return renderOptionDropdownContent()
      default:
        return renderCommonDropdownContent()
    }
  }

  return (
    <Draggable draggableId={slot.uuid} index={slotIndex} key={slot.uuid}>
      {(provided, snapshot) => (
        <div
          className={`group/slot relative p-1 border border-dashed border-transparent rounded-lg ${
            snapshot.isDragging && '!border-brease-primary'
          } ${
            (slot.element.type === 'collection' && !slot.data?.collectionUuid) ||
            (slot.element.type === 'media' && slot.data?.type === undefined) ||
            (slot.element.type === 'link' && !slot.data?.type) ||
            (slot.element.type === 'option' &&
              (!slot.data?.type || slot.data?.values?.length === 0))
              ? '!border-brease-warning'
              : ''
          }`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <button
            onClick={handleDeleteSlot}
            className="group/delete-slot hidden group-hover/slot:block cursor-pointer absolute -right-1 -top-1 bg-brease-gray-1 p-[2px] rounded-full border border-brease-gray-5"
          >
            <Plus className="w-3 h-3 stroke-black rotate-45 group-hover/delete-slot:stroke-brease-gray-8 transition-colors ease-in-out duration-200" />
          </button>
          <div className="w-full p-2 flex items-center flex-row gap-2 bg-brease-gray-1 border border-brease-gray-5 rounded-lg">
            <DropdownMenu>
              <DropdownMenuTrigger className="group cursor-pointer focus:outline-none">
                <div className="flex items-center justify-center p-3 bg-brease-gray-3 rounded-md hover:bg-brease-primary transition-colors duration-200 ease-in-out">
                  {slot.element.icon ? (
                    <Image
                      src={slot.element.icon}
                      alt={slot.element.name}
                      width={20}
                      height={20}
                      className="min-w-[20px] min-h-[20px] w-[20px] h-[20px] group-hover:filter group-hover:brightness-0 group-hover:invert transition-all duration-200"
                    />
                  ) : (
                    <MenuSquare className="min-w-[20px] min-h-[20px] w-[20px] h-[20px] group-hover:stroke-white transition-colors duration-200" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="mr-2 w-[270px] h-fit max-h-[300px] overflow-y-scroll flex flex-col p-2 divide-y divide-brease-gray-5 list-none"
              >
                {renderDropdownContent()}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="w-full gap-1 flex flex-col">
              <Text size="sm" style="medium" className="!min-w-[120px]">
                {slot.element.name}
              </Text>
              <div className="w-full text-left py-[2px] px-2 rounded-[4px] bg-brease-gray-3 overflow-hidden line-clamp-1">
                <Text size="xxs" style="regular">
                  {slot.key}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}
