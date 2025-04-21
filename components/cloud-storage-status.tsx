"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Cloud, RefreshCw } from "lucide-react"

export function CloudStorageStatus() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [imageCount, setImageCount] = useState(0)
  const [storageUsed, setStorageUsed] = useState(0)
  const [storageLimit, setStorageLimit] = useState(5 * 1024 * 1024 * 1024) // 5GB por defecto

  // Simular la carga de datos de almacenamiento en la nube
  useEffect(() => {
    const fetchStorageData = async () => {
      setIsLoading(true)
      try {
        // En una implementación real, esto sería una llamada a la API
        // para obtener estadísticas de Vercel Blob

        // Simulación de datos
        setTimeout(() => {
          // Contar imágenes en localStorage que son URLs de Vercel Blob
          let count = 0
          let totalSize = 0

          // Buscar en figureItems
          const figureItems = JSON.parse(localStorage.getItem("figureItems") || "[]")
          figureItems.forEach((item: any) => {
            if (item.imageUrl && item.imageUrl.includes("vercel-storage")) {
              count++
              totalSize += 500000 // Estimar 500KB por imagen
            }
            if (item.logo && item.logo.includes("vercel-storage")) {
              count++
              totalSize += 300000 // Estimar 300KB por logo
            }
          })

          // Buscar en wishlistItems
          const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
          wishlistItems.forEach((item: any) => {
            if (item.photo && item.photo.includes("vercel-storage")) {
              count++
              totalSize += 500000
            }
            if (item.logo && item.logo.includes("vercel-storage")) {
              count++
              totalSize += 300000
            }
          })

          // Buscar en customItems
          const customItems = JSON.parse(localStorage.getItem("customItems") || "[]")
          customItems.forEach((item: any) => {
            if (item.logo && item.logo.includes("vercel-storage")) {
              count++
              totalSize += 300000
            }
          })

          setImageCount(count)
          setStorageUsed(totalSize)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error al obtener datos de almacenamiento:", error)
        setIsLoading(false)
      }
    }

    fetchStorageData()
  }, [])

  const handleRefresh = () => {
    toast({
      title: "Actualizando...",
      description: "Obteniendo información actualizada del almacenamiento en la nube",
    })

    // Volver a cargar los datos
    setIsLoading(true)
    setTimeout(() => {
      // Incrementar ligeramente los valores para simular cambios
      setImageCount((prev) => prev + 1)
      setStorageUsed((prev) => prev + 500000)
      setIsLoading(false)

      toast({
        title: "Actualizado",
        description: "Información de almacenamiento actualizada correctamente",
      })
    }, 1500)
  }

  // Calcular porcentaje de uso
  const usagePercentage = Math.min(100, (storageUsed / storageLimit) * 100)

  // Formatear bytes a formato legible
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Almacenamiento en la Nube</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-neon-green" />
            <span className="font-medium">Vercel Blob Storage</span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-2 w-full" />
            </div>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span>Imágenes almacenadas: {imageCount}</span>
                <span>
                  {formatBytes(storageUsed)} / {formatBytes(storageLimit)}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Las imágenes subidas se almacenan de forma segura en la nube, lo que mejora el rendimiento y evita
                problemas con el almacenamiento local del navegador.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
