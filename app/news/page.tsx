"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedNewsFeed } from "@/components/enhanced-news-feed"
import { BrandNewsFeed } from "@/components/brand-news-feed"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Figure News</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="news" className="flex-1">
            News Sources
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex-1">
            Brand Updates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Latest Figure News</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedNewsFeed initialSource="fwoosh" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands">
          <Card>
            <CardHeader>
              <CardTitle>Brand Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <BrandNewsFeed />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
