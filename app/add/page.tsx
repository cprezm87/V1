"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BulkImport from "./bulk-import"
import GoogleSheetsImport from "./google-sheets-import"

// Importar el componente original de la página Add
import OriginalAddPage from "./original-add-page"

export default function AddPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Add</h1>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="single" className="flex-1">
            Add Single Item
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex-1">
            Bulk Import
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex-1">
            Google Sheets Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <OriginalAddPage />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkImport />
        </TabsContent>

        <TabsContent value="sheets">
          <GoogleSheetsImport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
