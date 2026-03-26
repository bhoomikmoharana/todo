"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Pencil, Trash2, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Todo } from "@/lib/types"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string, newDueDate?: Date | null) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== todo.text) {
      onEdit(todo.id, trimmed)
    } else {
      setEditValue(todo.text)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Adjust for timezone offset
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)

    if (
      localDate.getFullYear() === today.getFullYear() &&
      localDate.getMonth() === today.getMonth() &&
      localDate.getDate() === today.getDate()
    ) {
      return "Today"
    }
    if (
      localDate.getFullYear() === tomorrow.getFullYear() &&
      localDate.getMonth() === tomorrow.getMonth() &&
      localDate.getDate() === tomorrow.getDate()
    ) {
      return "Tomorrow"
    }
    return localDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const isOverdue = () => {
    if (!todo.due_date || todo.completed) return false
    // Parse as local time by appending T00:00:00 to avoid UTC offset issues
    const dueDate = new Date(todo.due_date + "T00:00:00")
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  return (
    <div className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          todo.completed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary"
        )}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>

      {isEditing ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="h-9 flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-9 w-9 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-0.5">
            <span
              className={cn(
                "text-base transition-all",
                todo.completed && "text-muted-foreground line-through"
              )}
            >
              {todo.text}
            </span>
            {todo.due_date && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue() ? "text-destructive" : "text-muted-foreground"
                )}
              >
                <Calendar className="h-3 w-3" />
                {formatDueDate(todo.due_date)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
