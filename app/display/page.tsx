"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { convertGoogleDriveUrl } from "@/lib/utils"

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

export default function DisplayPage() {
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])
  const [mainTab, setMainTab] = useState("Eins")
  const [subTab, setSubTab] = useState("")
  const [selectedItem, setSelectedItem] = useState<FigureItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedFigures = localStorage.getItem("figureItems")
    if (storedFigures) {
      setFigureItems(JSON.parse(storedFigures))
    }
  }, [])

  // Set default subtab when main tab changes
  useEffect(() => {
    switch (mainTab) {
      case "Eins":
        setSubTab("Silent Horrors")
        break
      case "Deux":
        setSubTab("Pain & Paradox")
        break
      case "Trzy":
        setSubTab("Stalkers of Fear")
        break
      case "Quattro":
        setSubTab("Terror in Toyland")
        break
      case "Beş":
        setSubTab("Opaco's Nightmares")
        break
      case "Six":
        setSubTab("Fear in Motion")
        break
      default:
        setSubTab("")
    }
  }, [mainTab])

  // Filter items by shelf and display
  const getFilteredItems = (shelf: string, display: string) => {
    return figureItems.filter((item) => item.shelf === shelf && item.display === display)
  }

  // Display options based on shelf selection
  const displayOptions = {
    Eins: ["Silent Horrors", "The Gloom Hall", "Chamber of the Cursed", "Cryptic Experiments", "Monstrously Domestic"],
    Deux: ["Pain & Paradox", "The Unholy Playroom", "Sleep No More", "Dead By Dawn", "The Enchanted Abyss"],
    Trzy: [
      "Stalkers of Fear",
      "The Crystal Lake Chronicles",
      "Carnage Unleashed",
      "The Rejected Ones",
      "The Butcher's Domain",
    ],
    Quattro: ["Terror in Toyland", "The Undead Legion", "The Shapeshifters", "The Wretched Ones", "Beastly Havoc"],
    Beş: [
      "Opaco's Nightmares",
      "Eccentric Horror Hall",
      "Twisted Wonders",
      "Oddities & Iconic",
      "Terror, Terrors & Tricksters",
    ],
    Six: ["Fear in Motion", "Heroes of the Dark Side", "Beyond Earth", "Mythical Beasts", "Hellish Fates"],
  }

  // Render stars for ranking
  const renderStars = (ranking: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < ranking ? "fill-neon-green text-neon-green" : "text-muted-foreground"}`}
          />
        ))}
      </div>
    )
  }

  // Handle item click
  const handleItemClick = (item: FigureItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  // Render item dialog content
  const renderItemDialogContent = (item: FigureItem) => (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      {item.logo && (
        <div className="w-full">
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={convertGoogleDriveUrl(item.logo) || "/placeholder.svg"}
              alt={`${item.franchise} logo`}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Name and Tagline */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-neon-green">{item.name}</h3>
        {item.tagline && <p className="text-base italic">{item.tagline}</p>}
      </div>

      {/* Photo */}
      {item.photo && (
        <div className="w-full">
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={convertGoogleDriveUrl(item.photo) || "/placeholder.svg"}
              alt={item.name}
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-neon-green">
            ID: <span className="font-normal text-white">{item.id}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Brand: <span className="font-normal text-white">{item.brand}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Serie: <span className="font-normal text-white">{item.serie || "N/A"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Franchise: <span className="font-normal text-white">{item.franchise}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Year Released: <span className="font-normal text-white">{item.yearReleased}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Condition: <span className="font-normal text-white">{item.condition}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Price:{" "}
            <span className="font-normal text-white">${Number.parseInt(item.price).toLocaleString("es-CO")}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Year Purchase: <span className="font-normal text-white">{item.yearPurchase}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            UPC: <span className="font-normal text-white">{item.upc || "N/A"}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Shelf: <span className="font-normal text-white">{item.shelf}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Display: <span className="font-normal text-white">{item.display}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Ranking: <span className="font-normal text-white">{renderStars(item.ranking)}</span>
          </p>
        </div>
      </div>

      {/* Review */}
      {item.review && (
        <div>
          <p className="text-sm font-medium text-neon-green mb-2">Review:</p>
          <div className="aspect-video w-full overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={item.review.replace("watch?v=", "embed/")}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Comments */}
      {item.comments && (
        <div>
          <p className="text-sm font-medium text-neon-green">
            Comments: <span className="font-normal text-white">{item.comments}</span>
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Display</h1>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="w-auto">
            <TabsTrigger value="Eins" className="px-4 whitespace-nowrap">
              Eins
            </TabsTrigger>
            <TabsTrigger value="Deux" className="px-4 whitespace-nowrap">
              Deux
            </TabsTrigger>
            <TabsTrigger value="Trzy" className="px-4 whitespace-nowrap">
              Trzy
            </TabsTrigger>
            <TabsTrigger value="Quattro" className="px-4 whitespace-nowrap">
              Quattro
            </TabsTrigger>
            <TabsTrigger value="Beş" className="px-4 whitespace-nowrap">
              Beş
            </TabsTrigger>
            <TabsTrigger value="Six" className="px-4 whitespace-nowrap">
              Six
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Eins Tab */}
        <TabsContent value="Eins" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Eins.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Eins.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Eins", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Eins", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Deux Tab */}
        <TabsContent value="Deux" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Deux.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Deux.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Deux", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Deux", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Trzy Tab */}
        <TabsContent value="Trzy" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Trzy.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Trzy.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Trzy", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Trzy", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Quattro Tab */}
        <TabsContent value="Quattro" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Quattro.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Quattro.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Quattro", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Quattro", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Beş Tab */}
        <TabsContent value="Beş" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Beş.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Beş.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Beş", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Beş", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Six Tab */}
        <TabsContent value="Six" className="mt-6">
          <Tabs value={subTab} onValueChange={setSubTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="w-auto overflow-x-auto">
                {displayOptions.Six.map((display) => (
                  <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                    {display}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {displayOptions.Six.map((display) => (
              <TabsContent key={display} value={display} className="mt-6">
                {getFilteredItems("Six", display).length > 0 ? (
                  <div className="space-y-2">
                    {getFilteredItems("Six", display).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => handleItemClick(item)}
                      >
                        <p className="font-medium">{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found in this display. Add some items to your collection!
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Item Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader></DialogHeader>
          {selectedItem && renderItemDialogContent(selectedItem)}
        </DialogContent>
      </Dialog>
    </div>
  )
}
