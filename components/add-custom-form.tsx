"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCollection } from "@/contexts/collection-context"
import { useAuth } from "@/contexts/auth-context"
import type { CustomItem } from "@/lib/supabase"

export function AddCustomForm() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { addCustomItem } = useCollection()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CustomItem>({
    name: "",
    franchise: "",
    tagline: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setIsSubmitting(true)

      if (!formData.name || !formData.franchise) {
        toast({
          title: "Error",
          description: "Por favor completa los campos requeridos",
          variant: "destructive",
        })
        return
      }

      await addCustomItem(formData)

      toast({
        title: "¡Éxito!",
        description: "Item personalizado añadido correctamente",
      })

      // Limpiar formulario
      setFormData({
        name: "",
        franchise: "",
        tagline: "",
      })
    } catch (error) {
      console.error("Error al añadir item:", error)
      toast({
        title: "Error",
        description: "No se pudo añadir el item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="franchise">Franquicia *</Label>
          <Input id="franchise" name="franchise" value={formData.franchise} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" placeholder="Tagline" value={formData.tagline} onChange={handleChange} />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90" disabled={isSubmitting}>
          {isSubmitting ? "Añadiendo..." : "Añadir Custom"}
        </Button>
      </div>
    </form>
  )
}
