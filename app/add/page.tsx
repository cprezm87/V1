"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddFigureForm } from "@/components/add-figure-form"
import { AddWishlistForm } from "@/components/add-wishlist-form"
import { AddCustomForm } from "@/components/add-custom-form"

export default function AddPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Añadir Item</h1>
      </div>

      <Tabs defaultValue="figures" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="figures" className="flex-1">
            Checklist
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex-1">
            Wishlist
          </TabsTrigger>
          <TabsTrigger value="customs" className="flex-1">
            Customs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="figures">
          <Card>
            <CardHeader>
              <CardTitle>Añadir a Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <AddFigureForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Añadir a Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <AddWishlistForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customs">
          <Card>
            <CardHeader>
              <CardTitle>Añadir Custom</CardTitle>
            </CardHeader>
            <CardContent>
              <AddCustomForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
