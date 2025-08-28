'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/shadcn/ui/command'
import { Badge } from '@/components/shadcn/ui/badge'

type MultiSelectProps = {
  options: { label: string; value: string }[]
  selected: string[]
  // eslint-disable-next-line
  onChange: (selected: string[]) => void
  placeholder?: string
}

/**
 * A multi-select component that allows the user to select multiple options from a list of options.
 * @param {{label: string, value: string}[]} options The list of options to select from.
 * @param {string[]} selected The currently selected options.
 * @param {(selected: string[]) => void} onChange A callback function that is called when the user selects or unselects an option.
 * @param {string} [placeholder="Select options..."] The placeholder text that is displayed when the user has not yet selected any options.
 */
export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...'
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const commandRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleUnselect = (option: string) => {
    onChange(selected.filter((s) => s !== option))
  }

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <Command
      ref={commandRef}
      onClick={() => setOpen(!open)}
      className="overflow-visible bg-white hover:cursor-pointer"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => {
            return (
              <Badge key={option} variant="secondary">
                {options.find((o) => o.value === option)!.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {selected.length === 0 && <div>{placeholder}</div>}
        </div>
      </div>
      {open && selectables.length > 0 && (
        <div className="relative">
          <div className="absolute w-full z-10 top-1 rounded-md border bg-white text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onSelect={() => {
                        onChange([...selected, option.value])
                      }}
                      className={'cursor-pointer'}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onChange([...selected, option.value])
                        }
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </div>
        </div>
      )}
    </Command>
  )
}
