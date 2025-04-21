"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export function DatabaseSetup() {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const createTables = async () => {
    setIsCreating(true)
    setStatus("idle")
    setMessage("")

    try {
      // Verificar conexión a Supabase
      const { error: pingError } = await supabase.from("checklist_items").select("id").limit(1)

      if (pingError && !pingError.message.includes("does not exist")) {
        // Error de conexión
        setStatus("error")
        setMessage("Error de conexión a Supabase: " + pingError.message)
        return
      }

      // Crear tablas
      const response = await fetch("/api/create-tables", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Tablas creadas correctamente")
        toast({
          title: "Éxito",
          description: "Las tablas se han creado correctamente en Supabase",
        })
      } else {
        setStatus("error")
        setMessage("Error al crear tablas: " + data.error)
        toast({
          title: "Error",
          description: "No se pudieron crear las tablas en Supabase",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating tables:", error)
      setStatus("error")
      setMessage("Error al crear tablas: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configuración de Base de Datos
        </CardTitle>
        <CardDescription>Configura las tablas necesarias en Supabase para almacenar tu colección</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "success" && (
          <Alert className="mb-4 bg-green-500/20 border-green-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="mb-4 bg-red-500/20 border-red-500">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <p className="mb-4">
          Este proceso creará las tablas necesarias en tu base de datos Supabase para almacenar tu colección. Las tablas
          incluirán:
        </p>

        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <strong>checklist_items</strong>: Para almacenar tus figuras y accesorios
          </li>
          <li>
            <strong>wishlist_items</strong>: Para tu lista de deseos
          </li>
          <li>
            <strong>custom_items</strong>: Para tus creaciones personalizadas
          </li>
        </ul>

        <p className="text-sm text-muted-foreground">
          Nota: Este proceso es seguro de ejecutar múltiples veces. Si las tablas ya existen, no se modificarán.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={createTables}
          disabled={isCreating}
          className="bg-neon-green text-black hover:bg-neon-green/90"
        >
          {isCreating ? "Creando tablas..." : "Crear tablas en Supabase"}
        </Button>
      </CardFooter>
    </Card>
  )
}
