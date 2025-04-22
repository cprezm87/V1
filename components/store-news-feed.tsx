"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { WebPreview } from "@/components/web-preview"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Info, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface StorePreviewData {
  title: string
  description: string
  imageUrl: string
  url: string
  price?: string
  inStock?: boolean
  discount?: string
}

interface StoreData {
  name: string
  url: string
  description: string
  location?: string
  shipping?: string[]
  previews: StorePreviewData[]
}

export function StoreNewsFeed() {
  const { t } = useTheme()
  const [activeTab, setActiveTab] = useState("entertainmentearth")
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<StorePreviewData | null>(null)
  const [stores, setStores] = useState<Record<string, StoreData>>({
    entertainmentearth: {
      name: "Entertainment Earth",
      url: "https://www.entertainmentearth.com/",
      description: "One of the largest retailers of action figures, collectibles, and pop culture merchandise",
      location: "California",
      shipping: ["United States", "International"],
      previews: [
        {
          title: "Horror Collectibles",
          description: "Extensive collection of horror movie collectibles from all your favorite franchises.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.entertainmentearth.com/s/horror/c?landingpageid=5027",
          price: "$19.99+",
          inStock: true,
        },
        {
          title: "Pre-Orders",
          description: "Reserve upcoming figures and collectibles before they sell out.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.entertainmentearth.com/new-arrivals",
          price: "Varies",
          inStock: true,
          discount: "Mint Condition Guarantee",
        },
        {
          title: "Exclusives",
          description: "Entertainment Earth exclusive items you won't find anywhere else.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.entertainmentearth.com/s/entertainment-earth-exclusives/c?landingpageid=3779",
          price: "$24.99+",
          inStock: true,
        },
      ],
    },
    alltimetoys: {
      name: "All Time Toys",
      url: "https://www.alltimetoys.com/",
      description: "Specializing in action figures, collectibles, and vintage toys",
      location: "Eldersburg, Maryland",
      shipping: ["United States", "International"],
      previews: [
        {
          title: "NECA Alien Collection",
          description: "Complete your NECA Alien collection with our extensive inventory.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.alltimetoys.com/collections/alien",
          price: "$32.99",
          inStock: true,
        },
        {
          title: "McFarlane DC Multiverse",
          description: "New arrivals of McFarlane DC Multiverse figures now in stock.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.alltimetoys.com/collections/mcfarlane-toys",
          price: "$24.99",
          inStock: true,
          discount: "15% OFF",
        },
        {
          title: "Horror Icons Collection",
          description: "Collectible figures of your favorite horror movie characters.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.alltimetoys.com/collections/horror",
          price: "$29.99",
          inStock: false,
        },
      ],
    },
    andystoy: {
      name: "Andy's Toy Chest",
      url: "https://andystoychest.com/",
      description: "Curated selection of collectibles with a focus on horror and sci-fi",
      location: "Online Only",
      shipping: ["United States", "Canada"],
      previews: [
        {
          title: "Horror Icons Collection",
          description: "Build your horror icons collection with our curated selection.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://andystoychest.com/collections/horror",
          price: "$34.99",
          inStock: true,
        },
        {
          title: "Vintage Toys Section",
          description: "Explore our vintage toys section for rare collectibles.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://andystoychest.com/collections/vintage-toys",
          price: "Varies",
          inStock: true,
        },
      ],
    },
    lasttoystore: {
      name: "The Last Toy Store",
      url: "https://thelasttoystore.com/",
      description: "Specializing in hard-to-find and limited edition collectibles",
      location: "Chicago, Illinois",
      shipping: ["United States", "International (Select Countries)"],
      previews: [
        {
          title: "Limited Edition Exclusives",
          description: "Shop our exclusive limited edition figures you won't find elsewhere.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://thelasttoystore.com/collections/exclusives",
          price: "$49.99+",
          inStock: true,
          discount: "Free Shipping",
        },
        {
          title: "Pre-Orders Available",
          description: "Secure upcoming releases with our pre-order system.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://thelasttoystore.com/collections/pre-orders",
          price: "Varies",
          inStock: true,
        },
      ],
    },
    amoktime: {
      name: "Amok Time",
      url: "https://amoktime.com/",
      description: "Specializing in horror collectibles, masks, and props",
      location: "New York",
      shipping: ["United States", "International"],
      previews: [
        {
          title: "Horror Collectibles",
          description: "Extensive collection of horror movie collectibles and memorabilia.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://amoktime.com/collections/horror",
          price: "$39.99",
          inStock: true,
        },
        {
          title: "Movie Props Replicas",
          description: "High-quality replicas of famous movie props and artifacts.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://amoktime.com/collections/props",
          price: "$79.99+",
          inStock: true,
        },
      ],
    },
    bigbadtoystore: {
      name: "Big Bad Toy Store",
      url: "https://www.bigbadtoystore.com/",
      description: "One of the largest online retailers for action figures and collectibles",
      location: "Wisconsin",
      shipping: ["United States", "International"],
      previews: [
        {
          title: "New Arrivals",
          description: "Check out the latest figures and collectibles just added to our inventory.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.bigbadtoystore.com/NewArrivals",
          price: "Varies",
          inStock: true,
        },
        {
          title: "Collector Grade Items",
          description: "Premium condition items for serious collectors.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.bigbadtoystore.com/Search?Brand=2308&PageSize=50&SortOrder=NEW",
          price: "Premium",
          inStock: true,
          discount: "Pile of Loot Shipping",
        },
      ],
    },
    roguetoys: {
      name: "Rogue Toys",
      url: "https://roguetoys.com/",
      description: "Specializing in vintage and hard-to-find collectibles",
      location: "Las Vegas, Nevada",
      shipping: ["United States"],
      previews: [
        {
          title: "Vintage Collection",
          description: "Rare vintage toys and collectibles from the 80s and 90s.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://roguetoys.com/collections/vintage",
          price: "Collector Pricing",
          inStock: true,
        },
        {
          title: "Graded Collectibles",
          description: "Professionally graded and authenticated collectibles for serious collectors.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://roguetoys.com/collections/graded",
          price: "$100+",
          inStock: true,
        },
      ],
    },
    ebay: {
      name: "eBay",
      url: "https://www.ebay.com/",
      description: "Marketplace for new and used collectibles from sellers worldwide",
      shipping: ["Worldwide (Varies by seller)"],
      previews: [
        {
          title: "Horror Action Figures",
          description: "Browse thousands of horror action figures from sellers around the world.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.ebay.com/b/Horror-Action-Figures/246/bn_7203442",
          price: "Auction/Buy Now",
          inStock: true,
        },
        {
          title: "Vintage Collectibles",
          description: "Find rare vintage collectibles and hard-to-find items.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.ebay.com/b/Vintage-Antique-Toys/717/bn_1853284",
          price: "Varies",
          inStock: true,
        },
      ],
    },
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Set the first product as selected by default
      if (stores[activeTab]?.previews.length > 0) {
        setSelectedProduct(stores[activeTab].previews[0])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab, stores])

  const handleProductSelect = (product: StorePreviewData) => {
    setSelectedProduct(product)
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold text-neon-green">Figure Stores</h3>
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
              {Object.entries(stores).map(([key, store]) => (
                <TabsTrigger key={key} value={key} className="rounded-none data-[state=active]:bg-background">
                  {store.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(stores).map(([key, store]) => (
              <TabsContent key={key} value={key} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Lista de productos - 1/3 del ancho */}
                  <div className="border-r">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{store.description}</p>
                      {store.location && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Location:</span> {store.location}
                        </p>
                      )}
                      <div className="mt-2">
                        <Link
                          href={store.url}
                          target="_blank"
                          className="text-neon-green hover:underline text-sm flex items-center"
                        >
                          {t("preview.shopAt")} {store.name} <ExternalLink className="ml-1 h-3 w-3" />
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
                          store.previews.map((product, i) => (
                            <div
                              key={i}
                              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedProduct?.title === product.title
                                  ? "border-l-4 border-neon-green bg-muted/50"
                                  : ""
                              }`}
                              onClick={() => handleProductSelect(product)}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium">{product.title}</h4>
                                {product.price && (
                                  <span className="text-sm font-bold text-neon-green">{product.price}</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                              <div className="mt-2 flex gap-2">
                                {product.inStock ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-500/20 text-green-500 border-green-500/50"
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/50">
                                    Out of Stock
                                  </Badge>
                                )}
                                {product.discount && (
                                  <Badge
                                    variant="outline"
                                    className="bg-neon-green/20 text-neon-green border-neon-green/50"
                                  >
                                    {product.discount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Contenido del producto - 2/3 del ancho */}
                  <div className="md:col-span-2 p-6">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ) : selectedProduct ? (
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-2xl font-bold">{selectedProduct.title}</h2>
                          {selectedProduct.price && (
                            <div className="text-right">
                              <div className="text-xl font-bold text-neon-green">{selectedProduct.price}</div>
                              {selectedProduct.discount && (
                                <Badge className="bg-neon-green text-black">{selectedProduct.discount}</Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="mb-6">
                          <WebPreview
                            url={selectedProduct.url}
                            title={selectedProduct.title}
                            description={selectedProduct.description}
                            imageUrl={selectedProduct.imageUrl}
                            height={400}
                          />
                        </div>
                        <p className="mb-4">{selectedProduct.description}</p>
                        <div className="flex gap-4">
                          <Button asChild className="bg-neon-green text-black hover:bg-neon-green/90">
                            <Link href={selectedProduct.url} target="_blank">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Shop Now
                            </Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href={store.url} target="_blank">
                              Visit Store <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Select a product to view details</p>
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
