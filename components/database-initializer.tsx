"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Database, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export function DatabaseInitializer() {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const createChecklistTable = async () => {
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
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar a Supabase. Verifica tu conexión e inténtalo de nuevo.",
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }

      // Intentar crear la tabla usando nuestra API
      const response = await fetch("/api/create-tables", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Ahora intentemos crear las políticas de seguridad
        await setupSecurityPolicies()

        setStatus("success")
        setMessage("Tabla checklist_items creada y configurada correctamente")
        toast({
          title: "Éxito",
          description: "La tabla checklist_items se ha creado correctamente en Supabase",
        })
      } else {
        setStatus("error")
        setMessage("Error al crear tabla: " + data.error)
        toast({
          title: "Error",
          description: data.error || "No se pudo crear la tabla en Supabase",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating table:", error)
      setStatus("error")
      setMessage("Error al crear tabla: " + (error instanceof Error ? error.message : String(error)))
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const setupSecurityPolicies = async () => {
    try {
      // Habilitar RLS en la tabla
      await supabase.rpc("enable_rls", { table: "checklist_items" }).catch((err) => {
        console.log("Error enabling RLS, might already be enabled:", err)
      })

      // Crear políticas de seguridad
      const policies = [
        {
          name: "Users can view their own checklist items",
          definition: "(auth.uid()::text = user_id OR user_id = 'default-user-id')",
          operation: "SELECT",
        },
        {
          name: "Users can insert their own checklist items",
          definition: "(auth.uid()::text = user_id OR user_id = 'default-user-id')",
          operation: "INSERT",
        },
        {
          name: "Users can update their own checklist items",
          definition: "(auth.uid()::text = user_id OR user_id = 'default-user-id')",
          operation: "UPDATE",
        },
        {
          name: "Users can delete their own checklist items",
          definition: "(auth.uid()::text = user_id OR user_id = 'default-user-id')",
          operation: "DELETE",
        },
      ]

      // Intentar crear cada política
      for (const policy of policies) {
        await supabase
          .rpc("create_policy", {
            table_name: "checklist_items",
            policy_name: policy.name,
            definition: policy.definition,
            operation: policy.operation,
          })
          .catch((err) => {
            console.log(`Error creating policy ${policy.name}, might already exist:`, err)
          })
      }

      return true
    } catch (error) {
      console.error("Error setting up security policies:", error)
      return false
    }
  }

  // Función para verificar si la tabla existe
  const checkTableExists = async () => {
    try {
      const { error } = await supabase.from("checklist_items").select("id").limit(1)
      return !error || !error.message.includes("does not exist")
    } catch (error) {
      return false
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Inicialización de Base de Datos
        </CardTitle>
        <CardDescription>Configura la tabla necesaria en Supabase para almacenar tu colección</CardDescription>
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
          Este proceso creará la tabla necesaria en tu base de datos Supabase para almacenar tu colección de figuras:
        </p>

        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <strong>checklist_items</strong>: Para almacenar tus figuras y accesorios
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mb-4">
          Nota: Este proceso es seguro de ejecutar múltiples veces. Si la tabla ya existe, no se modificará.
        </p>

        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Si encuentras errores durante la creación automática de la tabla, puedes crearla manualmente desde la
            consola de Supabase siguiendo estos pasos:
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Ve a la consola de Supabase y selecciona tu proyecto</li>
              <li>Navega a la sección "Table Editor"</li>
              <li>Crea una nueva tabla llamada "checklist_items" con los campos necesarios</li>
              <li>Habilita RLS (Row Level Security) para la tabla</li>
              <li>Crea políticas para permitir a los usuarios acceder solo a sus propios datos</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          onClick={createChecklistTable}
          disabled={isCreating}
          className="bg-neon-green text-black hover:bg-neon-green/90"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando tabla...
            </>
          ) : (
            "Crear tabla checklist_items"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
