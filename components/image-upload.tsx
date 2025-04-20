"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Upload, X, LinkIcon } from "lucide-react"
import { convertGoogleDriveUrl } from "@/lib/utils"

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  label?: string
  className?: string
  defaultImage?: string
}

export function ImageUpload({
  onImageUploaded,
  label = "Imagen",
  className = "",
  defaultImage = "",
}: ImageUploadProps) {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(defaultImage ? convertGoogleDriveUrl(defaultImage) : "")
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar los 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Crear vista previa
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
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al subir la imagen")
      }

      const data = await response.json()
      onImageUploaded(data.url)
    } catch (err) {
      console.error("Error al subir imagen:", err)
      setError("Error al subir la imagen. Por favor, intenta de nuevo.")
      setPreview("")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview("")
    setUrlInput("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onImageUploaded("")
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) {
      setError("Por favor, ingresa una URL válida")
      return
    }

    setError(null)
    try {
      const convertedUrl = convertGoogleDriveUrl(urlInput)
      setPreview(convertedUrl)
      onImageUploaded(urlInput) // Guardamos la URL original, no la convertida
    } catch (err) {
      console.error("Error al procesar la URL:", err)
      setError("URL inválida. Por favor, verifica e intenta de nuevo.")
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={`upload-${label}`}>{label}</Label>

      {preview ? (
        <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          <Image
            src={preview || "/placeholder.svg"}
            alt={`Vista previa de ${label}`}
            fill
            className="object-contain"
            unoptimized={preview.startsWith("https://drive.google.com")}
            onError={() => {
              setError("Error al cargar la imagen. Verifica la URL e intenta de nuevo.")
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
        <>
          {showUrlInput ? (
            <form onSubmit={handleUrlSubmit} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Pega la URL de Google Drive aquí"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button type="submit" size="sm">
                  Usar URL
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowUrlInput(false)}
                className="w-full"
              >
                Volver a subir archivo
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500">Subiendo imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500">Haz clic para seleccionar una imagen</p>
                </div>
              )}
              <Input
                id={`upload-${label}`}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          )}
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {!preview && !isUploading && !showUrlInput && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar archivo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setShowUrlInput(true)}
            disabled={isUploading}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Usar URL
          </Button>
        </div>
      )}
    </div>
  )
}
