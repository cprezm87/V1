import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample collection data
const collectionItems = [
  { id: 1, name: "Item 1", category: "Figures", image: "/placeholder.svg?height=200&width=200" },
  { id: 2, name: "Item 2", category: "Cards", image: "/placeholder.svg?height=200&width=200" },
  { id: 3, name: "Item 3", category: "Comics", image: "/placeholder.svg?height=200&width=200" },
  { id: 4, name: "Item 4", category: "Figures", image: "/placeholder.svg?height=200&width=200" },
  { id: 5, name: "Item 5", category: "Vinyl", image: "/placeholder.svg?height=200&width=200" },
  { id: 6, name: "Item 6", category: "Cards", image: "/placeholder.svg?height=200&width=200" },
  { id: 7, name: "Item 7", category: "Comics", image: "/placeholder.svg?height=200&width=200" },
  { id: 8, name: "Item 8", category: "Figures", image: "/placeholder.svg?height=200&width=200" },
  { id: 9, name: "Item 9", category: "Vinyl", image: "/placeholder.svg?height=200&width=200" },
]

export default function DisplayPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Display</h1>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="figures">Figures</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="comics">Comics</TabsTrigger>
          <TabsTrigger value="vinyl">Vinyl</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectionItems.map((item) => (
              <CollectionCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="figures" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectionItems
              .filter((item) => item.category === "Figures")
              .map((item) => (
                <CollectionCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectionItems
              .filter((item) => item.category === "Cards")
              .map((item) => (
                <CollectionCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="comics" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectionItems
              .filter((item) => item.category === "Comics")
              .map((item) => (
                <CollectionCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="vinyl" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {collectionItems
              .filter((item) => item.category === "Vinyl")
              .map((item) => (
                <CollectionCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CollectionCard({ item }: { item: (typeof collectionItems)[0] }) {
  return (
    <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-neon-green/20">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.category}</p>
        </div>
      </CardContent>
    </Card>
  )
}
