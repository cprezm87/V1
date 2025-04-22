"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export function DatabaseConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    setIsLoading(true)
    try {
      // Añadir un timeout para evitar que la solicitud se quede colgada
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos de timeout

      const response = await fetch("/api/db-status", {
        signal: controller.signal,
      }).catch((err) => {
        if (err.name === "AbortError") {
          throw new Error("Request timeout: Database connection took too long")
        }
        throw err
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setIsConnected(data.connected)
      setError(data.error)
    } catch (error) {
      console.error("Error checking database connection:", error)
      setIsConnected(false)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (isLoading && isConnected === null) {
    return (
      <Alert className="mb-4 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <AlertCircle className="h-4 w-4 text-gray-500" />
        <AlertTitle>Checking database connection...</AlertTitle>
        <AlertDescription>Verifying connection to Neon database...</AlertDescription>
      </Alert>
    )
  }

  if (isConnected) {
    return (
      <Alert className="mb-4 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Database connected</AlertTitle>
        <AlertDescription>
          Successfully connected to Neon database. Your data will be saved both locally and in the cloud.
        </AlertDescription>
      </Alert>
    )
  }

  // Si hay un error, mostrar un mensaje más amigable
  if (!isConnected && (error || isConnected === false)) {
    return (
      <Alert className="mb-4 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Database connection unavailable</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <span>Your data will be saved locally only. Database features will be limited.</span>
          <Button variant="outline" size="sm" onClick={checkConnection} disabled={isLoading} className="w-fit">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Si no hay información sobre la conexión, no mostrar nada
  return null
}
