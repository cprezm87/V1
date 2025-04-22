"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { WebPreview } from "@/components/web-preview"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BrandPreviewData {
  title: string
  description: string
  imageUrl: string
  url: string
}

interface BrandData {
  name: string
  url: string
  description: string
  previews: BrandPreviewData[]
}

export function BrandNewsFeed() {
  const { t } = useTheme()
  const [activeTab, setActiveTab] = useState("mezco")
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<BrandPreviewData | null>(null)
  const [brands, setBrands] = useState<Record<string, BrandData>>({
    neca: {
      name: "NECA",
      url: "https://necaonline.com/",
      description: "National Entertainment Collectibles Association - Known for high-quality horror and movie figures",
      previews: [
        {
          title: "Alien Xenomorph Warrior",
          description: "New Alien Xenomorph Warrior figure with articulated tail and jaw.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://necaonline.com/",
        },
        {
          title: "Predator Jungle Hunter",
          description: "Classic Predator Jungle Hunter figure with multiple accessories.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://store.necaonline.com/",
        },
        {
          title: "Terrifier Art the Clown",
          description: "Highly detailed Art the Clown figure from the Terrifier franchise.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://necaonline.com/collections/horror/",
        },
      ],
    },
    mezco: {
      name: "Mezco Toyz",
      url: "https://www.mezcotoyz.com/",
      description: "Premium collectible company known for their One:12 Collective line and horror figures",
      previews: [
        {
          title: "One:12 Collective Horror Figures",
          description: "Premium articulated horror figures with detailed accessories and fabric clothing.",
          imageUrl:
            "https://sjc.microlink.io/MmVSY-8UC2F4qKkv0T8Nw8bYJOuwtvWbUwZcrAJJTTp10KApkU1YnCIE5wD_PLTDsyHOFRou4DWaXw2ZfajuTA.jpeg",
          url: "https://www.mezcotoyz.com/one-12-collective",
        },
        {
          title: "Living Dead Dolls",
          description: "The iconic horror doll line featuring creepy designs and collectible packaging.",
          imageUrl:
            "https://sjc.microlink.io/MmVSY-8UC2F4qKkv0T8Nw8bYJOuwtvWbUwZcrAJJTTp10KApkU1YnCIE5wD_PLTDsyHOFRou4DWaXw2ZfajuTA.jpeg",
          url: "https://www.mezcotoyz.com/brands/living-dead-dolls",
        },
        {
          title: "5 Points Figures",
          description: "Retro-styled action figures with vintage appeal and modern collectibility.",
          imageUrl:
            "https://sjc.microlink.io/MmVSY-8UC2F4qKkv0T8Nw8bYJOuwtvWbUwZcrAJJTTp10KApkU1YnCIE5wD_PLTDsyHOFRou4DWaXw2ZfajuTA.jpeg",
          url: "https://www.mezcotoyz.com/5-points",
        },
      ],
    },
    mcfarlane: {
      name: "McFarlane Toys",
      url: "https://mcfarlane.com/",
      description: "Founded by Todd McFarlane - Known for highly detailed action figures and collectibles",
      previews: [
        {
          title: "DC Multiverse Batman",
          description: "New DC Multiverse Batman figure with multiple accessories and display base.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://mcfarlane.com/toys/batman-detective-comics-1000/",
        },
        {
          title: "Spawn Figures",
          description: "Latest Spawn figures with incredible detail and articulation.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://mcfarlane.com/toys-brands/spawn/",
        },
      ],
    },
    diamond: {
      name: "Diamond Select",
      url: "https://www.diamondselecttoys.com/",
      description: "Known for high-quality collectibles across various licenses including Marvel and horror",
      previews: [
        {
          title: "Marvel Select Figures",
          description: "Detailed Marvel Select figures with premium articulation and accessories.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.diamondselecttoys.com/marvel-select",
        },
        {
          title: "Horror Movie Gallery",
          description: "PVC dioramas featuring iconic horror movie characters.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.diamondselecttoys.com/gallery-pvc-dioramas",
        },
      ],
    },
    syndicate: {
      name: "Syndicate Collectibles",
      url: "https://www.syndicatecollectibles.com/",
      description: "Specializing in premium horror collectibles and limited edition pieces",
      previews: [
        {
          title: "Horror Icons Collection",
          description: "Premium collectible statues of classic horror movie icons.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.syndicatecollectibles.com/collections/horror",
        },
        {
          title: "Limited Edition Busts",
          description: "Hand-painted limited edition busts of horror characters.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.syndicatecollectibles.com/collections/busts",
        },
      ],
    },
    funko: {
      name: "Funko",
      url: "https://funko.com/",
      description: "Creator of the popular Pop! Vinyl figures covering thousands of licenses",
      previews: [
        {
          title: "Horror Pop! Vinyl",
          description: "Latest Pop! Vinyl figures from popular horror franchises.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://funko.com/collections/horror",
        },
        {
          title: "Exclusive Releases",
          description: "Limited edition and store exclusive Pop! figures.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://funko.com/collections/exclusives",
        },
      ],
    },
    tot: {
      name: "Trick or Treat Studios",
      url: "https://trickortreatstudios.com/",
      description: "Specializing in high-quality masks and horror collectibles",
      previews: [
        {
          title: "Michael Myers 1978",
          description: "Trick or Treat Studios' Michael Myers 1978 figure with authentic details.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://trickortreatstudios.com/licensed-designs/halloween.html",
        },
        {
          title: "Ghost Face",
          description: "Scream's Ghost Face figure with fabric costume and accessories.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://trickortreatstudios.com/licensed-designs/ghost-face.html",
        },
        {
          title: "Horror Masks",
          description: "Premium quality masks from classic and modern horror films.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://trickortreatstudios.com/masks.html",
        },
      ],
    },
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Set the first article as selected by default
      if (brands[activeTab]?.previews.length > 0) {
        setSelectedArticle(brands[activeTab].previews[0])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab, brands])

  const handleArticleSelect = (article: BrandPreviewData) => {
    setSelectedArticle(article)
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold text-neon-green">Figure Brands</h3>
      <Card>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setLoading(true)
            }}
          >
            <TabsList className="w-full justify-start overflow-x-auto bg-card border-b rounded-none">
              {Object.entries(brands).map(([key, brand]) => (
                <TabsTrigger key={key} value={key} className="rounded-none data-[state=active]:bg-background">
                  {brand.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(brands).map(([key, brand]) => (
              <TabsContent key={key} value={key} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Lista de artículos - 1/3 del ancho */}
                  <div className="border-r">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">{brand.name}</h3>
                      <p className="text-sm text-muted-foreground">{brand.description}</p>
                      <div className="mt-2">
                        <Link
                          href={brand.url}
                          target="_blank"
                          className="text-neon-green hover:underline text-sm flex items-center"
                        >
                          {t("preview.visit")} {brand.name} <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                    <div className="divide-y">
                      {loading
                        ? // Skeleton loading state
                          Array(3)
                            .fill(0)
                            .map((_, i) => (
                              <div key={i} className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mt-1" />
                              </div>
                            ))
                        : // Actual content
                          brand.previews.map((article, i) => (
                            <div
                              key={i}
                              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedArticle?.title === article.title
                                  ? "border-l-4 border-neon-green bg-muted/50"
                                  : ""
                              }`}
                              onClick={() => handleArticleSelect(article)}
                            >
                              <h4 className="font-medium">{article.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Contenido del artículo - 2/3 del ancho */}
                  <div className="md:col-span-2 p-6">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ) : selectedArticle ? (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
                        <div className="mb-6">
                          <WebPreview
                            url={selectedArticle.url}
                            title={selectedArticle.title}
                            description={selectedArticle.description}
                            imageUrl={selectedArticle.imageUrl}
                            height={400}
                          />
                        </div>
                        <p className="mb-4">{selectedArticle.description}</p>
                        <Button asChild className="bg-neon-green text-black hover:bg-neon-green/90">
                          <Link href={selectedArticle.url} target="_blank">
                            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Select an article to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
