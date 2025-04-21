"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ArrowLeft, Search } from "lucide-react"
import { convertGoogleDriveUrl } from "@/lib/utils"
import { Input } from "@/components/ui/input"

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
  const [searchTerm, setSearchTerm] = useState("")

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
    // Clear selected item when changing main tab
    setSelectedItem(null)
  }, [mainTab])

  // Clear selected item when changing sub tab
  useEffect(() => {
    setSelectedItem(null)
  }, [subTab])

  // Filter items by shelf and display
  const getFilteredItems = (shelf: string, display: string) => {
    return figureItems
      .filter((item) => item.shelf === shelf && item.display === display)
      .filter(
        (item) =>
          searchTerm === "" ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.franchise.toLowerCase().includes(searchTerm.toLowerCase()),
      )
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
  }

  // Back to list view
  const handleBackToList = () => {
    setSelectedItem(null)
  }

  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Display</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab} className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="w-auto">
            <TabsTrigger value="Eins" className="px-8 whitespace-nowrap">
              Eins
            </TabsTrigger>
            <TabsTrigger value="Deux" className="px-8 whitespace-nowrap">
              Deux
            </TabsTrigger>
            <TabsTrigger value="Trzy" className="px-8 whitespace-nowrap">
              Trzy
            </TabsTrigger>
            <TabsTrigger value="Quattro" className="px-8 whitespace-nowrap">
              Quattro
            </TabsTrigger>
            <TabsTrigger value="Beş" className="px-8 whitespace-nowrap">
              Beş
            </TabsTrigger>
            <TabsTrigger value="Six" className="px-8 whitespace-nowrap">
              Six
            </TabsTrigger>
          </TabsList>
        </div>

        <Tabs value={subTab} onValueChange={setSubTab}>
          <div className="flex justify-center mb-6">
            <TabsList className="w-auto overflow-x-auto">
              {displayOptions[mainTab as keyof typeof displayOptions].map((display) => (
                <TabsTrigger key={display} value={display} className="px-4 whitespace-nowrap">
                  {display}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {displayOptions[mainTab as keyof typeof displayOptions].map((display) => (
            <TabsContent key={display} value={display} className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {selectedItem ? (
                    // Item detail view
                    <div>
                      <Button variant="outline" size="sm" onClick={handleBackToList} className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to list
                      </Button>

                      <div className="flex flex-col gap-6">
                        {/* Logo */}
                        {selectedItem.logo && (
                          <div className="w-full">
                            <div className="relative h-32 w-full overflow-hidden">
                              <img
                                src={convertGoogleDriveUrl(selectedItem.logo) || "/placeholder.svg"}
                                alt={`${selectedItem.franchise} logo`}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Name and Tagline */}
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-neon-green">{selectedItem.name}</h3>
                          {selectedItem.tagline && <p className="text-base italic">{selectedItem.tagline}</p>}
                        </div>

                        {/* Photo */}
                        {selectedItem.photo && (
                          <div className="w-full">
                            <div className="relative h-80 w-full overflow-hidden">
                              <img
                                src={convertGoogleDriveUrl(selectedItem.photo) || "/placeholder.svg"}
                                alt={selectedItem.name}
                                className="object-contain w-full h-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              ID: <span className="font-normal text-white">{selectedItem.id}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Brand: <span className="font-normal text-white">{selectedItem.brand}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Serie: <span className="font-normal text-white">{selectedItem.serie || "N/A"}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Franchise: <span className="font-normal text-white">{selectedItem.franchise}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Year Released: <span className="font-normal text-white">{selectedItem.yearReleased}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Condition: <span className="font-normal text-white">{selectedItem.condition}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Price:{" "}
                              <span className="font-normal text-white">
                                ${Number.parseInt(selectedItem.price).toLocaleString("es-CO")}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Year Purchase: <span className="font-normal text-white">{selectedItem.yearPurchase}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              UPC: <span className="font-normal text-white">{selectedItem.upc || "N/A"}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Shelf: <span className="font-normal text-white">{selectedItem.shelf}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Display: <span className="font-normal text-white">{selectedItem.display}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Ranking:{" "}
                              <span className="font-normal text-white">{renderStars(selectedItem.ranking)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Review */}
                        {selectedItem.review && (
                          <div>
                            <p className="text-sm font-medium text-neon-green mb-2">Review:</p>
                            <div className="aspect-video w-full overflow-hidden">
                              <iframe
                                width="100%"
                                height="100%"
                                src={selectedItem.review.replace("watch?v=", "embed/")}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        )}

                        {/* Comments */}
                        {selectedItem.comments && (
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Comments: <span className="font-normal text-white">{selectedItem.comments}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Item list view
                    <div className="space-y-2">
                      {getFilteredItems(mainTab, display).length > 0 ? (
                        getFilteredItems(mainTab, display).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => handleItemClick(item)}
                          >
                            <p className="font-medium">{item.name}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No items found in this display. Add some items to your collection!
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </Tabs>
    </div>
  )
}
