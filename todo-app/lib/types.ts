export interface Todo {
  id: string
  user_id: string
  text: string
  completed: boolean
  due_date: string | null
  created_at: string
  updated_at: string
}

export type FilterType = "all" | "active" | "completed"
