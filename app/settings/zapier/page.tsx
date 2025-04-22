"use client"

import { useState, useEffect } from "react"
import { ZapierSync } from "@/components/zapier-sync"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import type { FigureData } from "@/lib/zapier-service"

export default function ZapierIntegrationPage() {
  const { toast } = useToast()
  const [figureItems, setFigureItems] = useState<FigureData[]>([])
  const [wishlistItems, setWishlistItems] = useState<FigureData[]>([])
  const [customItems, setCustomItems] = useState<FigureData[]>([])
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.zapier.com/hooks/catch/22623944/2xlyjjw/")
  const [isConfigured, setIsConfigured] = useState(true)

  // Cargar datos del localStorage
  useEffect(() => {
    try {
      // Cargar figuras
      const storedFigures = localStorage.getItem("figureItems")
      if (storedFigures) {
        setFigureItems(JSON.parse(storedFigures))
      }

      // Cargar wishlist
      const storedWishlist = localStorage.getItem("wishlistItems")
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist))
      }

      // Cargar customs
      const storedCustoms = localStorage.getItem("customItems")
      if (storedCustoms) {
        setCustomItems(JSON.parse(storedCustoms))
      }

      // Cargar configuración de Zapier
      const storedWebhookUrl = localStorage.getItem("zapierWebhookUrl")
      if (storedWebhookUrl) {
        setWebhookUrl(storedWebhookUrl)
      }
    } catch (error) {
      console.error("Error al cargar datos:", error)
    }
  }, [])

  // Guardar configuración de Zapier
  const handleSaveConfig = () => {
    try {
      localStorage.setItem("zapierWebhookUrl", webhookUrl)
      setIsConfigured(true)
      toast({
        title: "Configuración guardada",
        description: "La URL del webhook de Zapier ha sido guardada correctamente",
      })
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integración con Zapier</h1>
        <p className="text-muted-foreground mt-2">Conecta tu colección con otros servicios a través de Zapier</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Configuración</CardTitle>
            <CardDescription>Configura la integración con Zapier para sincronizar tu colección</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL del Webhook de Zapier</Label>
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
              />
              <p className="text-xs text-muted-foreground">
                Puedes encontrar esta URL en tu Zap después de configurar el trigger "Catch Hook"
              </p>
            </div>

            <Button
              className="w-full bg-neon-green text-black hover:bg-neon-green/90"
              onClick={handleSaveConfig}
              disabled={!webhookUrl.trim().startsWith("https://hooks.zapier.com/")}
            >
              Guardar configuración
            </Button>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Para usar esta integración, necesitas crear un Zap en Zapier con el trigger "Catch Hook".
                <Link
                  href="https://zapier.com/apps/webhook/integrations"
                  target="_blank"
                  className="flex items-center text-neon-green hover:underline mt-2"
                >
                  Ir a Zapier <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Guía rápida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Guía rápida</CardTitle>
            <CardDescription>Cómo configurar la integración con Zapier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">1. Crear un Zap en Zapier</h3>
              <p className="text-sm text-muted-foreground">
                Inicia sesión en Zapier y crea un nuevo Zap con el trigger "Catch Hook"
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">2. Copiar la URL del Webhook</h3>
              <p className="text-sm text-muted-foreground">
                Zapier te proporcionará una URL única para tu webhook. Cópiala y pégala en la configuración
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">3. Configurar las acciones</h3>
              <p className="text-sm text-muted-foreground">
                Configura las acciones que deseas realizar con los datos de tu colección (Google Sheets, Airtable, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">4. Sincronizar tus datos</h3>
              <p className="text-sm text-muted-foreground">
                Usa las opciones de sincronización para enviar tus datos a Zapier
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isConfigured && (
        <div className="mt-8">
          <Tabs defaultValue="figures">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="figures" className="flex-1">
                Figuras
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex-1">
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="customs" className="flex-1">
                Customs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="figures">
              <ZapierSync
                items={figureItems}
                title="Sincronizar Figuras"
                description="Envía tus figuras a otros servicios a través de Zapier"
              />
            </TabsContent>

            <TabsContent value="wishlist">
              <ZapierSync
                items={wishlistItems}
                title="Sincronizar Wishlist"
                description="Envía tu lista de deseos a otros servicios a través de Zapier"
              />
            </TabsContent>

            <TabsContent value="customs">
              <ZapierSync
                items={customItems}
                title="Sincronizar Customs"
                description="Envía tus customs a otros servicios a través de Zapier"
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
