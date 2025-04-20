"use client"

import { useState } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoreHorizontal, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { useCollection } from "@/contexts/collection-context"
import type { CustomItem } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomsPage() {
  const { toast } = useToast()
  const { customItems, loading, error, updateCustomItem, deleteCustomItem } = useCollection()

  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<CustomItem | null>(null)
  const [editItem, setEditItem] = useState<CustomItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Filter items by search term
  const getFilteredItems = () => {
    return customItems
      .filter(
        (item) =>
          searchTerm === "" ||
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.franchise?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "name" || sortBy === "franchise") {
          return sortOrder === "asc"
            ? (a[sortBy] || "").localeCompare(b[sortBy] || "")
            : (b[sortBy] || "").localeCompare(a[sortBy] || "")
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
      await deleteCustomItem(id)

      if (selectedItem?.id === id) {
        setSelectedItem(null)
      }

      toast({
        title: "Deleted!",
        description: "Item has been removed from your custom's collection.",
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
  const handleEditItem = (item: CustomItem) => {
    setEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Save edited item
  const saveEditedItem = async () => {
    if (editItem && editItem.id) {
      try {
        await updateCustomItem(editItem.id, editItem)

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

  // Handle item click
  const handleItemClick = (item: CustomItem) => {
    setSelectedItem(item)
  }

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Custom's</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customs..."
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
              <SelectItem value="franchise">Franchise</SelectItem>
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
          <Card>
            <CardContent className="space-y-2 pt-6">
              {loading.customs ? (
                // Loading skeleton
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-2">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))
              ) : getFilteredItems().length > 0 ? (
                getFilteredItems().map((item) => (
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
                  No custom items found. Add some custom items to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tarjeta de información detallada - 2/3 del ancho en pantallas medianas y grandes */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              {selectedItem ? (
                <div className="flex flex-col gap-6">
                  {/* Name and Tagline */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-neon-green">{selectedItem.name}</h3>
                    {selectedItem.tagline && <p className="text-base italic">{selectedItem.tagline}</p>}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neon-green">
                        Franchise: <span className="font-normal text-white">{selectedItem.franchise}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button variant="outline" onClick={() => handleEditItem(selectedItem)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
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
            <DialogTitle>Edit Custom Item</DialogTitle>
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
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editItem.tagline}
                    onChange={(e) => setEditItem({ ...editItem, tagline: e.target.value })}
                  />
                </div>
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
