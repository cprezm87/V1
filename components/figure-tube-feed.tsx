"use client"

import { useState, useEffect } from "react"
import Image from "next/image" // Añadida esta importación que faltaba
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Info, Play, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface YouTubeChannelData {
  name: string
  url: string
  description: string
  subscribers?: string
  videos?: string[]
  featured: {
    title: string
    description: string
    imageUrl: string
    url: string
    views?: string
    date?: string
  }[]
}

export function FigureTubeFeed() {
  const { t } = useTheme()
  const [activeTab, setActiveTab] = useState("reviewspot")
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [channels, setChannels] = useState<Record<string, YouTubeChannelData>>({
    reviewspot: {
      name: "The Review Spot",
      url: "https://www.youtube.com/@TheReviewSpot",
      description: "Action figure reviews, unboxings, and comparisons with a focus on collectibles",
      subscribers: "50K+",
      featured: [
        {
          title: "NECA Terrifier 2 Art the Clown Ultimate Figure Review",
          description: "Detailed review of NECA's Ultimate Art the Clown figure from Terrifier 2",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example1",
          views: "25K",
          date: "2 weeks ago",
        },
        {
          title: "Top 10 Horror Action Figures of 2023",
          description: "Countdown of the best horror action figures released this year",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example2",
          views: "42K",
          date: "1 month ago",
        },
        {
          title: "McFarlane Toys Horror Wave Unboxing",
          description: "Unboxing the latest horror wave from McFarlane Toys",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example3",
          views: "18K",
          date: "3 months ago",
        },
      ],
    },
    mrevilcheese: {
      name: "Mr. Evil Cheese",
      url: "https://www.youtube.com/@mrevilcheese",
      description: "Horror figure collector showcasing rare and limited edition horror collectibles",
      subscribers: "35K+",
      featured: [
        {
          title: "Mezco One:12 Michael Myers Review",
          description: "Detailed review of Mezco's One:12 Collective Michael Myers figure",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example4",
          views: "30K",
          date: "3 weeks ago",
        },
        {
          title: "Horror Collection Tour 2023",
          description: "Full tour of my updated horror figure collection",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example5",
          views: "65K",
          date: "2 months ago",
        },
      ],
    },
    arealhorrorshow: {
      name: "A Real Horror Show",
      url: "https://www.youtube.com/@ARealHorrorShow",
      description: "Dedicated to horror collectibles, movie props, and limited edition figures",
      subscribers: "28K+",
      featured: [
        {
          title: "Trick or Treat Studios Ghost Face Figure Review",
          description: "In-depth look at the new Ghost Face figure from Trick or Treat Studios",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example6",
          views: "22K",
          date: "1 week ago",
        },
        {
          title: "Horror Figure Photography Tips",
          description: "How to take amazing photos of your horror figure collection",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example7",
          views: "18K",
          date: "1 month ago",
        },
      ],
    },
    habitoys: {
      name: "Habi Toys",
      url: "https://www.youtube.com/@habitoys",
      description: "Toy reviews and unboxings with a focus on horror and sci-fi collectibles",
      subscribers: "42K+",
      featured: [
        {
          title: "NECA Ultimate Pinhead Figure Review",
          description: "Detailed review of NECA's Ultimate Pinhead figure from Hellraiser",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example8",
          views: "33K",
          date: "2 weeks ago",
        },
        {
          title: "Horror Figure Hunting Vlog",
          description: "Join me as I hunt for rare horror figures at conventions and stores",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example9",
          views: "27K",
          date: "3 weeks ago",
        },
      ],
    },
    samasselection: {
      name: "Samas Selection",
      url: "https://www.youtube.com/@SamasSelection",
      description: "Curated reviews of premium collectibles and limited edition horror figures",
      subscribers: "25K+",
      featured: [
        {
          title: "Hot Toys Pennywise Figure Review",
          description: "Premium review of Hot Toys' Pennywise figure from IT",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example10",
          views: "40K",
          date: "1 month ago",
        },
        {
          title: "Top 5 Premium Horror Figures Worth Collecting",
          description: "Guide to the best high-end horror figures for serious collectors",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example11",
          views: "38K",
          date: "2 months ago",
        },
      ],
    },
  })

  const [rssFeeds, setRssFeeds] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Set the first video as selected by default
      if (channels[activeTab]?.featured.length > 0) {
        setSelectedVideo(channels[activeTab].featured[0])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab, channels])

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video)
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold text-neon-green">FigureTube</h3>
      <Card>
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value)
              setLoading(true)
            }}
          >
            <TabsList className="w-full justify-start overflow-x-auto bg-card border-b rounded-none">
              {Object.entries(channels).map(([key, channel]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-none data-[state=active]:bg-background whitespace-nowrap"
                >
                  {channel.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(channels).map(([key, channel]) => (
              <TabsContent key={key} value={key} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Lista de videos - 1/3 del ancho */}
                  <div className="border-r">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                      {channel.subscribers && (
                        <Badge variant="outline" className="mt-2">
                          <Youtube className="h-3 w-3 mr-1" /> {channel.subscribers} subscribers
                        </Badge>
                      )}
                      <div className="mt-2">
                        <Link
                          href={channel.url}
                          target="_blank"
                          className="text-neon-green hover:underline text-sm flex items-center"
                        >
                          Visit YouTube Channel <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                    <div className="divide-y">
                      {loading
                        ? // Skeleton loading state
                          Array(3)
                            .fill(0)
                            .map((_, i) => (
                              <div key={i} className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3 mt-1" />
                              </div>
                            ))
                        : // Actual content
                          channel.featured.map((video, i) => (
                            <div
                              key={i}
                              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedVideo?.title === video.title ? "border-l-4 border-neon-green bg-muted/50" : ""
                              }`}
                              onClick={() => handleVideoSelect(video)}
                            >
                              <h4 className="font-medium">{video.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                {video.views && <span>{video.views} views</span>}
                                {video.date && <span>• {video.date}</span>}
                                <Badge
                                  variant="outline"
                                  className="bg-red-500/20 text-red-500 border-red-500/50 text-xs"
                                >
                                  <Play className="h-2 w-2 mr-1" /> Video
                                </Badge>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Contenido del video - 2/3 del ancho */}
                  <div className="md:col-span-2 p-6">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ) : selectedVideo ? (
                      <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedVideo.title}</h2>
                        <div className="mb-6 aspect-video relative">
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Play className="h-16 w-16 text-white opacity-75" />
                          </div>
                          <Image
                            src={selectedVideo.imageUrl || "/placeholder.svg"}
                            alt={selectedVideo.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <p className="mb-4">{selectedVideo.description}</p>
                        <Button asChild className="bg-neon-green text-black hover:bg-neon-green/90">
                          <Link href={selectedVideo.url} target="_blank">
                            Watch on YouTube <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Select a video to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  )
}
