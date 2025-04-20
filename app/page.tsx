"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search collection..." className="pl-8" />
        </div>
      </div>

      {/* Main Collection Sections */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {/* Recent Additions Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">Recent Additions</h3>
          <p className="text-muted-foreground mb-4">Latest figures added to your collection</p>

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
                    <p className="text-sm text-muted-foreground">Added recently</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No recent additions yet.</p>
            )}
          </div>
        </Card>

        {/* Upcoming Releases Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">Upcoming Releases</h3>
          <p className="text-muted-foreground mb-4">Horror figures coming soon</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt="Art the Clown" width={64} height={64} />
              </div>
              <div>
                <h4 className="font-medium">Art the Clown (NECA)</h4>
                <p className="text-sm text-muted-foreground">Releases in 2 weeks</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-md overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt="The Nun" width={64} height={64} />
              </div>
              <div>
                <h4 className="font-medium">The Nun (McFarlane)</h4>
                <p className="text-sm text-muted-foreground">Releases in 1 month</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Favorite Items Column */}
        <Card className="bg-[#111] p-6">
          <h3 className="text-2xl font-bold mb-1">Favorite Items</h3>
          <p className="text-muted-foreground mb-4">Your top-rated items</p>

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
                    <p className="text-sm text-muted-foreground">5-star rating</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-center">
                <p className="text-muted-foreground">
                  No favorite items yet. Rate your items with 5 stars to see them here.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Figure News Section */}
      <section className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-neon-green">Figure News</h3>
        <Tabs defaultValue="toyark">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="toyark" className="whitespace-nowrap">
              The Toyark
            </TabsTrigger>
            <TabsTrigger value="fwoosh" className="whitespace-nowrap">
              The Fwoosh
            </TabsTrigger>
            <TabsTrigger value="toynewsi" className="whitespace-nowrap">
              Toy News International
            </TabsTrigger>
            <TabsTrigger value="afi" className="whitespace-nowrap">
              Action Figure Insider
            </TabsTrigger>
          </TabsList>
          <TabsContent value="toyark" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link href="https://www.toyark.com/" target="_blank" className="text-neon-green hover:underline">
                    www.toyark.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`toyark-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">News Article {i}</h4>
                        <p className="text-sm text-muted-foreground">Latest action figure news and reviews</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fwoosh" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link href="https://thefwoosh.com/" target="_blank" className="text-neon-green hover:underline">
                    thefwoosh.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`fwoosh-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">News Article {i}</h4>
                        <p className="text-sm text-muted-foreground">Action figure news and community</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="toynewsi" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link href="https://toynewsi.com/" target="_blank" className="text-neon-green hover:underline">
                    toynewsi.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`toynewsi-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">News Article {i}</h4>
                        <p className="text-sm text-muted-foreground">International toy and collectible news</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="afi" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link
                    href="https://www.actionfigureinsider.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    www.actionfigureinsider.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`afi-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">News Article {i}</h4>
                        <p className="text-sm text-muted-foreground">Insider news on action figures</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Figure Brands Section */}
      <section className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-neon-green">Figure Brands</h3>
        <Tabs defaultValue="neca">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="neca" className="whitespace-nowrap">
              NECA
            </TabsTrigger>
            <TabsTrigger value="tot" className="whitespace-nowrap">
              Trick or Treat Studios
            </TabsTrigger>
            <TabsTrigger value="mcfarlane" className="whitespace-nowrap">
              McFarlane Toys
            </TabsTrigger>
            <TabsTrigger value="diamond" className="whitespace-nowrap">
              Diamond Select
            </TabsTrigger>
            <TabsTrigger value="syndicate" className="whitespace-nowrap">
              Syndicate Collectibles
            </TabsTrigger>
            <TabsTrigger value="funko" className="whitespace-nowrap">
              Funko
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neca" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Visit{" "}
                  <Link href="https://necaonline.com/" target="_blank" className="text-neon-green hover:underline">
                    necaonline.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`neca-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">Featured Product {i}</h4>
                        <p className="text-sm text-muted-foreground">High-quality collectible figures</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido similar para las otras pestañas */}
        </Tabs>
      </section>

      {/* Figure Stores Section */}
      <section className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-neon-green">Figure Stores</h3>
        <Tabs defaultValue="alltimetoys">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="alltimetoys" className="whitespace-nowrap">
              All Time Toys
            </TabsTrigger>
            <TabsTrigger value="andystoy" className="whitespace-nowrap">
              Andy's Toy Chest
            </TabsTrigger>
            <TabsTrigger value="lasttoy" className="whitespace-nowrap">
              The Last Toy Store
            </TabsTrigger>
            <TabsTrigger value="amoktime" className="whitespace-nowrap">
              Amok Time
            </TabsTrigger>
            <TabsTrigger value="roguetoys" className="whitespace-nowrap">
              Rogue Toys
            </TabsTrigger>
            <TabsTrigger value="ebay" className="whitespace-nowrap">
              eBay
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alltimetoys" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Shop at{" "}
                  <Link href="https://alltimetoys.com/" target="_blank" className="text-neon-green hover:underline">
                    alltimetoys.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {[1, 2].map((i) => (
                    <Card key={`alltimetoys-${i}`} className="overflow-hidden">
                      <CardContent className="p-4">
                        <h4 className="font-medium">Featured Item {i}</h4>
                        <p className="text-sm text-muted-foreground">Wide selection of collectible figures</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido similar para las otras pestañas */}
        </Tabs>
      </section>
    </div>
  )
}
