"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseFiguresList } from "@/components/supabase-figures-list"
import { SupabaseWishlistList } from "@/components/supabase-wishlist-list"
import { SupabaseCustomsList } from "@/components/supabase-customs-list"

export default function SupabaseDataPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Supabase Data</h1>
        <p className="text-muted-foreground">View and manage your data stored in Supabase</p>
      </div>

      <Tabs defaultValue="figures" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="figures" className="flex-1">
            Figures
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
              <CardTitle>Figures</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseFiguresList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardHeader>
              <CardTitle>Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseWishlistList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customs">
          <Card>
            <CardHeader>
              <CardTitle>Customs</CardTitle>
            </CardHeader>
            <CardContent>
              <SupabaseCustomsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
