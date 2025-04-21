"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoveRight, MoreHorizontal, Play, Check, X, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
  trackingNumber?: string
}

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

export default function WishlistPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [nextId, setNextId] = useState(1)
  const [editItem, setEditItem] = useState<WishlistItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [activeTab, setActiveTab] = useState("figures")

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("wishlistItems")
    const storedFigures = localStorage.getItem("figureItems")
    const storedNextId = localStorage.getItem("nextId")

    if (storedItems) setItems(JSON.parse(storedItems))
    if (storedFigures) setFigureItems(JSON.parse(storedFigures))
    if (storedNextId) setNextId(Number.parseInt(storedNextId))
  }, [])

  // Filter items by type and search term
  const getFilteredItems = (type: string) => {
    return items
      .filter(
        (item) =>
          item.type.toLowerCase() === type.toLowerCase() &&
          (searchTerm === "" ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.franchise.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortBy === "name" || sortBy === "franchise" || sortBy === "brand") {
          return sortOrder === "asc" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
        } else if (sortBy === "price" || sortBy === "yearReleased") {
          return sortOrder === "asc"
            ? Number.parseInt(a[sortBy]) - Number.parseInt(b[sortBy])
            : Number.parseInt(b[sortBy]) - Number.parseInt(a[sortBy])
        } else {
          // Default sort by name
          return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }
      })
  }

  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)
    localStorage.setItem("wishlistItems", JSON.stringify(updatedItems))
    toast({
      title: "Deleted!",
      description: "Item has been removed from your wishlist.",
    })
    setSelectedItem(null)
  }

  // Handle item edit
  const handleEditItem = (item: WishlistItem) => {
    setEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Save edited item
  const saveEditedItem = () => {
    if (editItem) {
      const updatedItems = items.map((item) => (item.id === editItem.id ? editItem : item))
      setItems(updatedItems)
      localStorage.setItem("wishlistItems", JSON.stringify(updatedItems))
      setIsEditDialogOpen(false)

      // Update selected item if it was the one being edited
      if (selectedItem && selectedItem.id === editItem.id) {
        setSelectedItem(editItem)
      }

      setEditItem(null)
      toast({
        title: "Updated!",
        description: "Item has been updated successfully.",
      })
    }
  }

  // Move item to checklist
  const moveToChecklist = (item: WishlistItem) => {
    // Create a new figure item from wishlist item
    const formattedId = String(nextId).padStart(3, "0")
    const newFigure: FigureItem = {
      id: formattedId,
      name: item.name,
      type: item.type,
      franchise: item.franchise,
      brand: item.brand,
      serie: item.serie,
      yearReleased: item.yearReleased,
      condition: "New", // Default value
      price: item.price,
      yearPurchase: new Date().getFullYear().toString(), // Current year
      upc: "",
      logo: item.logo,
      photo: item.photo,
      tagline: item.tagline,
      review: item.review,
      shelf: "Eins", // Default value
      display: "Silent Horrors", // Default value
      ranking: 0,
      comments: item.comments,
    }

    // Add to figures and remove from wishlist
    const updatedFigures = [...figureItems, newFigure]
    const updatedWishlist = items.filter((i) => i.id !== item.id)

    setFigureItems(updatedFigures)
    setItems(updatedWishlist)
    setNextId(nextId + 1)
    setSelectedItem(null)

    // Update localStorage
    localStorage.setItem("figureItems", JSON.stringify(updatedFigures))
    localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist))
    localStorage.setItem("nextId", (nextId + 1).toString())

    toast({
      title: "Moved to Checklist!",
      description: "Item has been moved to your checklist.",
    })
  }

  // Handle item click
  const handleItemClick = (item: WishlistItem) => {
    setSelectedItem(item)
  }

  // Back to list view
  const handleBackToList = () => {
    setSelectedItem(null)
  }

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">The Hunt List</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wishlist..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="yearReleased">Year Released</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          {sortOrder === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="figures" className="flex-1">
            Figures
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex-1">
            Accessories
          </TabsTrigger>
          <TabsTrigger value="props" className="flex-1">
            Props
          </TabsTrigger>
        </TabsList>

        {["figures", "accessories", "props"].map((type) => (
          <TabsContent key={type} value={type}>
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
                              src={selectedItem.logo || "/placeholder.svg"}
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
                              src={selectedItem.photo || "/placeholder.svg"}
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
                            Price:{" "}
                            <span className="font-normal text-white">
                              ${Number.parseInt(selectedItem.price).toLocaleString("es-CO")}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neon-green">
                            Released:{" "}
                            <span className="font-normal text-white">
                              {selectedItem.released ? (
                                <Check className="h-4 w-4 text-neon-green" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neon-green">
                            Buy:{" "}
                            <span className="font-normal text-white">
                              {selectedItem.buy ? (
                                <Check className="h-4 w-4 text-neon-green" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </span>
                          </p>
                        </div>
                        {selectedItem.trackingNumber && (
                          <div>
                            <p className="text-sm font-medium text-neon-green">
                              Tracking: <span className="font-normal text-white">{selectedItem.trackingNumber}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Review */}
                      {selectedItem.review && (
                        <div>
                          <p className="text-sm font-medium text-neon-green mb-2">Review:</p>
                          <div className="aspect-video w-full overflow-hidden relative">
                            <Link href={selectedItem.review} target="_blank" className="block relative">
                              <div className="aspect-video w-full bg-black/20 rounded-md flex items-center justify-center">
                                <Play className="h-12 w-12 text-white" />
                              </div>
                            </Link>
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

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 mt-4">
                        <Button variant="outline" onClick={() => handleEditItem(selectedItem)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button variant="outline" onClick={() => moveToChecklist(selectedItem)}>
                          <MoveRight className="mr-2 h-4 w-4" />
                          Move to Checklist
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteItem(selectedItem.id)}
                          className="bg-neon-green text-black hover:bg-neon-green/90"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Item list view
                  <div className="space-y-2">
                    {getFilteredItems(type).length > 0 ? (
                      getFilteredItems(type).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border border-border rounded-md cursor-pointer hover:bg-muted"
                          onClick={() => handleItemClick(item)}
                        >
                          <p className="font-medium">{item.name}</p>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#111] border-[#222]">
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                                Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer flex items-center"
                                onSelect={() => handleEditItem(item)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                                onClick={() => moveToChecklist(item)}
                              >
                                <MoveRight className="mr-2 h-4 w-4" />
                                Move to Checklist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No {type} found in your wishlist. Add some {type} to your wishlist!
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Wishlist Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={editItem.name}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-franchise">Franchise</Label>
                  <Input
                    id="edit-franchise"
                    value={editItem.franchise}
                    onChange={(e) => setEditItem({ ...editItem, franchise: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editItem.brand}
                    onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serie">Serie</Label>
                  <Input
                    id="edit-serie"
                    value={editItem.serie}
                    onChange={(e) => setEditItem({ ...editItem, serie: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    value={editItem.price}
                    onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-yearReleased">Year Released</Label>
                  <Input
                    id="edit-yearReleased"
                    value={editItem.yearReleased}
                    onChange={(e) => setEditItem({ ...editItem, yearReleased: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-logo">Logo URL</Label>
                  <Input
                    id="edit-logo"
                    value={editItem.logo}
                    onChange={(e) => setEditItem({ ...editItem, logo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-photo">Photo URL</Label>
                  <Input
                    id="edit-photo"
                    value={editItem.photo}
                    onChange={(e) => setEditItem({ ...editItem, photo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editItem.tagline}
                    onChange={(e) => setEditItem({ ...editItem, tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-review">Review URL</Label>
                  <Input
                    id="edit-review"
                    value={editItem.review}
                    onChange={(e) => setEditItem({ ...editItem, review: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comments">Comments</Label>
                <Textarea
                  id="edit-comments"
                  value={editItem.comments}
                  onChange={(e) => setEditItem({ ...editItem, comments: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={saveEditedItem} className="bg-neon-green text-black hover:bg-neon-green/90">
              <Edit className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
