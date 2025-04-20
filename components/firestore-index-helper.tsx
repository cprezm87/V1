"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink } from "lucide-react"
import { useState } from "react"

interface FirestoreIndexHelperProps {
  error: string | null
}

export function FirestoreIndexHelper({ error }: FirestoreIndexHelperProps) {
  const [expanded, setExpanded] = useState(false)

  if (!error || !error.includes("index")) return null

  // Extraer la URL del índice del mensaje de error
  const indexUrlMatch = error.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
  const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error de índice en Firestore</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Firestore requiere un índice para esta consulta. Este es un paso normal al configurar consultas complejas.
        </p>

        {expanded && (
          <div className="mb-2 space-y-2 text-sm">
            <p>Para resolver este problema:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Haz clic en el botón "Crear índice" a continuación</li>
              <li>Inicia sesión en tu cuenta de Firebase si es necesario</li>
              <li>En la consola de Firebase, haz clic en "Crear índice"</li>
              <li>Espera unos minutos a que el índice se active</li>
              <li>Vuelve a cargar esta página</li>
            </ol>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Menos detalles" : "Más detalles"}
          </Button>

          {indexUrl && (
            <Button
              variant="default"
              size="sm"
              onClick={() => window.open(indexUrl, "_blank")}
              className="flex items-center gap-1"
            >
              Crear índice <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
