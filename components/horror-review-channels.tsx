"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { Calendar, ExternalLink, Info, Play, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ReviewChannelData {
  name: string
  url: string
  description: string
  subscribers?: string
  videos: {
    title: string
    description: string
    imageUrl: string
    url: string
    date: string
    duration?: string
    views?: string
    category?: string
  }[]
}

export function HorrorReviewChannels() {
  const { t } = useTheme()
  const [activeTab, setActiveTab] = useState("opacoperez")
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [channels, setChannels] = useState<Record<string, ReviewChannelData>>({
    opacoperez: {
      name: "Opaco Pérez",
      url: "https://www.youtube.com/@OpacoPerez",
      description: "Horror movie reviews, figure unboxings, and collection showcases from a passionate collector",
      subscribers: "10K+",
      videos: [
        {
          title: "Terrifier 2 - Movie Review",
          description:
            "My in-depth review of Terrifier 2, discussing the practical effects, performances, and how it compares to the original",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example1",
          date: "October 15, 2023",
          duration: "15:42",
          views: "8.5K",
          category: "Movie Review",
        },
        {
          title: "NECA Ultimate Art the Clown Unboxing",
          description: "Unboxing and detailed look at NECA's Ultimate Art the Clown figure from Terrifier",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example2",
          date: "September 28, 2023",
          duration: "12:18",
          views: "7.2K",
          category: "Figure Unboxing",
        },
        {
          title: "Horror Collection Tour 2023",
          description:
            "Complete tour of my horror figure collection, featuring over 200 pieces from various franchises",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example3",
          date: "August 13, 2023",
          duration: "25:04",
          views: "12.3K",
          category: "Collection Showcase",
        },
        {
          title: "Top 10 Horror Movies of All Time",
          description: "My personal countdown of the greatest horror films ever made, with analysis and commentary",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example4",
          date: "July 22, 2023",
          duration: "22:37",
          views: "15.8K",
          category: "Top 10",
        },
        {
          title: "The Evolution of Practical Effects in Horror",
          description: "A deep dive into how practical effects have evolved in horror cinema from the 1970s to today",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.youtube.com/watch?v=example5",
          date: "June 15, 2023",
          duration: "18:22",
          views: "9.7K",
          category: "Analysis",
        },
      ],
    },
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Set the first video as selected by default
      if (channels[activeTab]?.videos.length > 0) {
        setSelectedVideo(channels[activeTab].videos[0])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab, channels])

  const handleVideoSelect = (video: any) => {
    setSelectedVideo(video)
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold text-neon-green">Horror Review Channels</h3>
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
                          channel.videos.map((video, i) => (
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
                                <Calendar className="h-3 w-3" />
                                <span>{video.date}</span>
                                {video.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {video.category}
                                  </Badge>
                                )}
                                {video.duration && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/20 text-red-500 border-red-500/50 text-xs"
                                  >
                                    <Play className="h-2 w-2 mr-1" /> {video.duration}
                                  </Badge>
                                )}
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
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{selectedVideo.date}</span>
                          {selectedVideo.views && (
                            <span className="text-sm text-muted-foreground">• {selectedVideo.views} views</span>
                          )}
                          {selectedVideo.category && <Badge variant="outline">{selectedVideo.category}</Badge>}
                        </div>
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
