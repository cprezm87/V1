"use client"

import { AuthForm } from "@/components/auth-form"

export default function AuthPageClient() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
        <AuthForm />
      </div>
    </div>
  )
}
