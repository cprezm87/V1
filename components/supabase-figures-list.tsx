"use client"

import { useState } from "react"
import { useSupabaseCollection } from "./supabase-collection-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Edit, Star } from "lucide-react"
import Image from "next/image"
import { convertGoogleDriveUrl } from "@/lib/utils"

export function SupabaseFiguresList() {
  const { figures, loading, error, deleteFigure } = useSupabaseCollection()
  const [selectedFigure, setSelectedFigure] = useState<any>(null)

  // Renderizar estrellas para el ranking
  const renderStars = (ranking?: number) => {
    if (!ranking) return null
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
          <p className="text-red-500">Error loading figures: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (figures.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No figures found in the database.</p>
        </CardContent>
      </Card>
    )
  }

  if (selectedFigure) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button variant="outline" onClick={() => setSelectedFigure(null)} className="mb-4">
            Back to list
          </Button>

          <div className="space-y-4">
            {selectedFigure.photo && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={convertGoogleDriveUrl(selectedFigure.photo) || "/placeholder.svg"}
                  alt={selectedFigure.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <h2 className="text-2xl font-bold">{selectedFigure.name}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Brand: <span className="font-normal text-white">{selectedFigure.brand}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Franchise: <span className="font-normal text-white">{selectedFigure.franchise}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Type: <span className="font-normal text-white">{selectedFigure.type}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Serie: <span className="font-normal text-white">{selectedFigure.serie || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Year Released: <span className="font-normal text-white">{selectedFigure.yearReleased || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Condition: <span className="font-normal text-white">{selectedFigure.condition || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Price: <span className="font-normal text-white">${selectedFigure.price || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Year Purchase: <span className="font-normal text-white">{selectedFigure.yearPurchase || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Shelf: <span className="font-normal text-white">{selectedFigure.shelf || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Display: <span className="font-normal text-white">{selectedFigure.display || "N/A"}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-neon-green">
                  Ranking: <span className="font-normal text-white">{renderStars(selectedFigure.ranking)}</span>
                </p>
              </div>
            </div>

            {selectedFigure.comments && (
              <div>
                <p className="text-sm font-medium text-neon-green">Comments:</p>
                <p className="text-sm">{selectedFigure.comments}</p>
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
                  deleteFigure(selectedFigure.id)
                  setSelectedFigure(null)
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
      {figures.map((figure) => (
        <Card key={figure.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedFigure(figure)}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{figure.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {figure.brand} - {figure.franchise}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteFigure(figure.id)
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
