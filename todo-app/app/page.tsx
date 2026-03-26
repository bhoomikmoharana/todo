import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TodoList } from "@/components/todo-list"
import { UserHeader } from "@/components/user-header"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <header className="mb-8">
          <UserHeader user={user} />
        </header>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl text-balance">
            Tasks
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stay organized, stay focused.
          </p>
        </div>

        <TodoList user={user} />
      </div>
    </main>
  )
}
