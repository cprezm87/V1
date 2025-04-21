"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Calendar, Clock, RefreshCw } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import type { NewsItem } from "@/lib/news-fetcher"

interface EnhancedNewsFeedProps {
  initialSource?: string
}

export function EnhancedNewsFeed({ initialSource = "fwoosh" }: EnhancedNewsFeedProps) {
  const { t } = useTheme()
  const [activeSource, setActiveSource] = useState(initialSource)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null)

  const sources = [
    { id: "fwoosh", name: "The Fwoosh" },
    { id: "toyark", name: "The Toyark" },
    { id: "toynewsi", name: "Toy News International" },
    { id: "afi", name: "Action Figure Insider" },
    { id: "figurerealm", name: "Figure Realm" },
  ]

  const fetchNews = async (source: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/news?source=${source}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch news from ${source}`)
      }
      const data = await response.json()
      setNews(data.news)

      // Set the first item as selected by default if available
      if (data.news.length > 0 && !selectedItem) {
        setSelectedItem(data.news[0])
      }
    } catch (err) {
      console.error(`Error fetching news from ${source}:`, err)
      setError(`Failed to load news from ${source}. Please try again later.`)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(activeSource)
  }, [activeSource])

  const handleRefresh = () => {
    fetchNews(activeSource)
  }

  const handleSourceChange = (source: string) => {
    setActiveSource(source)
    setSelectedItem(null)
  }

  const handleItemClick = (item: NewsItem) => {
    setSelectedItem(item)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neon-green">Figure News</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      <Tabs value={activeSource} onValueChange={handleSourceChange}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {sources.map((source) => (
            <TabsTrigger key={source.id} value={source.id} className="whitespace-nowrap">
              {source.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {sources.map((source) => (
          <TabsContent key={source.id} value={source.id} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* News List - 1/3 width */}
              <div className="md:col-span-1 space-y-4">
                {loading ? (
                  // Loading skeletons
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-3 w-1/4" />
                              <Skeleton className="h-3 w-1/4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : error ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-red-500">{error}</p>
                    </CardContent>
                  </Card>
                ) : news.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-muted-foreground">No news available from this source.</p>
                    </CardContent>
                  </Card>
                ) : (
                  news.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedItem?.id === item.id ? "border-l-4 border-neon-green" : ""
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium line-clamp-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.date}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* News Detail - 2/3 width */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  {selectedItem ? (
                    <>
                      <CardHeader>
                        <CardTitle>{selectedItem.title}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                          <span>Source: {selectedItem.source}</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {selectedItem.date}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative w-full h-64 mb-4 overflow-hidden rounded-md">
                          <Image
                            src={selectedItem.imageUrl || "/placeholder.svg?height=300&width=600"}
                            alt={selectedItem.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-muted-foreground mb-4">{selectedItem.description}</p>
                        <Badge>{selectedItem.category}</Badge>
                      </CardContent>
                      <CardFooter className="justify-end">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => window.open(selectedItem.sourceUrl, "_blank")}
                        >
                          <span>Read Full Article</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </>
                  ) : (
                    <CardContent className="flex items-center justify-center h-full min-h-[400px]">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-muted-foreground mb-2">Select an article</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose an article from the list to view its details
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
