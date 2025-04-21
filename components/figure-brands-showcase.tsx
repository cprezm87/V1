"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WebPreview } from "@/components/web-preview"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface Brand {
  name: string
  url: string
  description: string
  imageUrl?: string
}

const brands: Brand[] = [
  {
    name: "NECA",
    url: "https://necaonline.com/",
    description: "National Entertainment Collectibles Association - Known for high-quality horror and movie figures",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "McFarlane",
    url: "https://mcfarlane.com/",
    description: "Founded by Todd McFarlane - Known for highly detailed action figures and collectibles",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Diamond Select",
    url: "https://www.diamondselecttoys.com/",
    description: "Known for high-quality collectibles across various licenses including Marvel and horror",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Syndicate Collectibles",
    url: "https://www.syndicatecollectibles.com/",
    description: "Specializing in premium horror collectibles and limited edition pieces",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Funko",
    url: "https://funko.com/",
    description: "Creator of the popular Pop! Vinyl figures covering thousands of licenses",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    name: "Trick or Treat Studios",
    url: "https://trickortreatstudios.com/",
    description: "Specializing in high-quality masks and horror collectibles",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]

export default function FigureBrandsShowcase() {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-neon-green">Figure Brands</CardTitle>
        <CardDescription>Explore popular figure brands and their websites</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          {brands.map((brand) => (
            <Button
              key={brand.name}
              onClick={() => setSelectedBrand(brand)}
              variant={selectedBrand.name === brand.name ? "default" : "outline"}
              className={selectedBrand.name === brand.name ? "bg-neon-green text-black hover:bg-neon-green/90" : ""}
            >
              {brand.name}
            </Button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">{selectedBrand.name}</h3>
            <p className="text-muted-foreground">{selectedBrand.description}</p>
            <Link
              href={selectedBrand.url}
              target="_blank"
              className="text-neon-green hover:underline flex items-center gap-1 text-sm"
            >
              Visit {selectedBrand.name} <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <WebPreview
            url={selectedBrand.url}
            title={selectedBrand.name}
            description={selectedBrand.description}
            imageUrl={selectedBrand.imageUrl}
            height={500}
          />
        </div>
      </CardContent>
    </Card>
  )
}
