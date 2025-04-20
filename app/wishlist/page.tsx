"use client"

import { useState } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoveRight, MoreHorizontal, Play, Check, X } from "lucide-react"
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
import { useCollection } from "@/contexts/collection-context"
import type { WishlistItem } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export default function WishlistPage() {
  const { toast } = useToast()
  const { wishlistItems, loading, error, updateWishlistItem, deleteWishlistItem, moveWishlistToFigure } =
    useCollection()

  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [editItem, setEditItem] = useState<WishlistItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Filter items by type and search term
  const getFilteredItems = (type: string) => {
    return wishlistItems
      .filter(
        (item) =>
          item.type?.toLowerCase() === type.toLowerCase() &&
          (searchTerm === "" ||
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.franchise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortBy === "name" || sortBy === "franchise" || sortBy === "brand") {
          return sortOrder === "asc"
            ? (a[sortBy] || "").localeCompare(b[sortBy] || "")
            : (b[sortBy] || "").localeCompare(a[sortBy] || "")
        } else if (sortBy === "price" || sortBy === "yearReleased") {
          const aValue = a[sortBy] ? Number.parseFloat(a[sortBy]) : 0
          const bValue = b[sortBy] ? Number.parseFloat(b[sortBy]) : 0
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue
        } else {
          // Default sort by name
          return sortOrder === "asc"
            ? (a.name || "").localeCompare(b.name || "")
            : (b.name || "").localeCompare(a.name || "")
        }
      })
  }

  // Handle item deletion
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteWishlistItem(id)

      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }

      toast({
        title: "Deleted!",
        description: "Item has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle item edit
  const handleEditItem = (item: WishlistItem) => {
    setEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Save edited item
  const saveEditedItem = async () => {
    if (editItem && editItem.id) {
      try {
        await updateWishlistItem(editItem.id, editItem)

        // Update selected item if it's the one being edited
        if (selectedItem?.id === editItem.id) {
          setSelectedItem(editItem)
        }

        setIsEditDialogOpen(false)
        setEditItem(null)

        toast({
          title: "Updated!",
          description: "Item has been updated successfully.",
        })
      } catch (error) {
        console.error("Error updating item:", error)
        toast({
          title: "Error",
          description: "Failed to update item. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Move item to checklist
  const handleMoveToChecklist = async (item: WishlistItem) => {
    try {
      await moveWishlistToFigure(item)

      if (selectedItem?.id === item.id) {
        setSelectedItem(null)
      }

      toast({
        title: "Moved to Checklist!",
        description: "Item has been moved to your checklist.",
      })
    } catch (error) {
      console.error("Error moving item to checklist:", error)
      toast({
        title: "Error",
        description: "Failed to move item to checklist. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle item click
  const handleItemClick = (item: WishlistItem) => {
    setSelectedItem(item)
  }

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Wishlist</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de elementos - 1/3 del ancho en pantallas medianas y grandes */}
        <div className="md:col-span-1">
          <Tabs defaultValue="figures" className="w-full">
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

            <TabsContent value="figures">
              <Card>
                <CardContent className="space-y-2 pt-6">
                  {loading.wishlist ? (
                    // Loading skeleton
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ))
                  ) : getFilteredItems("figures").length > 0 ? (
                    getFilteredItems("figures").map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? "border-l-4 border-neon-green bg-muted/50" : ""
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
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
                              onClick={() => handleMoveToChecklist(item)}
                            >
                              <MoveRight className="mr-2 h-4 w-4" />
                              Move to Checklist
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                              onClick={() => item.id && handleDeleteItem(item.id)}
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
                      No figures found in your wishlist. Add some figures to your wishlist!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accessories">
              <Card>
                <CardContent className="space-y-2 pt-6">
                  {loading.wishlist ? (
                    // Loading skeleton
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ))
                  ) : getFilteredItems("accessories").length > 0 ? (
                    getFilteredItems("accessories").map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? "border-l-4 border-neon-green bg-muted/50" : ""
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
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
                              onClick={() => handleMoveToChecklist(item)}
                            >
                              <MoveRight className="mr-2 h-4 w-4" />
                              Move to Checklist
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                              onClick={() => item.id && handleDeleteItem(item.id)}
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
                      No accessories found in your wishlist. Add some accessories to your wishlist!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="props">
              <Card>
                <CardContent className="space-y-2 pt-6">
                  {loading.wishlist ? (
                    // Loading skeleton
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </div>
                      ))
                  ) : getFilteredItems("props").length > 0 ? (
                    getFilteredItems("props").map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors ${
                          selectedItem?.id === item.id ? "border-l-4 border-neon-green bg-muted/50" : ""
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
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
                              onClick={() => handleMoveToChecklist(item)}
                            >
                              <MoveRight className="mr-2 h-4 w-4" />
                              Move to Checklist
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-neon-green focus:text-black focus:bg-neon-green"
                              onClick={() => item.id && handleDeleteItem(item.id)}
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
                      No props found in your wishlist. Add some props to your wishlist!
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Tarjeta de información detallada - 2/3 del ancho en pantallas medianas y grandes */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedItem ? (
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
                        Year Released: <span className="font-normal text-white">{selectedItem.year_released}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neon-green">
                        Price:{" "}
                        <span className="font-normal text-white">
                          ${selectedItem.price ? Number.parseFloat(selectedItem.price).toLocaleString("es-CO") : "N/A"}
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
                    <Button variant="outline" onClick={() => handleMoveToChecklist(selectedItem)}>
                      <MoveRight className="mr-2 h-4 w-4" />
                      Move to Checklist
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => selectedItem.id && handleDeleteItem(selectedItem.id)}
                      className="bg-neon-green text-black hover:bg-neon-green/90"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium text-muted-foreground">No item selected</h3>
                    <p className="text-muted-foreground">Select an item from the list to view its details</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

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
                    value={editItem.year_released}
                    onChange={(e) => setEditItem({ ...editItem, year_released: e.target.value })}
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
