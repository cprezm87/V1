"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoreHorizontal, X, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ViewSelector } from "@/components/view-selector"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { convertGoogleDriveUrl } from "@/lib/utils"

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

export default function CustomsPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<CustomItem[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [editItem, setEditItem] = useState<CustomItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CustomItem | null>(null)
  const [activeTab, setActiveTab] = useState("figures")
  const [viewMode, setViewMode] = useState("list") // list, grid, table, data-grid

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem("customItems")
    if (storedItems) {
      setItems(JSON.parse(storedItems))
    }
  }, [])

  // Filter items by type and search term
  const getFilteredItems = (type: string) => {
    return items
      .filter(
        (item) =>
          item.type.toLowerCase() === type.toLowerCase() &&
          (searchTerm === "" ||
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.franchise.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      .sort((a, b) => {
        if (sortBy === "name" || sortBy === "franchise") {
          return sortOrder === "asc" ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy])
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
    localStorage.setItem("customItems", JSON.stringify(updatedItems))
    toast({
      title: "Deleted!",
      description: "Item has been removed from your custom's collection.",
    })
    setSelectedItem(null)
  }

  // Handle item edit
  const handleEditItem = (item: CustomItem) => {
    setEditItem({ ...item })
    setIsEditDialogOpen(true)
  }

  // Save edited item
  const saveEditedItem = () => {
    if (editItem) {
      const updatedItems = items.map((item) => (item.id === editItem.id ? editItem : item))
      setItems(updatedItems)
      localStorage.setItem("customItems", JSON.stringify(updatedItems))
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

  // Handle item click
  const handleItemClick = (item: CustomItem) => {
    setSelectedItem(item)
  }

  // Back to list view
  const handleBackToList = () => {
    setSelectedItem(null)
  }

  // Render list view
  const renderListView = (items: CustomItem[]) => {
    return (
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
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
                  <DropdownMenuItem className="cursor-pointer flex items-center" onSelect={() => handleEditItem(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
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
            No custom {activeTab} found. Add some custom {activeTab} to your collection!
          </div>
        )}
      </div>
    )
  }

  // Render grid view
  const renderGridView = (items: CustomItem[]) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:border-neon-green transition-colors"
              onClick={() => handleItemClick(item)}
            >
              <CardContent className="p-3">
                <div className="relative h-40 w-full mb-2 bg-black/10 rounded-md overflow-hidden">
                  {item.logo ? (
                    <img
                      src={convertGoogleDriveUrl(item.logo) || "/placeholder.svg"}
                      alt={item.name}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.franchise}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-neon-green">Head: {item.head}</p>
                    <p className="text-xs text-neon-green">Body: {item.body}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No custom {activeTab} found. Add some custom {activeTab} to your collection!
          </div>
        )}
      </div>
    )
  }

  // Render table view
  const renderTableView = (items: CustomItem[]) => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Franchise</TableHead>
              <TableHead>Head</TableHead>
              <TableHead>Body</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleItemClick(item)}
                >
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.franchise}</TableCell>
                  <TableCell>{item.head}</TableCell>
                  <TableCell>{item.body}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditItem(item)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteItem(item.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No custom {activeTab} found. Add some custom {activeTab} to your collection!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Render data grid view
  const renderDataGridView = (items: CustomItem[]) => {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px] bg-muted p-2 border-b font-medium text-sm">
          <div>Name</div>
          <div>Franchise</div>
          <div>Head</div>
          <div>Body</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_100px] p-2 border-b hover:bg-muted/50 cursor-pointer text-sm"
                onClick={() => handleItemClick(item)}
              >
                <div className="truncate">{item.name}</div>
                <div className="truncate">{item.franchise}</div>
                <div className="truncate">{item.head}</div>
                <div className="truncate">{item.body}</div>
                <div className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditItem(item)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteItem(item.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No custom {activeTab} found. Add some custom {activeTab} to your collection!
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render the appropriate view based on viewMode
  const renderView = (items: CustomItem[]) => {
    switch (viewMode) {
      case "grid":
        return renderGridView(items)
      case "table":
        return renderTableView(items)
      case "data-grid":
        return renderDataGridView(items)
      case "list":
      default:
        return renderListView(items)
    }
  }

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customization Concepts</h1>
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

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>

        <ViewSelector currentView={viewMode} onViewChange={setViewMode} />
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

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-neon-green">
                            Franchise: <span className="font-normal text-white">{selectedItem.franchise}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neon-green">
                            Body: <span className="font-normal text-white">{selectedItem.body}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neon-green">
                            Head: <span className="font-normal text-white">{selectedItem.head}</span>
                          </p>
                        </div>
                      </div>

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
                  // Render the appropriate view based on viewMode
                  renderView(getFilteredItems(type))
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
                  <Label htmlFor="edit-head">Head</Label>
                  <Input
                    id="edit-head"
                    value={editItem.head}
                    onChange={(e) => setEditItem({ ...editItem, head: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-body">Body</Label>
                  <Input
                    id="edit-body"
                    value={editItem.body}
                    onChange={(e) => setEditItem({ ...editItem, body: e.target.value })}
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
                  <Label htmlFor="edit-tagline">Tagline</Label>
                  <Input
                    id="edit-tagline"
                    value={editItem.tagline}
                    onChange={(e) => setEditItem({ ...editItem, tagline: e.target.value })}
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
