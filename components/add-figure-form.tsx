"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCollection } from "@/contexts/collection-context"
import { useAuth } from "@/contexts/auth-context"
import type { FigureItem } from "@/lib/supabase"

export function AddFigureForm() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { addFigureItem } = useCollection()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FigureItem>({
    name: "",
    franchise: "",
    brand: "",
    serie: "",
    year_released: "",
    price: "",
    year_purchase: "",
    tagline: "",
    review: "",
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

      if (!formData.name || !formData.franchise || !formData.brand) {
        toast({
          title: "Error",
          description: "Por favor completa los campos requeridos",
          variant: "destructive",
        })
        return
      }

      await addFigureItem(formData)

      toast({
        title: "¡Éxito!",
        description: "Item añadido correctamente a tu colección",
      })

      // Limpiar formulario
      setFormData({
        name: "",
        franchise: "",
        brand: "",
        serie: "",
        year_released: "",
        price: "",
        year_purchase: "",
        tagline: "",
        review: "",
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
          <Label htmlFor="brand">Marca *</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serie">Serie</Label>
          <Input id="serie" name="serie" value={formData.serie} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_released">Año de Lanzamiento</Label>
          <Input
            id="year_released"
            name="year_released"
            type="number"
            placeholder="YYYY"
            min="1900"
            max="2100"
            value={formData.year_released}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio (COP)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="Precio en COP"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year_purchase">Año de Compra</Label>
          <Input
            id="year_purchase"
            name="year_purchase"
            type="number"
            placeholder="YYYY"
            min="1900"
            max="2100"
            value={formData.year_purchase}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" placeholder="Tagline" value={formData.tagline} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review">Review URL</Label>
        <Input id="review" name="review" placeholder="URL de YouTube" value={formData.review} onChange={handleChange} />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90" disabled={isSubmitting}>
          {isSubmitting ? "Añadiendo..." : "Añadir a Checklist"}
        </Button>
      </div>
    </form>
  )
}
