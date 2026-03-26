"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { TodoInput } from "./todo-input"
import { TodoItem } from "./todo-item"
import { TodoFilters } from "./todo-filters"
import { TodoCalendar } from "./todo-calendar"
import type { Todo, FilterType } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

interface TodoListProps {
  user: User
}

export function TodoList({ user }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching todos:", error.message)
      } else {
        setTodos(data || [])
      }
      setIsLoading(false)
    }

    fetchTodos()
  }, [user.id])

  const addTodo = async (text: string, dueDate: Date | null) => {
    const newTodo = {
      user_id: user.id,
      text,
      completed: false,
      due_date: dueDate ? dueDate.toISOString().split("T")[0] : null,
    }

    const { data, error } = await supabase
      .from("todos")
      .insert(newTodo)
      .select()
      .single()

    if (error) {
      console.error("Error adding todo:", error.message)
    } else if (data) {
      setTodos((prev) => [data, ...prev])
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error toggling todo:", error.message)
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id)

    if (error) {
      console.error("Error deleting todo:", error.message)
    } else {
      setTodos((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const editTodo = async (id: string, newText: string, newDueDate: Date | null | undefined) => {
    const updates: Partial<Todo> = {
      text: newText,
      updated_at: new Date().toISOString(),
    }
    
    if (newDueDate !== undefined) {
      updates.due_date = newDueDate ? newDueDate.toISOString().split("T")[0] : null
    }

    const { error } = await supabase.from("todos").update(updates).eq("id", id)

    if (error) {
      console.error("Error editing todo:", error.message)
    } else {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    }
  }

  const clearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id)
    
    const { error } = await supabase.from("todos").delete().in("id", completedIds)

    if (error) {
      console.error("Error clearing completed:", error.message)
    } else {
      setTodos((prev) => prev.filter((t) => !t.completed))
    }
  }

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    // Filter by completion status
    if (filter === "active" && todo.completed) return false
    if (filter === "completed" && !todo.completed) return false

    // Filter by selected date
    if (selectedDate) {
      if (!todo.due_date) return false
      const todoDate = new Date(todo.due_date)
      return (
        todoDate.getFullYear() === selectedDate.getFullYear() &&
        todoDate.getMonth() === selectedDate.getMonth() &&
        todoDate.getDate() === selectedDate.getDate()
      )
    }

    return true
  })

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.filter((todo) => todo.completed).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TodoCalendar
        todos={todos}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <TodoInput onAdd={addTodo} defaultDate={selectedDate} />

      {todos.length > 0 && (
        <>
          <TodoFilters
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
            selectedDate={selectedDate}
            onClearDate={() => setSelectedDate(null)}
          />

          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {filteredTodos.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                {selectedDate
                  ? `No tasks for ${selectedDate.toLocaleDateString()}`
                  : `No ${filter === "all" ? "" : filter} tasks`}
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))
            )}
          </div>
        </>
      )}

      {todos.length === 0 && (
        <div className="rounded-lg border border-dashed border-border px-4 py-12 text-center">
          <p className="text-muted-foreground">
            No tasks yet. Add one above to get started.
          </p>
        </div>
      )}
    </div>
  )
}
