"use client"

import { useState } from "react"
import { useSupabaseCollection } from "./supabase-collection-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Edit, Check, X } from "lucide-react"
import Image from "next/image"
import { convertGoogleDriveUrl } from "@/lib/utils"

export function SupabaseWishlistList() {
  const { wishlist, loading, error, deleteWishlistItem } = useSupabaseCollection()
  const [selectedItem, setSelectedItem] = useState<any>(null)

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error loading wishlist: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (wishlist.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No wishlist items found in the database.</p>
        </CardContent>
      </Card>
    )
  }

  if (selectedItem) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button variant="outline" onClick={() => setSelectedItem(null)} className="mb-4">
            Back to list
          </Button>

          <div className="space-y-4">
            {selectedItem.photo && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={convertGoogleDriveUrl(selectedItem.photo) || "/placeholder.svg"}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Brand: <span className="font-normal text-white">{selectedItem.brand}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Franchise: <span className="font-normal text-white">{selectedItem.franchise}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Type: <span className="font-normal text-white">{selectedItem.type}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Serie: <span className="font-normal text-white">{selectedItem.serie || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Year Released: <span className="font-normal text-white">{selectedItem.yearReleased || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Price: <span className="font-normal text-white">${selectedItem.price || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Released:{" "}
                  <span className="font-normal text-white">
                    {selectedItem.released ? (
                      <Check className="h-4 w-4 text-green-500" />
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
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </span>
                </p>
              </div>
              {selectedItem.trackingNumber && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-neon-green">
                    Tracking Number: <span className="font-normal text-white">{selectedItem.trackingNumber}</span>
                  </p>
                </div>
              )}
            </div>

            {selectedItem.comments && (
              <div>
                <p className="text-sm font-medium text-neon-green">Comments:</p>
                <p className="text-sm">{selectedItem.comments}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => {
                  deleteWishlistItem(selectedItem.id)
                  setSelectedItem(null)
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {wishlist.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedItem(item)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.brand} - {item.franchise}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteWishlistItem(item.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
