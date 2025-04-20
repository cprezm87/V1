"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { WebPreview } from "@/components/web-preview"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { Calendar, ExternalLink, Info, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MovieNewsData {
  title: string
  description: string
  imageUrl: string
  url: string
  date: string
  category?: string
  hasVideo?: boolean
}

interface NewsSourceData {
  name: string
  url: string
  description: string
  articles: MovieNewsData[]
}

export function MovieNewsFeed() {
  const { t } = useTheme()
  const [activeTab, setActiveTab] = useState("bloody")
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<MovieNewsData | null>(null)
  const [newsSources, setNewsSources] = useState<Record<string, NewsSourceData>>({
    bloody: {
      name: "Bloody Disgusting",
      url: "https://bloody-disgusting.com/",
      description:
        "The premier website for horror fans, covering news, reviews, and features on horror movies and culture",
      articles: [
        {
          title: "New 'Terrifier 3' Trailer Reveals Art the Clown's Christmas Carnage",
          description:
            "Damien Leone's Terrifier 3 gets a bloody new trailer showing Art the Clown's holiday-themed killing spree.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://bloody-disgusting.com/movie/",
          date: "October 5, 2023",
          category: "Movies",
          hasVideo: true,
        },
        {
          title: "Upcoming Horror Movies: Release Dates Calendar for 2024",
          description: "Our comprehensive guide to all upcoming horror movie releases scheduled for 2024.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://bloody-disgusting.com/movie/3701476/upcoming-horror-movies-release-calendar/",
          date: "September 28, 2023",
          category: "Movies",
        },
        {
          title: "The 20 Best Horror Movies of 2023 So Far",
          description: "Our picks for the best horror films released in 2023 that you need to watch.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://bloody-disgusting.com/editorials/3755321/best-horror-movies-2023/",
          date: "September 15, 2023",
          category: "Lists",
          hasVideo: false,
        },
      ],
    },
    abando: {
      name: "Abandomoviez",
      url: "https://www.abandomoviez.net/",
      description: "Spanish horror and genre film website covering international releases and news",
      articles: [
        {
          title: "Nuevos Estrenos de Terror para Octubre 2023",
          description: "Todos los estrenos de películas de terror que llegarán a los cines en octubre.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.abandomoviez.net/estrenos/",
          date: "October 1, 2023",
          category: "Estrenos",
        },
        {
          title: "Crítica: 'Longlegs' - El nuevo terror psicológico de Osgood Perkins",
          description: "Análisis de la nueva película de terror protagonizada por Nicolas Cage.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.abandomoviez.net/criticas/",
          date: "September 25, 2023",
          category: "Críticas",
          hasVideo: false,
        },
      ],
    },
    aullidos: {
      name: "Aullidos",
      url: "https://www.aullidos.com/",
      description: "Spanish website dedicated to horror cinema with news, reviews and interviews",
      articles: [
        {
          title: "Entrevista exclusiva con Mike Flanagan",
          description: "Hablamos con el director de 'La Caída de la Casa Usher' sobre su próximo proyecto.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.aullidos.com/entrevistas/",
          date: "October 3, 2023",
          category: "Entrevistas",
          hasVideo: true,
        },
        {
          title: "Las 10 mejores películas de terror de A24",
          description: "Repasamos las mejores producciones de terror del estudio independiente A24.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://www.aullidos.com/listas/",
          date: "September 20, 2023",
          category: "Listas",
        },
      ],
    },
    broke: {
      name: "Broke Horror Fan",
      url: "https://brokehorrorfan.com/",
      description: "Independent horror blog covering indie films, VHS culture, and horror merchandise",
      articles: [
        {
          title: "Limited Edition VHS Release of 'Terrifier 2'",
          description: "Broke Horror Fan presents a limited VHS release of the indie horror hit.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://brokehorrorfan.com/vhs-releases/",
          date: "October 2, 2023",
          category: "VHS",
          hasVideo: false,
        },
        {
          title: "Interview with 'V/H/S/85' Directors",
          description: "We talk with the directors behind the latest installment in the found footage anthology.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://brokehorrorfan.com/interviews/",
          date: "September 22, 2023",
          category: "Interviews",
          hasVideo: true,
        },
      ],
    },
    scream: {
      name: "Scream Factory",
      url: "https://shoutfactory.com/collections/scream-factory",
      description: "Horror film distribution company known for collector's edition Blu-ray releases",
      articles: [
        {
          title: "October 2023 New Releases",
          description: "Check out all the new collector's edition horror Blu-rays coming this month.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://shoutfactory.com/collections/scream-factory/coming-soon",
          date: "October 1, 2023",
          category: "New Releases",
        },
        {
          title: "Collector's Edition of 'The Fog' Announced",
          description: "New 4K UHD collector's edition of John Carpenter's classic with exclusive extras.",
          imageUrl: "/placeholder.svg?height=200&width=300",
          url: "https://shoutfactory.com/collections/scream-factory/4k-uhd",
          date: "September 15, 2023",
          category: "4K UHD",
          hasVideo: false,
        },
      ],
    },
  })

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Set the first article as selected by default
      if (newsSources[activeTab]?.articles.length > 0) {
        setSelectedArticle(newsSources[activeTab].articles[0])
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [activeTab, newsSources])

  const handleArticleSelect = (article: MovieNewsData) => {
    setSelectedArticle(article)
  }

  return (
    <>
      <h3 className="mb-4 text-xl font-semibold text-neon-green">Movies News</h3>
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
              {Object.entries(newsSources).map(([key, source]) => (
                <TabsTrigger key={key} value={key} className="rounded-none data-[state=active]:bg-background">
                  {source.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(newsSources).map(([key, source]) => (
              <TabsContent key={key} value={key} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Lista de artículos - 1/3 del ancho */}
                  <div className="border-r">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                      <div className="mt-2">
                        <Link
                          href={source.url}
                          target="_blank"
                          className="text-neon-green hover:underline text-sm flex items-center"
                        >
                          Visit {source.name} <ExternalLink className="ml-1 h-3 w-3" />
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
                          source.articles.map((article, i) => (
                            <div
                              key={i}
                              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedArticle?.title === article.title
                                  ? "border-l-4 border-neon-green bg-muted/50"
                                  : ""
                              }`}
                              onClick={() => handleArticleSelect(article)}
                            >
                              <h4 className="font-medium">{article.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{article.date}</span>
                                {article.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {article.category}
                                  </Badge>
                                )}
                                {article.hasVideo && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-500/20 text-red-500 border-red-500/50 text-xs"
                                  >
                                    <Play className="h-2 w-2 mr-1" /> Video
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Contenido del artículo - 2/3 del ancho */}
                  <div className="md:col-span-2 p-6">
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    ) : selectedArticle ? (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{selectedArticle.date}</span>
                          {selectedArticle.category && <Badge variant="outline">{selectedArticle.category}</Badge>}
                        </div>
                        <h2 className="text-2xl font-bold mb-4">{selectedArticle.title}</h2>
                        <div className="mb-6">
                          <WebPreview
                            url={selectedArticle.url}
                            title={selectedArticle.title}
                            description={selectedArticle.description}
                            imageUrl={selectedArticle.imageUrl}
                            height={400}
                          />
                        </div>
                        <p className="mb-4">{selectedArticle.description}</p>
                        <Button asChild className="bg-neon-green text-black hover:bg-neon-green/90">
                          <Link href={selectedArticle.url} target="_blank">
                            Read Full Article <ExternalLink className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64">
                        <Info className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Select an article to view details</p>
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
