"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseInitializer } from "@/components/database-initializer"
import { DatabaseInitializerSimple } from "@/components/database-initializer-simple"

export function DatabaseSetup() {
  const [activeTab, setActiveTab] = useState("standard")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="standard" className="flex-1">
          Método Estándar
        </TabsTrigger>
        <TabsTrigger value="simple" className="flex-1">
          Método Alternativo
        </TabsTrigger>
      </TabsList>

      <TabsContent value="standard">
        <DatabaseInitializer />
      </TabsContent>

      <TabsContent value="simple">
        <DatabaseInitializerSimple />
      </TabsContent>
    </Tabs>
  )
}
