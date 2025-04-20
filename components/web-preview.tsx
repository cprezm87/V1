"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface WebPreviewProps {
  url: string
  title: string
  description?: string
  imageUrl?: string
  height?: number
  showControls?: boolean
}

export function WebPreview({ url, title, description, imageUrl, height = 400, showControls = true }: WebPreviewProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { t } = useTheme()

  // Sanitize URL to ensure it has http/https
  const sanitizeUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`
    }
    return url
  }

  const sanitizedUrl = sanitizeUrl(url)

  useEffect(() => {
    // Reset states when URL changes
    setLoading(true)
    setError(false)

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [url])

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {showControls && (
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-background/80 p-2 backdrop-blur-sm">
            <div className="truncate text-sm font-medium">{title}</div>
            <a
              href={sanitizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-neon-green text-black hover:bg-neon-green/90"
            >
              <ExternalLink size={12} />
              <span className="sr-only">{t("preview.openInNewTab")}</span>
            </a>
          </div>
        )}

        {loading ? (
          <div className="flex h-[400px] w-full items-center justify-center bg-muted/30">
            <Skeleton className="h-[80%] w-[90%]" />
          </div>
        ) : error || !url ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center bg-muted/30 p-4 text-center">
            <Image
              src={imageUrl || "/placeholder.svg?height=200&width=300"}
              alt={title}
              width={300}
              height={200}
              className="mb-4 rounded-md object-cover"
            />
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            <a
              href={sanitizedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center rounded-md bg-neon-green px-3 py-1 text-sm text-black hover:bg-neon-green/90"
            >
              {t("preview.visitWebsite")} <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        ) : (
          <div className="relative h-[400px] w-full">
            <iframe
              src={sanitizedUrl}
              title={title}
              className="absolute inset-0 h-full w-full border-0"
              style={{ height }}
              onError={() => setError(true)}
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
      {!loading && !error && description && (
        <CardContent className="p-3">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  )
}
