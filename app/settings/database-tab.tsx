"use client"

import { DatabaseInitializer } from "@/components/database-initializer"

export function DatabaseTab() {
  return (
    <div className="space-y-6">
      <DatabaseInitializer />
    </div>
  )
}
