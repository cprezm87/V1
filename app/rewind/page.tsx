"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Play, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { MovieNewsFeed } from "@/components/movie-news-feed"
import { ImageUploadField } from "@/components/image-upload-field"
import { HorrorReviewChannels } from "@/components/horror-review-channels"

interface MovieAnniversary {
  id: string
  title: string
  releaseDate: Date
  poster: string
  trailer: string
  comments: string
}

export default function RewindPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [movieTitle, setMovieTitle] = useState("")
  const [releaseDate, setReleaseDate] = useState<Date | undefined>(undefined)
  const [poster, setPoster] = useState("")
  const [posterPreview, setPosterPreview] = useState("")
  const [trailer, setTrailer] = useState("")
  const [comments, setComments] = useState("")
  const [anniversaries, setAnniversaries] = useState<MovieAnniversary[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const storedAnniversaries = localStorage.getItem("movieAnniversaries")
    if (storedAnniversaries) {
      try {
        // Convertir las fechas de string a Date
        const parsedAnniversaries = JSON.parse(storedAnniversaries, (key, value) => {
          if (key === "releaseDate") return new Date(value)
          return value
        })
        setAnniversaries(parsedAnniversaries)
      } catch (error) {
        console.error("Error parsing stored anniversaries:", error)
      }
    }
  }, [])

  // Guardar en localStorage cuando cambian los aniversarios
  useEffect(() => {
    if (anniversaries.length > 0) {
      localStorage.setItem("movieAnniversaries", JSON.stringify(anniversaries))
    }
  }, [anniversaries])

  // Calcular efemérides para la fecha seleccionada
  const todayAnniversaries = anniversaries.filter(
    (movie) => movie.releaseDate.getDate() === date?.getDate() && movie.releaseDate.getMonth() === date?.getMonth(),
  )

  // Asegurarse de que la función handleAddAnniversary use la URL de la imagen
  const handleAddAnniversary = async () => {
    if (!movieTitle || !releaseDate || !poster) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newAnniversary: MovieAnniversary = {
      id: Date.now().toString(),
      title: movieTitle,
      releaseDate,
      poster,
      trailer,
      comments,
    }

    // Enviar datos a Zapier
    try {
      await fetch("https://hooks.zapier.com/hooks/catch/22623944/2xlyjjw/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MovieTitle: movieTitle,
          ReleaseDate: releaseDate.toISOString().split("T")[0], // Formato YYYY-MM-DD
          Poster: poster,
          Trailer: trailer,
          Comments: comments,
        }),
      })

      // Actualizar estado local
      setAnniversaries([...anniversaries, newAnniversary])

      // Reset form
      setMovieTitle("")
      setReleaseDate(undefined)
      setPoster("")
      setPosterPreview("")
      setTrailer("")
      setComments("")
      setIsDialogOpen(false)

      toast({
        title: "Added!",
        description: "Movie anniversary has been added.",
      })
    } catch (error) {
      console.error("Error sending data to Zapier:", error)
      toast({
        title: "Error",
        description: "Failed to send data to Zapier. The anniversary was saved locally.",
        variant: "destructive",
      })
    }
  }

  const getYearsSince = (date: Date) => {
    const today = new Date()
    return today.getFullYear() - date.getFullYear()
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cinema Milestones & News</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        {/* Efemérides Today - Ahora primero */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-neon-green">Efemérides Today</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAnniversaries.length > 0 ? (
                <div className="space-y-6">
                  {todayAnniversaries.map((movie) => (
                    <div key={movie.id} className="text-center">
                      <h3 className="text-lg font-medium mb-2">{movie.title}</h3>
                      <Link href={movie.trailer} target="_blank" className="block relative">
                        <div className="relative aspect-[2/3] w-full max-w-[200px] mx-auto mb-2 rounded-md overflow-hidden">
                          <Image
                            src={movie.poster || "/placeholder.svg?height=300&width=200"}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      </Link>
                      <p className="text-neon-green font-bold text-xl">{getYearsSince(movie.releaseDate)} years</p>
                      <p className="text-sm text-muted-foreground">
                        Released: {format(movie.releaseDate, "MMMM d, yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No anniversaries today. Select a date with anniversaries or add new ones!
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Movies Anniversaries - Ahora segundo */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-neon-green">Movies Anniversaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-neon-green text-black hover:bg-neon-green/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Anniversary
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Movie Anniversary</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="movie-title">Movie Title</Label>
                          <Input
                            id="movie-title"
                            value={movieTitle}
                            onChange={(e) => setMovieTitle(e.target.value)}
                            placeholder="Enter movie title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Release Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !releaseDate && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {releaseDate ? format(releaseDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={releaseDate} onSelect={setReleaseDate} initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <ImageUploadField
                            id="poster"
                            label="Poster"
                            value={posterPreview}
                            onChange={(url) => {
                              setPosterPreview(url)
                              setPoster(url)
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trailer">Trailer</Label>
                          <Input
                            id="trailer"
                            value={trailer}
                            onChange={(e) => setTrailer(e.target.value)}
                            placeholder="Enter YouTube trailer URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comments">Comments</Label>
                          <Textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Add your comments..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-neon-green text-black hover:bg-neon-green/90"
                          onClick={handleAddAnniversary}
                        >
                          Add Anniversary
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-4">
                  {date && (
                    <div className="text-sm text-muted-foreground mb-4">
                      Selected date: {format(date, "MMMM d, yyyy")}
                    </div>
                  )}

                  {todayAnniversaries.length > 0 ? (
                    <div className="space-y-4">
                      {todayAnniversaries.map((movie) => (
                        <Card key={movie.id}>
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={movie.poster || "/placeholder.svg?height=96&width=64"}
                                  alt={movie.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{movie.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Released: {format(movie.releaseDate, "MMMM d, yyyy")}
                                </p>
                                {movie.comments && <p className="text-sm mt-2">{movie.comments}</p>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Movies News Section */}
      <section className="mb-10">
        <MovieNewsFeed />
      </section>

      {/* Horror Review Channels Section */}
      <section className="mb-10">
        <HorrorReviewChannels />
      </section>
    </div>
  )
}
