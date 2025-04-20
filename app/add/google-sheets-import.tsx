"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function GoogleSheetsImport() {
  const { toast } = useToast()
  const [sheetId, setSheetId] = useState("")
  const [sheetName, setSheetName] = useState("Sheet1")
  const [isLoading, setIsLoading] = useState(false)
  const [importedCount, setImportedCount] = useState(0)

  const handleImport = async () => {
    if (!sheetId) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheet ID",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Construir la URL para acceder a la hoja como CSV
      // Formato: https://docs.google.com/spreadsheets/d/{sheetId}/gviz/tq?tqx=out:csv&sheet={sheetName}
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`

      // Obtener los datos
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`)
      }

      const csvData = await response.text()

      // Parsear el CSV
      const rows = csvData.split("\n")
      const headers = rows[0].split(",").map(
        (header) => header.replace(/^"|"$/g, "").trim(), // Eliminar comillas y espacios
      )

      // Crear objetos para cada fila
      const items = []

      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue

        // Manejar valores con comas dentro de comillas
        const values = []
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
        const item = {}

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
        description: `Successfully imported ${items.length} items from Google Sheets`,
      })
    } catch (error) {
      console.error("Error importing from Google Sheets:", error)
      toast({
        title: "Import Failed",
        description: "Failed to import data from Google Sheets. Make sure the sheet is publicly accessible.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Extraer el ID de la hoja de una URL completa
  const handleSheetIdChange = (value: string) => {
    // Si es una URL completa, extraer el ID
    if (value.includes("docs.google.com/spreadsheets/d/")) {
      const match = value.match(/\/d\/([a-zA-Z0-9-_]+)/)
      if (match && match[1]) {
        setSheetId(match[1])
        return
      }
    }

    // Si no es una URL o no se pudo extraer el ID, usar el valor tal cual
    setSheetId(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import from Google Sheets</CardTitle>
        <CardDescription>Import data directly from a Google Spreadsheet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sheet-id">Google Sheet ID or URL</Label>
          <Input
            id="sheet-id"
            placeholder="Enter Google Sheet ID or URL"
            value={sheetId}
            onChange={(e) => handleSheetIdChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms or full URL
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sheet-name">Sheet Name</Label>
          <Input
            id="sheet-name"
            placeholder="Enter sheet name (default: Sheet1)"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">The name of the specific sheet tab to import (case sensitive)</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <strong>Important:</strong> Make sure your Google Sheet is publicly accessible (File &gt; Share &gt; Anyone
            with the link can view)
          </p>
          <p className="text-xs text-muted-foreground">
            Your sheet should have headers matching the collection fields: name, type, franchise, brand, etc.
          </p>
        </div>

        <Button
          className="w-full bg-neon-green text-black hover:bg-neon-green/90"
          onClick={handleImport}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            "Import from Google Sheets"
          )}
        </Button>

        {importedCount > 0 && (
          <p className="text-sm text-center text-neon-green mt-4">
            Successfully imported {importedCount} items from Google Sheets. Go to the Checklist page to see them.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
