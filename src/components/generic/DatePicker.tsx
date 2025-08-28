import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/shadcn/ui/button'
import { Calendar } from '@/components/shadcn/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/ui/popover'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/shadcn/utils'

interface DatePickerProps {
  value?: Date | null
  // eslint-disable-next-line no-unused-vars
  onChange?: (date: string | undefined) => void
  className?: string
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  // Convert the ISO string to Date object if needed
  const parsedValue = value ? new Date(value) : null
  const [date, setDate] = useState<Date | undefined | null>(parsedValue)

  useEffect(() => {
    const newDate = value ? new Date(value) : null
    setDate(newDate)
  }, [value])

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange) {
      const formattedDate = selectedDate ? selectedDate.toISOString() : undefined
      onChange(formattedDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[300px] justify-between items-center gap-2 text-left font-golos-regular border-brease-gray-5 shadow-brease-xs rounded-md hover:bg-transparent',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-5 w-5 stroke-brease-gray-7" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!z-[99999999999999] w-auto p-0 pointer-events-auto rounded-md">
        <Calendar
          className="!z-[99999999999999]"
          mode="single"
          selected={date || undefined}
          //@ts-ignore
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
