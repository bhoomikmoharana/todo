"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Plus, CalendarIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TodoInputProps {
  onAdd: (text: string, dueDate: Date | null) => void
  defaultDate?: Date | null
}

export function TodoInput({ onAdd, defaultDate }: TodoInputProps) {
  const [value, setValue] = useState("")
  const [dueDate, setDueDate] = useState<Date | null>(defaultDate || null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  useEffect(() => {
    setDueDate(defaultDate || null)
  }, [defaultDate])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      onAdd(trimmed, dueDate)
      setValue("")
      if (!defaultDate) {
        setDueDate(null)
      }
    }
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    ) {
      return "Today"
    }
    if (
      date.getFullYear() === tomorrow.getFullYear() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getDate() === tomorrow.getDate()
    ) {
      return "Tomorrow"
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-1 gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-12 flex-1 bg-card text-base"
        />
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className={cn("h-12 gap-2 px-3", dueDate && "text-primary")}
            >
              <CalendarIcon className="h-4 w-4" />
              {dueDate ? (
                <span className="hidden sm:inline">{formatDate(dueDate)}</span>
              ) : (
                <span className="hidden sm:inline">Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <DatePicker
              selected={dueDate}
              onSelect={(date) => {
                setDueDate(date)
                setIsCalendarOpen(false)
              }}
              onClear={() => {
                setDueDate(null)
                setIsCalendarOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" size="lg" className="h-12 gap-2 px-4" disabled={!value.trim()}>
        <Plus className="h-5 w-5" />
        <span className="sm:hidden">Add</span>
        <span className="hidden sm:inline">Add task</span>
      </Button>
    </form>
  )
}

interface DatePickerProps {
  selected: Date | null
  onSelect: (date: Date) => void
  onClear: () => void
}

function DatePicker({ selected, onSelect, onClear }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isSelected = (date: Date) => {
    if (!selected) return false
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    )
  }

  const days = []

  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => onSelect(date)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
          isToday(date) && !isSelected(date) && "bg-muted font-semibold",
          isSelected(date) && "bg-primary text-primary-foreground",
          !isSelected(date) && !isToday(date) && "hover:bg-muted"
        )}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
        >
          <span className="sr-only">Previous month</span>
          &lt;
        </button>
        <span className="text-sm font-medium">{monthName}</span>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
        >
          <span className="sr-only">Next month</span>
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground">
            {day}
          </div>
        ))}
        {days}
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onSelect(new Date())}
        >
          Today
        </Button>
        {selected && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
