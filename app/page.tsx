"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { EnhancedNewsFeed } from "@/components/enhanced-news-feed"
import { BrandNewsFeed } from "@/components/brand-news-feed"
import { StoreNewsFeed } from "@/components/store-news-feed"

interface FigureItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  condition: string
  price: string
  yearPurchase: string
  upc: string
  logo: string
  photo: string
  tagline: string
  review: string
  shelf: string
  display: string
  ranking: number
  comments: string
}

export default function Home() {
  const { t } = useTheme()
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])

  // Cargar items del localStorage
  useEffect(() => {
    const storedFigures = localStorage.getItem("figureItems")
    if (storedFigures) {
      setFigureItems(JSON.parse(storedFigures))
    }
  }, [])

  // Obtener los últimos 2 items agregados
  const recentAdditions = [...figureItems].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 2)

  // Obtener items con 5 estrellas
  const favoriteItems = figureItems.filter((item) => item.ranking === 5)

  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("nav.home")}</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collection..." className="pl-8" />
        </div>
      </div>

      {/* Main Collection Sections */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {/* Recent Additions Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">{t("home.recentAdditions")}</h3>
          <p className="text-muted-foreground mb-4">{t("home.latestFigures")}</p>

          <div className="space-y-4">
            {recentAdditions.length > 0 ? (
              recentAdditions.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={item.photo || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{t("home.addedRecently")}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">{t("home.noRecent")}</p>
            )}
          </div>
        </Card>

        {/* Upcoming Releases Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">{t("home.upcomingReleases")}</h3>
          <p className="text-muted-foreground mb-4">{t("home.horrorFigures")}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt="Art the Clown" width={64} height={64} />
              </div>
              <div>
                <h4 className="font-medium">Art the Clown (NECA)</h4>
                <p className="text-sm text-muted-foreground">
                  {t("home.releasesIn")} 2 {t("home.weeks")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt="The Nun" width={64} height={64} />
              </div>
              <div>
                <h4 className="font-medium">The Nun (McFarlane)</h4>
                <p className="text-sm text-muted-foreground">
                  {t("home.releasesIn")} 1 {t("home.month")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Favorite Items Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">{t("home.favoriteItems")}</h3>
          <p className="text-muted-foreground mb-4">{t("home.topRated")}</p>

          <div className="space-y-4">
            {favoriteItems.length > 0 ? (
              favoriteItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={item.photo || "/placeholder.svg?height=64&width=64"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{t("home.starRating")}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-center">
                <p className="text-muted-foreground">{t("home.noFavorites")}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Figure News Section */}
      <section className="mb-10">
        <EnhancedNewsFeed initialSource="fwoosh" />
      </section>

      {/* Figure Brands Section */}
      <section className="mb-10">
        <BrandNewsFeed />
      </section>

      {/* Figure Stores Section */}
      <section className="mb-10">
        <StoreNewsFeed />
      </section>
    </div>
  )
}
