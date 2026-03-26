"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type { FilterType } from "@/lib/types"

interface TodoFiltersProps {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
  selectedDate?: Date | null
  onClearDate?: () => void
}

export function TodoFilters({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
  selectedDate,
  onClearDate,
}: TodoFiltersProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Done" },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selectedDate && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearDate}
            className="h-8 gap-1"
          >
            {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {activeCount} {activeCount === 1 ? "task" : "tasks"} left
        </span>
        {completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="h-8 text-sm text-muted-foreground hover:text-destructive"
          >
            Clear done
          </Button>
        )}
      </div>
    </div>
  )
}
