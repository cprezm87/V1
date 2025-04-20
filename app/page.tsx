"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WebPreview } from "@/components/web-preview"
import { LinkPreview } from "@dhaiwat10/react-link-preview"
import { useTheme } from "@/contexts/theme-context"

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

interface WebPreviewData {
  title: string
  description: string
  imageUrl: string
  url: string
}

export default function Home() {
  const { t } = useTheme()
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])

  // News sites
  const [toyarkPreviews, setToyarkPreviews] = useState<WebPreviewData[]>([
    {
      title: "NECA Reveals New Alien Figure",
      description: "NECA has revealed a new Alien figure based on the classic 1979 film.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.toyark.com/",
    },
    {
      title: "McFarlane Toys Announces New DC Multiverse Figures",
      description: "McFarlane Toys has announced new DC Multiverse figures coming this fall.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.toyark.com/news/toy-news-on-the-toyark-198/",
    },
  ])
  const [fwooshPreviews, setFwooshPreviews] = useState<WebPreviewData[]>([
    {
      title: "The Fwoosh Reviews: NECA Predator",
      description: "Check out our review of the latest NECA Predator figure.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://thefwoosh.com/",
    },
    {
      title: "Toy Fair 2025 Coverage",
      description: "Our comprehensive coverage of Toy Fair 2025.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://thefwoosh.com/category/reviews/",
    },
  ])
  const [toynewsiPreviews, setToynewsiPreviews] = useState<WebPreviewData[]>([
    {
      title: "Hasbro Pulse Con 2025 Announced",
      description: "Hasbro has announced Pulse Con 2025 dates and initial lineup.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://toynewsi.com/",
    },
    {
      title: "Super7 Reveals New TMNT Ultimates Figures",
      description: "Super7 has revealed new TMNT Ultimates figures for their next wave.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://toynewsi.com/news",
    },
  ])
  const [afiPreviews, setAfiPreviews] = useState<WebPreviewData[]>([
    {
      title: "Mezco One:12 Collective Expands Horror Line",
      description: "Mezco is expanding their One:12 Collective horror line with new figures.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.actionfigureinsider.com/",
    },
    {
      title: "Diamond Select Toys Announces New Marvel Figures",
      description: "Diamond Select Toys has announced new Marvel figures coming this winter.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.actionfigureinsider.com/category/news/",
    },
  ])
  // Agregar Figure Realm previews
  const [figureRealmPreviews, setFigureRealmPreviews] = useState<WebPreviewData[]>([
    {
      title: "New Figure Database Updates",
      description: "Check out the latest additions to our comprehensive figure database.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.figurerealm.com/home",
    },
    {
      title: "Collector Spotlight: Horror Figures",
      description: "Featured collector showcase of rare horror figure collections.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.figurerealm.com/galleries",
    },
  ])

  // Brand previews
  const [necaPreviews, setNecaPreviews] = useState<WebPreviewData[]>([
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
      url: "https://necaonline.com/collections/predator/",
    },
  ])
  const [totPreviews, setTotPreviews] = useState<WebPreviewData[]>([
    {
      title: "Michael Myers 1978",
      description: "Trick or Treat Studios' Michael Myers 1978 figure with authentic details.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://trickortreatstudios.com/",
    },
    {
      title: "Ghost Face",
      description: "Scream's Ghost Face figure with fabric costume and accessories.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://trickortreatstudios.com/licensed-designs/ghost-face.html",
    },
  ])

  // Store previews
  const [alltimetoysPreviews, setAlltimetoysPreviews] = useState<WebPreviewData[]>([
    {
      title: "NECA Alien Collection",
      description: "Complete your NECA Alien collection with our extensive inventory.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.alltimetoys.com/",
    },
    {
      title: "McFarlane DC Multiverse",
      description: "New arrivals of McFarlane DC Multiverse figures now in stock.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://www.alltimetoys.com/collections/mcfarlane-toys",
    },
  ])
  const [andystoyPreviews, setAndystoyPreviews] = useState<WebPreviewData[]>([
    {
      title: "Horror Icons Collection",
      description: "Build your horror icons collection with our curated selection.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://andystoychest.com/",
    },
    {
      title: "Vintage Toys Section",
      description: "Explore our vintage toys section for rare collectibles.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      url: "https://andystoychest.com/collections/vintage-toys",
    },
  ])

  // Simular la carga de datos de sitios web externos
  useEffect(() => {
    // En una aplicación real, aquí se harían llamadas a APIs para obtener datos en tiempo real
    console.log("Fetching web previews...")
    // Las previews ya están definidas en los estados iniciales
  }, [])

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
        <h3 className="mb-4 text-xl font-semibold text-neon-green">{t("home.figureNews")}</h3>
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
            <TabsTrigger value="figurerealm" className="whitespace-nowrap">
              Figure Realm
            </TabsTrigger>
          </TabsList>
          <TabsContent value="toyark" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.latestNews")}{" "}
                  <Link href="https://www.toyark.com/" target="_blank" className="text-neon-green hover:underline">
                    www.toyark.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://www.toyark.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="The Toyark"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fwoosh" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.latestNews")}{" "}
                  <Link href="https://thefwoosh.com/" target="_blank" className="text-neon-green hover:underline">
                    thefwoosh.com
                  </Link>
                </p>
                <div className="mt-4">
                  <LinkPreview url="https://thefwoosh.com/" width="100%" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="toynewsi" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.latestNews")}{" "}
                  <Link href="https://toynewsi.com/" target="_blank" className="text-neon-green hover:underline">
                    toynewsi.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {toynewsiPreviews.map((preview, i) => (
                    <WebPreview
                      key={`toynewsi-${i}`}
                      url={preview.url}
                      title={preview.title}
                      description={preview.description}
                      imageUrl={preview.imageUrl}
                      height={300}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="afi" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.latestNews")}{" "}
                  <Link
                    href="https://www.actionfigureinsider.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    www.actionfigureinsider.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {afiPreviews.map((preview, i) => (
                    <WebPreview
                      key={`afi-${i}`}
                      url={preview.url}
                      title={preview.title}
                      description={preview.description}
                      imageUrl={preview.imageUrl}
                      height={300}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Agregar Figure Realm tab */}
          <TabsContent value="figurerealm" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.latestNews")}{" "}
                  <Link
                    href="https://www.figurerealm.com/home"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    www.figurerealm.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {figureRealmPreviews.map((preview, i) => (
                    <WebPreview
                      key={`figurerealm-${i}`}
                      url={preview.url}
                      title={preview.title}
                      description={preview.description}
                      imageUrl={preview.imageUrl}
                      height={300}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Figure Brands Section */}
      <section className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-neon-green">{t("home.figureBrands")}</h3>
        <Tabs defaultValue="neca">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="neca" className="whitespace-nowrap">
              NECA
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
            <TabsTrigger value="tot" className="whitespace-nowrap">
              Trick or Treat Studios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="neca" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link href="https://necaonline.com/" target="_blank" className="text-neon-green hover:underline">
                    necaonline.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://necaonline.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="NECA"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcfarlane" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link href="https://mcfarlane.com/" target="_blank" className="text-neon-green hover:underline">
                    mcfarlane.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://mcfarlane.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="McFarlane Toys"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diamond" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link
                    href="https://www.diamondselecttoys.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    diamondselecttoys.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://www.diamondselecttoys.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="Diamond Select Toys"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="syndicate" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link
                    href="https://www.syndicatecollectibles.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    syndicatecollectibles.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://www.syndicatecollectibles.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="Syndicate Collectibles"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funko" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link href="https://funko.com/" target="_blank" className="text-neon-green hover:underline">
                    funko.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://funko.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="Funko"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tot" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.visit")}{" "}
                  <Link
                    href="https://trickortreatstudios.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    trickortreatstudios.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {totPreviews.map((preview, i) => (
                    <WebPreview
                      key={`tot-${i}`}
                      url={preview.url}
                      title={preview.title}
                      description={preview.description}
                      imageUrl={preview.imageUrl}
                      height={300}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Figure Stores Section */}
      <section className="mb-10">
        <h3 className="mb-4 text-xl font-semibold text-neon-green">{t("home.figureStores")}</h3>
        <Tabs defaultValue="alltimetoys">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="alltimetoys" className="whitespace-nowrap">
              All Time Toys
            </TabsTrigger>
            <TabsTrigger value="andystoy" className="whitespace-nowrap">
              Andy's Toy Chest
            </TabsTrigger>
            <TabsTrigger value="lasttoystore" className="whitespace-nowrap">
              The Last Toy Store
            </TabsTrigger>
            <TabsTrigger value="amoktime" className="whitespace-nowrap">
              Amok Time
            </TabsTrigger>
            <TabsTrigger value="bigbadtoystore" className="whitespace-nowrap">
              Big Bad Toy Store
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
                  {t("preview.shopAt")}{" "}
                  <Link href="https://alltimetoys.com/" target="_blank" className="text-neon-green hover:underline">
                    alltimetoys.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[500px] w-full">
                    <iframe
                      src="https://alltimetoys.com/"
                      width="100%"
                      height="500"
                      style={{ border: "none" }}
                      title="All Time Toys"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="andystoy" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link href="https://andystoychest.com/" target="_blank" className="text-neon-green hover:underline">
                    andystoychest.com
                  </Link>
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {andystoyPreviews.map((preview, i) => (
                    <WebPreview
                      key={`andystoy-${i}`}
                      url={preview.url}
                      title={preview.title}
                      description={preview.description}
                      imageUrl={preview.imageUrl}
                      height={300}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lasttoystore" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link href="https://thelasttoystore.com/" target="_blank" className="text-neon-green hover:underline">
                    thelasttoystore.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative w-full">
                    <iframe
                      src="https://thelasttoystore.com/"
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: "12px" }}
                      title="The Last Toy Store"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amoktime" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link href="https://amoktime.com/" target="_blank" className="text-neon-green hover:underline">
                    amoktime.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative w-full">
                    <iframe
                      src="https://amoktime.com/"
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: "12px" }}
                      title="Amok Time"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bigbadtoystore" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link
                    href="https://www.bigbadtoystore.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    bigbadtoystore.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative w-full">
                    <iframe
                      src="https://www.bigbadtoystore.com/"
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: "12px" }}
                      title="BigBadToyStore"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roguetoys" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link href="https://roguetoys.com/" target="_blank" className="text-neon-green hover:underline">
                    roguetoys.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative w-full">
                    <iframe
                      src="https://roguetoys.com/"
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: "12px" }}
                      title="Rogue Toys"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ebay" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  {t("preview.shopAt")}{" "}
                  <Link href="https://www.ebay.com/" target="_blank" className="text-neon-green hover:underline">
                    ebay.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative w-full">
                    <iframe
                      src="https://www.ebay.com/"
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: "12px" }}
                      title="eBay"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
