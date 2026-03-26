"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Todo } from "@/lib/types"

interface TodoCalendarProps {
  todos: Todo[]
  selectedDate: Date | null
  onSelectDate: (date: Date | null) => void
}

export function TodoCalendar({ todos, selectedDate, onSelectDate }: TodoCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    onSelectDate(null)
  }

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })

  // Get todos count for each day
  const getTodosForDate = (date: Date) => {
    return todos.filter((todo) => {
      if (!todo.due_date) return false
      // Parse as local time by appending T00:00:00 to avoid UTC offset issues
      const todoDate = new Date(todo.due_date + "T00:00:00")
      return (
        todoDate.getFullYear() === date.getFullYear() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    )
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    if (isSelected(clickedDate)) {
      onSelectDate(null)
    } else {
      onSelectDate(clickedDate)
    }
  }

  const days = []
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dayTodos = getTodosForDate(date)
    const hasIncompleteTodos = dayTodos.some((t) => !t.completed)
    const hasCompletedTodos = dayTodos.some((t) => t.completed)
    const allCompleted = dayTodos.length > 0 && !hasIncompleteTodos

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
          isToday(date) && !isSelected(date) && "bg-muted font-semibold",
          isSelected(date) && "bg-primary text-primary-foreground",
          !isSelected(date) && !isToday(date) && "hover:bg-muted"
        )}
      >
        {day}
        {dayTodos.length > 0 && (
          <span
            className={cn(
              "absolute bottom-0.5 h-1.5 w-1.5 rounded-full",
              isSelected(date)
                ? "bg-primary-foreground"
                : allCompleted
                  ? "bg-muted-foreground"
                  : "bg-primary"
            )}
          />
        )}
      </button>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium text-foreground">{monthName}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="flex h-10 items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  )
}
