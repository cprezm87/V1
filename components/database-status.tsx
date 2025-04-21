"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export function DatabaseStatus() {
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkTableStatus()
  }, [])

  const checkTableStatus = async () => {
    setIsChecking(true)
    try {
      const { error } = await supabase.from("checklist_items").select("id").limit(1)
      setTableExists(!error || !error.message.includes("does not exist"))
    } catch (error) {
      setTableExists(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking || tableExists === null) {
    return null // No mostrar nada mientras se verifica
  }

  if (!tableExists) {
    return (
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Configuración de base de datos requerida</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            La tabla para almacenar tu colección no está configurada. Por favor, configura la base de datos antes de
            continuar.
          </p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/settings?tab=database">
              <Database className="mr-2 h-4 w-4" />
              Configurar base de datos
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null // No mostrar nada si la tabla existe
}
