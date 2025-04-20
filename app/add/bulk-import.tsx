"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FigureItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  condition: string
  price: string
  yearPurchase: string
  upc: string
  logo: string
  photo: string
  tagline: string
  review: string
  shelf: string
  display: string
  ranking: number
  comments: string
}

export default function BulkImport() {
  const { toast } = useToast()
  const [csvData, setCsvData] = useState("")
  const [jsonData, setJsonData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [importedCount, setImportedCount] = useState(0)

  const handleCsvImport = () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Parsear el CSV
      const rows = csvData.split("\n")
      const headers = rows[0].split(",").map((header) => header.trim())

      // Crear objetos para cada fila
      const items: Partial<FigureItem>[] = []

      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue

        // Manejar valores con comas dentro de comillas
        const values: string[] = []
        let currentValue = ""
        let insideQuotes = false

        for (const char of rows[i]) {
          if (char === '"') {
            insideQuotes = !insideQuotes
          } else if (char === "," && !insideQuotes) {
            values.push(currentValue)
            currentValue = ""
          } else {
            currentValue += char
          }
        }
        values.push(currentValue) // Añadir el último valor

        // Crear el objeto con los valores
        const item: any = {}

        headers.forEach((header, index) => {
          if (index < values.length) {
            const value = values[index].replace(/^"|"$/g, "") // Eliminar comillas

            // Convertir valores numéricos
            if (header === "price" || header === "ranking") {
              item[header] = Number(value) || 0
            } else {
              item[header] = value
            }
          }
        })

        // Asignar valores por defecto para campos requeridos
        if (!item.type) item.type = "figures"
        if (!item.condition) item.condition = "new"
        if (!item.shelf) item.shelf = "Eins"
        if (!item.display) item.display = "Silent Horrors"
        if (!item.ranking) item.ranking = 0

        // Generar un ID si no existe
        if (!item.id) {
          item.id = i.toString().padStart(3, "0")
        }

        items.push(item)
      }

      // Guardar en localStorage
      const existingItems = JSON.parse(localStorage.getItem("figureItems") || "[]")
      const newItems = [...existingItems, ...items]
      localStorage.setItem("figureItems", JSON.stringify(newItems))

      setImportedCount(items.length)

      toast({
        title: "Import Successful",
        description: `Successfully imported ${items.length} items`,
      })
    } catch (error) {
      console.error("Error importing CSV:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import CSV data. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJsonImport = () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Parsear el JSON
      const items = JSON.parse(jsonData)

      if (!Array.isArray(items)) {
        throw new Error("JSON data must be an array of items")
      }

      // Validar y preparar los items
      const validItems = items.map((item, index) => {
        // Asignar valores por defecto para campos requeridos
        if (!item.type) item.type = "figures"
        if (!item.condition) item.condition = "new"
        if (!item.shelf) item.shelf = "Eins"
        if (!item.display) item.display = "Silent Horrors"
        if (!item.ranking) item.ranking = 0

        // Generar un ID si no existe
        if (!item.id) {
          item.id = (index + 1).toString().padStart(3, "0")
        }

        return item
      })

      // Guardar en localStorage
      const existingItems = JSON.parse(localStorage.getItem("figureItems") || "[]")
      const newItems = [...existingItems, ...validItems]
      localStorage.setItem("figureItems", JSON.stringify(newItems))

      setImportedCount(validItems.length)

      toast({
        title: "Import Successful",
        description: `Successfully imported ${validItems.length} items`,
      })
    } catch (error) {
      console.error("Error importing JSON:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import JSON data. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Import</CardTitle>
        <CardDescription>Import multiple items at once using CSV or JSON format</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="csv" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="csv" className="flex-1">
              CSV Format
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1">
              JSON Format
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <Textarea
              placeholder="Paste your CSV data here (including headers)..."
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Format: name,type,franchise,brand,serie,yearReleased,condition,price,yearPurchase,shelf,display,ranking
            </p>
            <p className="text-xs text-muted-foreground">
              Example: &quot;Freddy Krueger&quot;,figures,&quot;A Nightmare on Elm
              Street&quot;,NECA,Ultimate,1984,new,45000,2023,Eins,&quot;Silent Horrors&quot;,5
            </p>
            <Button
              className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              onClick={handleCsvImport}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import CSV Data"
              )}
            </Button>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <Textarea
              placeholder="Paste your JSON data here (array of objects)..."
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Format: Array of objects with properties matching the collection items
            </p>
            <p className="text-xs text-muted-foreground">
              Example: [
              {`{"name":"Freddy Krueger","type":"figures","franchise":"A Nightmare on Elm Street","brand":"NECA",...}`}]
            </p>
            <Button
              className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              onClick={handleJsonImport}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Import JSON Data"
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {importedCount > 0 && (
          <p className="text-sm text-center text-neon-green mt-4">
            Successfully imported {importedCount} items. Go to the Checklist page to see them.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
