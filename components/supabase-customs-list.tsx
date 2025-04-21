"use client"

import { useState } from "react"
import { useSupabaseCollection } from "./supabase-collection-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Edit } from "lucide-react"
import Image from "next/image"
import { convertGoogleDriveUrl } from "@/lib/utils"

export function SupabaseCustomsList() {
  const { customs, loading, error, deleteCustomItem } = useSupabaseCollection()
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
          <p className="text-red-500">Error loading customs: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (customs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No custom items found in the database.</p>
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
            {selectedItem.logo && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={convertGoogleDriveUrl(selectedItem.logo) || "/placeholder.svg"}
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
                  Head: <span className="font-normal text-white">{selectedItem.head}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Body: <span className="font-normal text-white">{selectedItem.body}</span>
                </p>
              </div>
              {selectedItem.tagline && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-neon-green">
                    Tagline: <span className="font-normal text-white">{selectedItem.tagline}</span>
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
                  deleteCustomItem(selectedItem.id)
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
      {customs.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedItem(item)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.franchise} - {item.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCustomItem(item.id)
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
