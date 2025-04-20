"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LinkPreviewProps {
  url: string
  width?: string
  height?: number
}

export function LinkPreview({ url, width = "100%", height = 300 }: LinkPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  useEffect(() => {
    // En un entorno real, esto se haría con una API de vista previa de enlaces
    // Aquí simulamos la carga de datos
    const timeout = setTimeout(() => {
      setTitle(url.split("//")[1].split("/")[0])
      setDescription(`Vista previa de ${url}`)
      setImage("/placeholder.svg?height=200&width=300")
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [url])

  return (
    <Card className="overflow-hidden" style={{ width }}>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        ) : (
          <div>
            <div className="relative h-[200px] w-full">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
