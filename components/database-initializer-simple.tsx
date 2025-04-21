"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Database, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DatabaseInitializerSimple() {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<string | null>(null)

  const createChecklistTable = async () => {
    setIsCreating(true)
    setStatus("idle")
    setMessage("")
    setDetails(null)

    try {
      // Intentar crear la tabla usando nuestra API simplificada
      const response = await fetch("/api/create-table-simple", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Tabla checklist_items creada correctamente")
        toast({
          title: "Éxito",
          description: "La tabla checklist_items se ha creado correctamente en Supabase",
        })
      } else {
        setStatus("error")
        setMessage(data.error || "Error al crear tabla")
        setDetails(data.details || null)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Inicialización de Base de Datos (Método Simplificado)
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
            <AlertDescription>
              {message}
              {details && (
                <div className="mt-2 text-xs opacity-80">
                  <details>
                    <summary>Detalles técnicos</summary>
                    <p className="mt-1">{details}</p>
                  </details>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <p className="mb-4">
          Este método alternativo intenta crear la tabla checklist_items usando un enfoque más simple.
        </p>

        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Si encuentras errores durante la creación automática de la tabla, puedes crearla manualmente desde la
            consola de Supabase siguiendo estos pasos:
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Ve a la consola de Supabase y selecciona tu proyecto</li>
              <li>Navega a la sección "SQL Editor"</li>
              <li>
                Ejecuta el siguiente SQL:
                <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-auto">
                  {`CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  franchise TEXT NOT NULL,
  brand TEXT NOT NULL,
  serie TEXT,
  year_released TEXT,
  condition TEXT,
  price NUMERIC,
  year_purchase TEXT,
  upc TEXT,
  logo TEXT,
  photo TEXT,
  tagline TEXT,
  review TEXT,
  shelf TEXT,
  display TEXT,
  ranking INTEGER,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar Row Level Security (RLS)
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Crear políticas para que los usuarios solo puedan ver y modificar sus propios items
CREATE POLICY "Users can view their own checklist items" 
  ON checklist_items FOR SELECT 
  USING (auth.uid()::text = user_id OR user_id = 'default-user-id');

CREATE POLICY "Users can insert their own checklist items" 
  ON checklist_items FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id OR user_id = 'default-user-id');

CREATE POLICY "Users can update their own checklist items" 
  ON checklist_items FOR UPDATE 
  USING (auth.uid()::text = user_id OR user_id = 'default-user-id');

CREATE POLICY "Users can delete their own checklist items" 
  ON checklist_items FOR DELETE 
  USING (auth.uid()::text = user_id OR user_id = 'default-user-id');`}
                </pre>
              </li>
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
            "Crear tabla (método alternativo)"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
