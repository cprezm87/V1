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
        return
      }

      // Script SQL para crear la tabla checklist_items
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS checklist_items (
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
        
        -- Crear índice para mejorar el rendimiento
        CREATE INDEX IF NOT EXISTS checklist_items_user_id_idx ON checklist_items(user_id);
        
        -- Configurar Row Level Security (RLS)
        ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
        
        -- Crear políticas para que los usuarios solo puedan ver y modificar sus propios items
        DROP POLICY IF EXISTS "Users can view their own checklist items" ON checklist_items;
        CREATE POLICY "Users can view their own checklist items" 
          ON checklist_items FOR SELECT 
          USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
        
        DROP POLICY IF EXISTS "Users can insert their own checklist items" ON checklist_items;
        CREATE POLICY "Users can insert their own checklist items" 
          ON checklist_items FOR INSERT 
          WITH CHECK (auth.uid()::text = user_id OR user_id = 'default-user-id');
        
        DROP POLICY IF EXISTS "Users can update their own checklist items" ON checklist_items;
        CREATE POLICY "Users can update their own checklist items" 
          ON checklist_items FOR UPDATE 
          USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
        
        DROP POLICY IF EXISTS "Users can delete their own checklist items" ON checklist_items;
        CREATE POLICY "Users can delete their own checklist items" 
          ON checklist_items FOR DELETE 
          USING (auth.uid()::text = user_id OR user_id = 'default-user-id');
      `

      // Ejecutar el script SQL
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql: createTableSQL }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Tabla checklist_items creada correctamente")
        toast({
          title: "Éxito",
          description: "La tabla checklist_items se ha creado correctamente en Supabase",
        })
      } else {
        setStatus("error")
        setMessage("Error al crear tabla: " + data.error)
        toast({
          title: "Error",
          description: "No se pudo crear la tabla en Supabase",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating table:", error)
      setStatus("error")
      setMessage("Error al crear tabla: " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsCreating(false)
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

        <p className="text-sm text-muted-foreground">
          Nota: Este proceso es seguro de ejecutar múltiples veces. Si la tabla ya existe, no se modificará.
        </p>
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
