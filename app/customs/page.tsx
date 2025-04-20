"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash2, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

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
  }

  // Handle item edit
  const handleEditItem = (item: CustomItem) => {
    // In a real application, you would open an edit form
    // For now, we'll just show a toast
    toast({
      title: "Edit Item",
      description: `Editing ${item.name}`,
    })
  }

  // Render custom item dialog content
  const renderCustomItemDialogContent = (item: CustomItem) => (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      {item.logo && (
        <div className="w-full">
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={item.logo || "/placeholder.svg"}
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

      {/* Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-neon-green">
            Franchise: <span className="font-normal text-white">{item.franchise}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Body: <span className="font-normal text-white">{item.body}</span>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-neon-green">
            Head: <span className="font-normal text-white">{item.head}</span>
          </p>
        </div>
      </div>

      {/* Comments */}
      {item.comments && (
        <div>
          <p className="text-sm font-medium text-neon-green">
            Comments: <span className="font-normal text-white">{item.comments}</span>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="outline" onClick={() => handleEditItem(item)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => handleDeleteItem(item.id)}
          className="bg-neon-green text-black hover:bg-neon-green/90"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  )

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
              {getFilteredItems("figures").length > 0 ? (
                getFilteredItems("figures").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderCustomItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderCustomItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
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
                  No custom figures found. Add some custom figures to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessories">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {getFilteredItems("accessories").length > 0 ? (
                getFilteredItems("accessories").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderCustomItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderCustomItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
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
                  No custom accessories found. Add some custom accessories to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="props">
          <Card>
            <CardContent className="space-y-2 pt-6">
              {getFilteredItems("props").length > 0 ? (
                getFilteredItems("props").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="font-medium truncate cursor-pointer hover:text-neon-green">{item.name}</span>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader></DialogHeader>
                        {renderCustomItemDialogContent(item)}
                      </DialogContent>
                    </Dialog>
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
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              View details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader></DialogHeader>
                            {renderCustomItemDialogContent(item)}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem
                          className="cursor-pointer flex items-center"
                          onSelect={() => handleEditItem(item)}
                        >
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
                  No custom props found. Add some custom props to your collection!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
