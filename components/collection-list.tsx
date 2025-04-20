"use client"

import { useCollection } from "@/contexts/collection-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FirestoreIndexHelper } from "./firestore-index-helper"

export function CollectionList() {
  const { items, loading, error } = useCollection()

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

  return (
    <div className="space-y-4">
      <FirestoreIndexHelper error={error} />

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No hay items en tu colección. ¡Añade uno para empezar!</p>
          </CardContent>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Marca:</span> {item.brand}
                </div>
                <div>
                  <span className="font-medium">Categoría:</span> {item.category}
                </div>
                {item.series && (
                  <div>
                    <span className="font-medium">Serie:</span> {item.series}
                  </div>
                )}
                {item.price && (
                  <div>
                    <span className="font-medium">Precio:</span> ${item.price}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
