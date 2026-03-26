"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface UserHeaderProps {
  user: User
}

export function UserHeader({ user }: UserHeaderProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium text-foreground">{displayName}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  )
}
