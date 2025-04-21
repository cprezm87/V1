"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database } from "lucide-react"
import { useCollection } from "@/contexts/collection-context"
import { useRouter } from "next/navigation"

export function DatabaseStatus() {
  const { isDatabaseInitialized, checkDatabaseInitialization } = useCollection()
  const [checked, setChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkDatabase = async () => {
      await checkDatabaseInitialization()
      setChecked(true)
    }

    checkDatabase()
  }, [checkDatabaseInitialization])

  if (isDatabaseInitialized || !checked) {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4 bg-amber-500/20 border-amber-500">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-500">Base de datos no inicializada</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          Para aprovechar todas las funcionalidades de la aplicación, necesitas inicializar la base de datos en
          Supabase.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-fit border-amber-500 text-amber-500 hover:bg-amber-500/20"
          onClick={() => router.push("/settings?tab=database")}
        >
          <Database className="mr-2 h-4 w-4" />
          Configurar base de datos
        </Button>
      </AlertDescription>
    </Alert>
  )
}
