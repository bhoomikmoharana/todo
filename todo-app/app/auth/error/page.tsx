import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            Something went wrong during sign in. Please try again.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/auth/login">Back to Login</Link>
        </Button>
      </div>
    </main>
  )
}
