"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function ImageUploadField({ id, label, value, onChange, className = "" }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string>(value || "")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must not exceed 2MB")
      return
    }

    setError(null)

    // Create preview with size limitation
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string

      // If the image is too large, compress it by creating a smaller version
      if (result.length > 500000) {
        // 500KB threshold
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          // Calculate new dimensions (reduce to 50% if too large)
          const maxWidth = 800
          const maxHeight = 800
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round(height * (maxWidth / width))
              width = maxWidth
            } else {
              width = Math.round(width * (maxHeight / height))
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          // Get compressed image as data URL with reduced quality
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7)
          setPreview(compressedDataUrl)
          onChange(compressedDataUrl)
        }
        img.src = result
      } else {
        // If image is small enough, use it directly
        setPreview(result)
        onChange(result)
      }
    }
    reader.readAsDataURL(file)
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
            alt={`Preview of ${label}`}
            fill
            className="object-contain"
            onError={() => {
              setError("Error loading image. Please check the URL and try again.")
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
          <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
          <p className="text-xs text-muted-foreground mt-1">Maximum file size: 5MB</p>
          <Input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
