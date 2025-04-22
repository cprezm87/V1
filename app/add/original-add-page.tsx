"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, StarIcon, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/contexts/theme-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUploadField } from "@/components/image-upload-field"
import { useRouter } from "next/navigation"

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

// Define interfaces for our items
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

interface WishlistItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  price: string
  logo: string
  photo: string
  tagline: string
  review: string
  released: boolean
  buy: boolean
  comments: string
  trackingNumber: string
}

interface CustomItem {
  id: string
  name: string
  type: string
  franchise: string
  head: string
  body: string
  logo: string
  tagline: string
  comments: string
}

export default function OriginalAddPage() {
  const { toast } = useToast()
  const { t } = useTheme()
  const router = useRouter()
  const [selectedShelf, setSelectedShelf] = useState<keyof typeof displayOptions | "">("")
  const [logoPreview, setLogoPreview] = useState("")
  const [photoPreview, setPhotoPreview] = useState("")
  const [wishlistLogoPreview, setWishlistLogoPreview] = useState("")
  const [wishlistPhotoPreview, setWishlistPhotoPreview] = useState("")
  const [customLogoPreview, setCustomLogoPreview] = useState("")
  const [rating, setRating] = useState(0)
  const [nextId, setNextId] = useState(1)
  const [formattedId, setFormattedId] = useState("001")
  const [activeTab, setActiveTab] = useState("figures")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showWishlistSuccessAlert, setShowWishlistSuccessAlert] = useState(false)
  const [showCustomSuccessAlert, setShowCustomSuccessAlert] = useState(false)

  // State for storing items
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [customItems, setCustomItems] = useState<CustomItem[]>([])

  // Initialize sheets and get next ID
  useEffect(() => {
    const initializeSheets = async () => {
      try {
        // Initialize sheets
        await fetch("/api/init-sheets")

        // Get next ID
        const response = await fetch("/api/get-next-id")
        const data = await response.json()

        if (data.nextId) {
          setFormattedId(data.nextId)
          setNextId(Number.parseInt(data.nextId))
        }
      } catch (error) {
        console.error("Error initializing:", error)
      }
    }

    initializeSheets()
  }, [])

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedFigures = localStorage.getItem("figureItems")
    const storedWishlist = localStorage.getItem("wishlistItems")
    const storedCustoms = localStorage.getItem("customItems")
    const storedNextId = localStorage.getItem("nextId")

    if (storedFigures) setFigureItems(JSON.parse(storedFigures))
    if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist))
    if (storedCustoms) setCustomItems(JSON.parse(storedCustoms))
    if (storedNextId) {
      const parsedId = Number.parseInt(storedNextId)
      if (parsedId > nextId) {
        setNextId(parsedId)
        setFormattedId(String(parsedId).padStart(3, "0"))
      }
    }
  }, [nextId])

  // Save items to localStorage whenever they change
  useEffect(() => {
    try {
      // Helper function to limit image URL length
      const limitImageSize = (item: any) => {
        const maxUrlLength = 1000 // Limit URL length to prevent localStorage overflow
        const processedItem = { ...item }

        // Check and limit logo and photo URLs if they're data URLs
        if (processedItem.logo && processedItem.logo.startsWith("data:")) {
          processedItem.logo =
            processedItem.logo.length > maxUrlLength
              ? processedItem.logo.substring(0, maxUrlLength) + "...[truncated]"
              : processedItem.logo
        }

        if (processedItem.photo && processedItem.photo.startsWith("data:")) {
          processedItem.photo =
            processedItem.photo.length > maxUrlLength
              ? processedItem.photo.substring(0, maxUrlLength) + "...[truncated]"
              : processedItem.photo
        }

        return processedItem
      }

      // Process items before storing
      const processedFigureItems = figureItems.map(limitImageSize)
      const processedWishlistItems = wishlistItems.map(limitImageSize)
      const processedCustomItems = customItems.map(limitImageSize)

      // Store in localStorage with error handling
      localStorage.setItem("figureItems", JSON.stringify(processedFigureItems))
      localStorage.setItem("wishlistItems", JSON.stringify(processedWishlistItems))
      localStorage.setItem("customItems", JSON.stringify(processedCustomItems))
      localStorage.setItem("nextId", nextId.toString())
    } catch (error) {
      console.error("Error saving to localStorage:", error)
      toast({
        title: "Storage Error",
        description: "Unable to save all data. Consider removing some items or images.",
        variant: "destructive",
      })
    }
  }, [figureItems, wishlistItems, customItems, nextId, toast])

  // Handle shelf selection change
  const handleShelfChange = (value: string) => {
    setSelectedShelf(value as keyof typeof displayOptions)
  }

  // Handle figure submission
  const handleFigureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Check image sizes before adding
    const logoSize = logoPreview.length
    const photoSize = photoPreview.length
    const totalSize = logoSize + photoSize

    // Warn if images are too large
    if (totalSize > 500000) {
      // 500KB threshold
      toast({
        title: "Warning",
        description: "Images are very large and may cause storage issues. Consider using external image URLs instead.",
        variant: "destructive",
      })
    }

    const newFigure: FigureItem = {
      id: formattedId,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      franchise: formData.get("franchise") as string,
      brand: formData.get("brand") as string,
      serie: formData.get("serie") as string,
      yearReleased: formData.get("yearReleased") as string,
      condition: formData.get("condition") as string,
      price: formData.get("price") as string,
      yearPurchase: formData.get("yearPurchase") as string,
      upc: formData.get("upc") as string,
      logo: logoPreview,
      photo: photoPreview,
      tagline: formData.get("tagline") as string,
      review: formData.get("review") as string,
      shelf: formData.get("shelf") as string,
      display: formData.get("display") as string,
      ranking: rating,
      comments: formData.get("comments") as string,
    }

    try {
      // Send data to the API route
      const response = await fetch("/api/add-checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFigure),
      })

      if (!response.ok) {
        throw new Error("Failed to add checklist item to Google Sheets")
      }

      // Save to localStorage
      setFigureItems([...figureItems, newFigure])

      // Get next ID for future submissions
      const nextIdResponse = await fetch("/api/get-next-id")
      const nextIdData = await nextIdResponse.json()

      if (nextIdData.nextId) {
        setFormattedId(nextIdData.nextId)
        setNextId(Number.parseInt(nextIdData.nextId))
      } else {
        // Fallback to incrementing locally
        const newNextId = nextId + 1
        setNextId(newNextId)
        setFormattedId(String(newNextId).padStart(3, "0"))
      }

      // Reset form
      form.reset()
      setLogoPreview("")
      setPhotoPreview("")
      setRating(0)
      setSelectedShelf("")

      // Show success alert
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)

      toast({
        title: t("add.added"),
        description: t("add.itemAdded"),
      })

      // Refresh the checklist page
      router.refresh()
    } catch (error) {
      console.error("Error adding figure:", error)
      let errorMessage = "Failed to add item. Please try again."

      // Provide more specific error messages for debugging
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Handle wishlist submission
  const handleWishlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Check image sizes before adding
    const logoSize = wishlistLogoPreview.length
    const photoSize = wishlistPhotoPreview.length
    const totalSize = logoSize + photoSize

    // Warn if images are too large
    if (totalSize > 500000) {
      // 500KB threshold
      toast({
        title: "Warning",
        description: "Images are very large and may cause storage issues. Consider using external image URLs instead.",
        variant: "destructive",
      })
    }

    const newWishlistItem: WishlistItem = {
      id: formattedId,
      name: formData.get("wishlist-name") as string,
      type: formData.get("wishlist-type") as string,
      franchise: formData.get("wishlist-franchise") as string,
      brand: formData.get("wishlist-brand") as string,
      serie: formData.get("wishlist-serie") as string,
      yearReleased: formData.get("wishlist-yearReleased") as string,
      price: formData.get("wishlist-price") as string,
      logo: wishlistLogoPreview,
      photo: wishlistPhotoPreview,
      tagline: formData.get("wishlist-tagline") as string,
      review: formData.get("wishlist-review") as string,
      released: formData.get("released") === "on",
      buy: formData.get("buy") === "on",
      comments: formData.get("wishlist-comments") as string,
      trackingNumber: formData.get("wishlist-tracking") as string,
    }

    try {
      // Send data to the API route
      const response = await fetch("/api/add-wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWishlistItem),
      })

      if (!response.ok) {
        throw new Error("Failed to add wishlist item to Google Sheets")
      }

      // Save to localStorage
      setWishlistItems([...wishlistItems, newWishlistItem])

      // Increment ID for future submissions
      const newNextId = nextId + 1
      setNextId(newNextId)
      setFormattedId(String(newNextId).padStart(3, "0"))

      // Reset form
      form.reset()
      setWishlistLogoPreview("")
      setWishlistPhotoPreview("")

      // Show success alert
      setShowWishlistSuccessAlert(true)
      setTimeout(() => setShowWishlistSuccessAlert(false), 3000)

      toast({
        title: "Added!",
        description: "Item Has Been Successfully Added To Your Wishlist",
      })

      // Refresh the wishlist page
      router.refresh()
    } catch (error) {
      console.error("Error adding wishlist item:", error)
      let errorMessage = "Failed to add item. Please try again."

      // Provide more specific error messages for debugging
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Handle custom submission
  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Check image sizes before adding
    const logoSize = customLogoPreview.length

    // Warn if images are too large
    if (logoSize > 500000) {
      // 500KB threshold
      toast({
        title: "Warning",
        description: "Images are very large and may cause storage issues. Consider using external image URLs instead.",
        variant: "destructive",
      })
    }

    const newCustomItem: CustomItem = {
      id: formattedId,
      name: formData.get("custom-name") as string,
      type: formData.get("custom-type") as string,
      franchise: formData.get("custom-franchise") as string,
      head: formData.get("custom-head") as string,
      body: formData.get("custom-body") as string,
      logo: customLogoPreview,
      tagline: formData.get("custom-tagline") as string,
      comments: formData.get("custom-comments") as string,
    }

    try {
      // Send data to the API route
      const response = await fetch("/api/add-customs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomItem),
      })

      if (!response.ok) {
        throw new Error("Failed to add custom item to Google Sheets")
      }

      // Save to localStorage
      setCustomItems([...customItems, newCustomItem])

      // Increment ID for future submissions
      const newNextId = nextId + 1
      setNextId(newNextId)
      setFormattedId(String(newNextId).padStart(3, "0"))

      // Reset form
      form.reset()
      setCustomLogoPreview("")

      // Show success alert
      setShowCustomSuccessAlert(true)
      setTimeout(() => setShowCustomSuccessAlert(false), 3000)

      toast({
        title: t("add.added"),
        description: t("add.itemAdded"),
      })

      // Refresh the customs page
      router.refresh()
    } catch (error) {
      console.error("Error adding custom item:", error)
      let errorMessage = "Failed to add item. Please try again."

      // Provide more specific error messages for debugging
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="figures" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="figures" className="px-8">
              Checklist
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="px-8">
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="customs" className="px-8">
              Customs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Figures Tab */}
        <TabsContent value="figures">
          <Card className="w-full">
            <CardContent className="p-6">
              {showSuccessAlert && (
                <Alert className="mb-6 bg-neon-green/20 border-neon-green">
                  <CheckCircle className="h-4 w-4 text-neon-green" />
                  <AlertDescription className="text-neon-green font-medium">
                    Added! Item has been successfully added to your collection.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleFigureSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">ID</Label>
                    <Input id="id" name="id" value={formattedId} readOnly className="opacity-70 cursor-not-allowed" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Figure name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="figures">Figures</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="props">Props</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="franchise">Franchise</Label>
                    <Input id="franchise" name="franchise" placeholder="Franchise name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" placeholder="Brand name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serie">Serie</Label>
                    <Input id="serie" name="serie" placeholder="Serie name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearReleased">Year Released</Label>
                    <Input
                      id="yearReleased"
                      name="yearReleased"
                      type="number"
                      placeholder="YYYY"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select name="condition" required>
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="opened">Opened (Like New)</SelectItem>
                        <SelectItem value="used">Used (Heavy Wear)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (COP)</Label>
                    <Input id="price" name="price" type="number" placeholder="Price in COP" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearPurchase">Year Purchase</Label>
                    <Input
                      id="yearPurchase"
                      name="yearPurchase"
                      type="number"
                      placeholder="YYYY"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upc">UPC</Label>
                    <Input id="upc" name="upc" type="number" placeholder="UPC number" />
                  </div>

                  {/* Reemplazar los campos de Logo y Photo en el formulario de figuras */}
                  <div className="space-y-2 md:col-span-2">
                    <ImageUploadField id="logo" label="Logo" value={logoPreview} onChange={setLogoPreview} />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <ImageUploadField id="photo" label="Photo" value={photoPreview} onChange={setPhotoPreview} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" name="tagline" placeholder="Tagline" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review">Review</Label>
                    <Input id="review" name="review" placeholder="YouTube review URL" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shelf">Shelf</Label>
                    <Select name="shelf" onValueChange={handleShelfChange} required>
                      <SelectTrigger id="shelf">
                        <SelectValue placeholder="Select shelf" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Eins">Eins</SelectItem>
                        <SelectItem value="Deux">Deux</SelectItem>
                        <SelectItem value="Trzy">Trzy</SelectItem>
                        <SelectItem value="Quattro">Quattro</SelectItem>
                        <SelectItem value="Beş">Beş</SelectItem>
                        <SelectItem value="Six">Six</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display">Display</Label>
                    <Select name="display" disabled={!selectedShelf}>
                      <SelectTrigger id="display">
                        <SelectValue placeholder={selectedShelf ? "Select display" : "Select shelf first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedShelf &&
                          displayOptions[selectedShelf].map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ranking</Label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                        {star <= rating ? (
                          <StarIcon className="h-6 w-6 fill-neon-green text-neon-green" />
                        ) : (
                          <Star className="h-6 w-6 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea id="comments" name="comments" placeholder="Add your comments..." rows={4} />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                    Add to Checklist
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tabb */}
        <TabsContent value="wishlist">
          <Card className="w-full">
            <CardContent className="p-6">
              {showWishlistSuccessAlert && (
                <Alert className="mb-6 bg-neon-green/20 border-neon-green">
                  <CheckCircle className="h-4 w-4 text-neon-green" />
                  <AlertDescription className="text-neon-green font-medium">
                    Added! Item Has Been Successfully Added To Your Wishlist.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleWishlistSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="wishlist-name">Name</Label>
                    <Input id="wishlist-name" name="wishlist-name" placeholder="Figure name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-type">Type</Label>
                    <Select name="wishlist-type" required>
                      <SelectTrigger id="wishlist-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="figures">Figures</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="props">Props</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-franchise">Franchise</Label>
                    <Input id="wishlist-franchise" name="wishlist-franchise" placeholder="Franchise name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-brand">Brand</Label>
                    <Input id="wishlist-brand" name="wishlist-brand" placeholder="Brand name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-serie">Serie</Label>
                    <Input id="wishlist-serie" name="wishlist-serie" placeholder="Serie name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-yearReleased">Year Released</Label>
                    <Input
                      id="wishlist-yearReleased"
                      name="wishlist-yearReleased"
                      type="number"
                      placeholder="YYYY"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-price">Price</Label>
                    <Input
                      id="wishlist-price"
                      name="wishlist-price"
                      type="number"
                      placeholder="Price in COP"
                      required
                    />
                  </div>

                  {/* Reemplazar los campos de Logo y Photo en el formulario de wishlist */}
                  <div className="space-y-2 md:col-span-2">
                    <ImageUploadField
                      id="wishlist-logo"
                      label="Logo"
                      value={wishlistLogoPreview}
                      onChange={setWishlistLogoPreview}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <ImageUploadField
                      id="wishlist-photo"
                      label="Photo"
                      value={wishlistPhotoPreview}
                      onChange={setWishlistPhotoPreview}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-tagline">Tagline</Label>
                    <Input id="wishlist-tagline" name="wishlist-tagline" placeholder="Tagline" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-review">Review</Label>
                    <Input id="wishlist-review" name="wishlist-review" placeholder="YouTube review URL" />
                  </div>

                  <div className="flex items-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="released" name="released" />
                      <Label htmlFor="released">Released</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="buy" name="buy" />
                      <Label htmlFor="buy">Buy</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wishlist-tracking">Tracking Number</Label>
                    <Input id="wishlist-tracking" name="wishlist-tracking" placeholder="Enter tracking number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wishlist-comments">Comments</Label>
                  <Textarea
                    id="wishlist-comments"
                    name="wishlist-comments"
                    placeholder="Add your comments..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                    Add to Wishlist
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom's Tab */}
        <TabsContent value="customs">
          <Card className="w-full">
            <CardContent className="p-6">
              {showCustomSuccessAlert && (
                <Alert className="mb-6 bg-neon-green/20 border-neon-green">
                  <CheckCircle className="h-4 w-4 text-neon-green" />
                  <AlertDescription className="text-neon-green font-medium">
                    Added! Custom item has been successfully added to your customs collection.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleCustomSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">Name</Label>
                    <Input id="custom-name" name="custom-name" placeholder="Custom name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-type">Type</Label>
                    <Select name="custom-type" required>
                      <SelectTrigger id="custom-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="figures">Figures</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="props">Props</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-franchise">Franchise</Label>
                    <Input id="custom-franchise" name="custom-franchise" placeholder="Franchise name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-head">Head</Label>
                    <Input id="custom-head" name="custom-head" placeholder="Head details" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-body">Body</Label>
                    <Input id="custom-body" name="custom-body" placeholder="Body details" required />
                  </div>

                  {/* Reemplazar el campo de Logo en el formulario de customs */}
                  <div className="space-y-2 md:col-span-2">
                    <ImageUploadField
                      id="custom-logo"
                      label="Logo"
                      value={customLogoPreview}
                      onChange={setCustomLogoPreview}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom-tagline">Tagline</Label>
                    <Input id="custom-tagline" name="custom-tagline" placeholder="Tagline" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-comments">Comments</Label>
                  <Textarea id="custom-comments" name="custom-comments" placeholder="Add your comments..." rows={4} />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-neon-green text-black hover:bg-neon-green/90">
                    Add to Customs
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
