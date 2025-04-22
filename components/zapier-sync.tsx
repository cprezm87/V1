"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { sendItemToZapier, bulkSendToZapier, type FigureData, type SyncResult } from "@/lib/zapier-service"
import { Badge } from "@/components/ui/badge"

interface ZapierSyncProps {
  items: FigureData[]
  title?: string
  description?: string
  onSyncComplete?: (result: SyncResult) => void
}

export function ZapierSync({
  items,
  title = "Sincronización con Zapier",
  description = "Envía tus datos de colección a otros servicios a través de Zapier",
  onSyncComplete,
}: ZapierSyncProps) {
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)
  const [selectedItem, setSelectedItem] = useState<FigureData | null>(null)

  // Manejar la sincronización de un solo item
  const handleSyncItem = async (item: FigureData) => {
    setSelectedItem(item)
    setIsSyncing(true)
    setSyncProgress(0)

    try {
      // Mostrar toast de inicio
      toast({
        title: "Sincronizando...",
        description: `Enviando ${item.name} a Zapier`,
      })

      // Enviar a Zapier
      const result = await sendItemToZapier(item)
      setLastSyncResult(result)

      // Notificar resultado
      if (result.success) {
        toast({
          title: "Sincronización completada",
          description: `${item.name} ha sido enviado correctamente a Zapier`,
        })
      } else {
        toast({
          title: "Error de sincronización",
          description: result.message,
          variant: "destructive",
        })
      }

      // Callback
      if (onSyncComplete) {
        onSyncComplete(result)
      }
    } catch (error) {
      console.error("Error al sincronizar con Zapier:", error)
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al sincronizar con Zapier",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
      setSelectedItem(null)
    }
  }

  // Manejar la sincronización masiva
  const handleBulkSync = async () => {
    if (items.length === 0) {
      toast({
        title: "No hay elementos",
        description: "No hay elementos para sincronizar",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    setSyncProgress(0)

    try {
      // Mostrar toast de inicio
      toast({
        title: "Sincronización masiva iniciada",
        description: `Enviando ${items.length} elementos a Zapier`,
      })

      // Función para actualizar el progreso
      const updateProgress = (current: number, total: number) => {
        const percentage = Math.round((current / total) * 100)
        setSyncProgress(percentage)
      }

      // Enviar todos los items
      const result = await bulkSendToZapier(items, updateProgress)
      setLastSyncResult(result)

      // Notificar resultado
      if (result.success) {
        toast({
          title: "Sincronización masiva completada",
          description: result.message,
        })
      } else {
        toast({
          title: "Sincronización completada con errores",
          description: result.message,
          variant: "destructive",
        })
      }

      // Callback
      if (onSyncComplete) {
        onSyncComplete(result)
      }
    } catch (error) {
      console.error("Error en sincronización masiva:", error)
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error durante la sincronización masiva",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-neon-green">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de sincronización */}
        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {selectedItem ? `Sincronizando ${selectedItem.name}...` : `Sincronizando ${syncProgress}%`}
              </span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {/* Resultado de la última sincronización */}
        {lastSyncResult && !isSyncing && (
          <div
            className={`p-4 rounded-md ${
              lastSyncResult.success
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-2">
              {lastSyncResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {lastSyncResult.success ? "Sincronización exitosa" : "Error de sincronización"}
                </p>
                <p className="text-sm text-muted-foreground">{lastSyncResult.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Lista de elementos */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Elementos disponibles</h3>
            <Badge variant="outline">{items.length} elementos</Badge>
          </div>

          <div className="max-h-60 overflow-y-auto border rounded-md">
            {items.length > 0 ? (
              <div className="divide-y">
                {items.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 hover:bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.brand} - {item.franchise}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" disabled={isSyncing} onClick={() => handleSyncItem(item)}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Sincronizar
                    </Button>
                  </div>
                ))}
                {items.length > 5 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Y {items.length - 5} elementos más...
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">No hay elementos para sincronizar</div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-neon-green text-black hover:bg-neon-green/90"
          disabled={isSyncing || items.length === 0}
          onClick={handleBulkSync}
        >
          {isSyncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sincronizar todos los elementos
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
