"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { migrateLocalStorageToFirestore } from "@/lib/data-migration"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DataMigrationHandler() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationComplete, setMigrationComplete] = useState(false)
  const [migrationNeeded, setMigrationNeeded] = useState(false)

  useEffect(() => {
    // Verificar si hay datos en localStorage que necesiten migración
    const hasLocalData =
      localStorage.getItem("figureItems") ||
      localStorage.getItem("wishlistItems") ||
      localStorage.getItem("customItems")

    if (hasLocalData) {
      setMigrationNeeded(true)
    }
  }, [])

  const handleMigration = async () => {
    if (!user) return

    setIsMigrating(true)
    try {
      const count = await migrateLocalStorageToFirestore(user.uid)

      setMigrationComplete(true)
      setMigrationNeeded(false)

      toast({
        title: "Migración completada",
        description: `Se han migrado ${count} elementos a la base de datos.`,
      })
    } catch (error) {
      console.error("Error en la migración:", error)
      toast({
        title: "Error en la migración",
        description: "No se pudieron migrar los datos. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  if (!migrationNeeded || migrationComplete || !user) {
    return null
  }

  return (
    <Alert className="mb-4">
      <AlertTitle>Datos locales detectados</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Se han detectado datos guardados en tu navegador. Para evitar perderlos, puedes migrarlos a nuestra base de
          datos en la nube.
        </p>
        <Button onClick={handleMigration} disabled={isMigrating} className="mt-2">
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrando datos...
            </>
          ) : (
            "Migrar datos ahora"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
