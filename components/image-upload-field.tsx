"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploadFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUploadField({ id, label, value, onChange, className = "" }: ImageUploadFieldProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [preview, setPreview] = useState<string>(value || "")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // No hay límite de tamaño máximo

    setError(null)
    setIsUploading(true)

    try {
      // Crear vista previa temporal mientras se sube
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Preparar FormData para la carga
      const formData = new FormData()
      formData.append("file", file)

      // Subir a través de nuestra API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          // Usar el ID del usuario directamente si está disponible
          ...(user?.uid ? { "X-User-ID": user.uid } : {}),
        },
      })

      if (!response.ok) {
        throw new Error("Error al subir la imagen")
      }

      const data = await response.json()

      // Actualizar con la URL de la imagen en la nube
      setPreview(data.url)
      onChange(data.url)

      toast({
        title: "Image uploaded",
        description: "The image has been successfully uploaded to the cloud",
      })
    } catch (err) {
      console.error("Error al subir imagen:", err)
      setError("Error uploading image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>

      {preview ? (
        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          <Image
            src={preview || "/placeholder.svg"}
            alt={`Vista previa de ${label}`}
            fill
            className="object-contain"
            onError={() => {
              setError("Error loading image. Please verify the URL and try again.")
              setPreview("")
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:border-neon-green"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
              <p className="text-sm text-muted-foreground">Uploading image to cloud...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
              <p className="text-xs text-muted-foreground mt-1">No size limit</p>
            </>
          )}
          <Input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
