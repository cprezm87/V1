"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

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
      // Construir la URL de la API de Google Sheets
      // Formato: https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/SHEET_NAME?key=API_KEY
      // Para este ejemplo, usaremos un enfoque alternativo con la API pública de Google Sheets
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
        sheetName,
      )}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error("Failed to fetch data from Google Sheets")
      }

      const csvText = await response.text()

      // Parsear el CSV
      const rows = csvText.split("\n")
      const headers = rows[0].split(",").map(
        (header) => header.replace(/^"|"$/g, "").trim(), // Eliminar comillas y espacios
      )

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

  return null
}
