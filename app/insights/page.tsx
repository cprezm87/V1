"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface FigureItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  condition: string
  price: string
  yearPurchase: string
  upc: string
  logo: string
  photo: string
  tagline: string
  review: string
  shelf: string
  display: string
  ranking: number
  comments: string
}

interface WishlistItem {
  id: string
  name: string
  type: string
  franchise: string
  brand: string
  serie: string
  yearReleased: string
  price: string
  logo: string
  photo: string
  tagline: string
  review: string
  released: boolean
  buy: boolean
  comments: string
}

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

export default function InsightsPage() {
  const [figureItems, setFigureItems] = useState<FigureItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [customItems, setCustomItems] = useState<CustomItem[]>([])
  const [brandData, setBrandData] = useState<{ name: string; count: number }[]>([])
  const [typeData, setTypeData] = useState<{ name: string; value: number }[]>([])

  // Load items from localStorage on component mount
  useEffect(() => {
    const storedFigures = localStorage.getItem("figureItems")
    const storedWishlist = localStorage.getItem("wishlistItems")
    const storedCustoms = localStorage.getItem("customItems")

    if (storedFigures) setFigureItems(JSON.parse(storedFigures))
    if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist))
    if (storedCustoms) setCustomItems(JSON.parse(storedCustoms))
  }, [])

  // Calculate brand breakdown
  useEffect(() => {
    if (figureItems.length > 0) {
      const brandCounts: Record<string, number> = {}

      figureItems.forEach((item) => {
        if (brandCounts[item.brand]) {
          brandCounts[item.brand]++
        } else {
          brandCounts[item.brand] = 1
        }
      })

      const brandDataArray = Object.entries(brandCounts)
        .map(([name, count]) => ({
          name,
          count,
        }))
        .sort((a, b) => b.count - a.count)

      setBrandData(brandDataArray)
    }
  }, [figureItems])

  // Calculate type breakdown
  useEffect(() => {
    if (figureItems.length > 0) {
      const typeCounts: Record<string, number> = {}

      figureItems.forEach((item) => {
        if (typeCounts[item.type]) {
          typeCounts[item.type]++
        } else {
          typeCounts[item.type] = 1
        }
      })

      const typeDataArray = Object.entries(typeCounts).map(([name, value]) => ({
        name,
        value,
      }))

      setTypeData(typeDataArray)
    }
  }, [figureItems])

  // Calculate total collection value
  const totalCollectionValue = figureItems.reduce((total, item) => {
    return total + (Number.parseInt(item.price) || 0)
  }, 0)

  // Total items count
  const totalItems = figureItems.length + wishlistItems.length + customItems.length

  // Colors for pie chart
  const COLORS = ["#83FF00", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className="w-full py-6 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Insights</h1>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Collection Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Summary of your horror figure collection:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Checklist Items</p>
                  <p className="text-3xl font-bold text-neon-green">{figureItems.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="text-3xl font-bold text-neon-green">{wishlistItems.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Custom Items</p>
                  <p className="text-3xl font-bold text-neon-green">{customItems.length}</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Total Collection Value</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-neon-green">${totalCollectionValue.toLocaleString("es-CO")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Total Items</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-4xl font-bold text-neon-green">{totalItems}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Collection Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="brands">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="brands" className="flex-1">
                  Brands
                </TabsTrigger>
                <TabsTrigger value="types" className="flex-1">
                  Types
                </TabsTrigger>
              </TabsList>

              <TabsContent value="brands">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={brandData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Count" fill="#83FF00" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="types">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-neon-green">Brand Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Count of items by individual brand:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {brandData.map((brand) => (
                <Card key={brand.name}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-neon-green font-bold">{brand.count}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
