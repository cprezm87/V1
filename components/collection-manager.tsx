"use client"

import type React from "react"

import { useState } from "react"
import { useCollection } from "@/contexts/collection-context"
import { useAuth } from "@/contexts/auth-context"
import type { CollectionItem } from "@/types/collection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "./image-upload"
import Image from "next/image"
import { convertGoogleDriveUrl } from "@/lib/utils"

export function CollectionManager() {
  const { user } = useAuth()
  const { items, loading, addNewItem, updateExistingItem, removeItem, refreshItems } = useCollection()
  const [formData, setFormData] = useState<Partial<CollectionItem>>({
    name: "",
    brand: "",
    category: "",
    series: "",
    price: undefined,
    inCollection: true,
    inWishlist: false,
    isCustom: false,
    imageUrl: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      if (!formData.name || !formData.brand || !formData.category) {
        toast({
          title: "Error",
          description: "Por favor completa los campos requeridos",
          variant: "destructive",
        })
        return
      }

      const newItem: CollectionItem = {
        ...(formData as CollectionItem),
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await addNewItem(newItem)
      toast({
        title: "Éxito",
        description: "Item añadido correctamente",
      })

      // Limpiar formulario
      setFormData({
        name: "",
        brand: "",
        category: "",
        series: "",
        price: undefined,
        inCollection: true,
        inWishlist: false,
        isCustom: false,
        imageUrl: "",
      })
    } catch (error) {
      console.error("Error al añadir item:", error)
      toast({
        title: "Error",
        description: "No se pudo añadir el item",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return

    try {
      await removeItem(id)
      toast({
        title: "Éxito",
        description: "Item eliminado correctamente",
      })
    } catch (error) {
      console.error("Error al eliminar item:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el item",
        variant: "destructive",
      })
    }
  }

  const handleFilter = async (filter: string) => {
    let filterObj = {}

    switch (filter) {
      case "collection":
        filterObj = { inCollection: true }
        break
      case "wishlist":
        filterObj = { inWishlist: true }
        break
      case "customs":
        filterObj = { isCustom: true }
        break
      default:
        filterObj = {}
    }

    await refreshItems(filterObj)
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acceso Restringido</CardTitle>
          <CardDescription>Debes iniciar sesión para gestionar tu colección</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nuevo Item</CardTitle>
          <CardDescription>Completa el formulario para añadir un nuevo item a tu colección</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select onValueChange={(value) => handleSelectChange("category", value)} value={formData.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action-figures">Action Figures</SelectItem>
                    <SelectItem value="statues">Estatuas</SelectItem>
                    <SelectItem value="funko-pop">Funko Pop</SelectItem>
                    <SelectItem value="hot-toys">Hot Toys</SelectItem>
                    <SelectItem value="other">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="series">Serie</Label>
                <Input id="series" name="series" value={formData.series} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" name="price" type="number" value={formData.price || ""} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea id="notes" name="notes" value={formData.notes || ""} onChange={handleChange} />
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  label="Imagen del Item"
                  defaultImage={formData.imageUrl || ""}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inCollection"
                  checked={formData.inCollection}
                  onCheckedChange={(checked) => handleCheckboxChange("inCollection", checked as boolean)}
                />
                <Label htmlFor="inCollection">En mi colección</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inWishlist"
                  checked={formData.inWishlist}
                  onCheckedChange={(checked) => handleCheckboxChange("inWishlist", checked as boolean)}
                />
                <Label htmlFor="inWishlist">En mi lista de deseos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCustom"
                  checked={formData.isCustom}
                  onCheckedChange={(checked) => handleCheckboxChange("isCustom", checked as boolean)}
                />
                <Label htmlFor="isCustom">Es un custom</Label>
              </div>
            </div>

            <Button type="submit">Añadir Item</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mi Colección</CardTitle>
          <CardDescription>Gestiona los items de tu colección</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" onClick={() => handleFilter("all")}>
                Todos
              </TabsTrigger>
              <TabsTrigger value="collection" onClick={() => handleFilter("collection")}>
                Colección
              </TabsTrigger>
              <TabsTrigger value="wishlist" onClick={() => handleFilter("wishlist")}>
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="customs" onClick={() => handleFilter("customs")}>
                Customs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <p>Cargando items...</p>
              ) : items.length === 0 ? (
                <p>No hay items en tu colección</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.brand} - {item.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {item.imageUrl && (
                          <div className="relative w-full h-40 mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                            <Image
                              src={convertGoogleDriveUrl(item.imageUrl) || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-contain"
                              unoptimized={item.imageUrl.includes("drive.google.com")}
                            />
                          </div>
                        )}
                        <p>
                          <strong>Serie:</strong> {item.series || "N/A"}
                        </p>
                        {item.price && (
                          <p>
                            <strong>Precio:</strong> ${item.price}
                          </p>
                        )}
                        {item.notes && (
                          <p>
                            <strong>Notas:</strong> {item.notes}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.inCollection && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">
                              En Colección
                            </span>
                          )}
                          {item.inWishlist && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                              En Wishlist
                            </span>
                          )}
                          {item.isCustom && (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded dark:bg-purple-900 dark:text-purple-100">
                              Custom
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                          Eliminar
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collection" className="space-y-4">
              {/* El contenido se carga dinámicamente con el filtro */}
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-4">
              {/* El contenido se carga dinámicamente con el filtro */}
            </TabsContent>

            <TabsContent value="customs" className="space-y-4">
              {/* El contenido se carga dinámicamente con el filtro */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
