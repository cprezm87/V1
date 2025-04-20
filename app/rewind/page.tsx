"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, Play, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

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
  const [trailer, setTrailer] = useState("")
  const [comments, setComments] = useState("")
  const [anniversaries, setAnniversaries] = useState<MovieAnniversary[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Calcular efemérides para la fecha seleccionada
  const todayAnniversaries = anniversaries.filter(
    (movie) => movie.releaseDate.getDate() === date?.getDate() && movie.releaseDate.getMonth() === date?.getMonth(),
  )

  const handleAddAnniversary = () => {
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

    setAnniversaries([...anniversaries, newAnniversary])

    // Reset form
    setMovieTitle("")
    setReleaseDate(undefined)
    setPoster("")
    setTrailer("")
    setComments("")
    setIsDialogOpen(false)

    toast({
      title: "Added!",
      description: "Movie anniversary has been added.",
    })
  }

  const getYearsSince = (date: Date) => {
    const today = new Date()
    return today.getFullYear() - date.getFullYear()
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rewind</h1>
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
                        <div className="space-y-2">
                          <Label htmlFor="poster">Poster URL</Label>
                          <Input
                            id="poster"
                            value={poster}
                            onChange={(e) => setPoster(e.target.value)}
                            placeholder="Enter poster URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="trailer">Trailer URL</Label>
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
        <h3 className="mb-4 text-xl font-semibold text-neon-green">Movies News</h3>
        <Tabs defaultValue="bloody">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="bloody" className="whitespace-nowrap">
              Bloody Disgusting
            </TabsTrigger>
            <TabsTrigger value="abando" className="whitespace-nowrap">
              Abandomoviez
            </TabsTrigger>
            <TabsTrigger value="aullidos" className="whitespace-nowrap">
              Aullidos
            </TabsTrigger>
            <TabsTrigger value="broke" className="whitespace-nowrap">
              Broke Horror Fan
            </TabsTrigger>
            <TabsTrigger value="scream" className="whitespace-nowrap">
              Scream Factory
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bloody" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link
                    href="https://bloody-disgusting.com/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    bloody-disgusting.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[600px] w-full">
                    <iframe
                      src="https://bloody-disgusting.com"
                      width="100%"
                      height="600"
                      style={{ border: "none" }}
                      title="Bloody Disgusting"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="abando" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link
                    href="https://www.abandomoviez.net/"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    www.abandomoviez.net
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[600px] w-full">
                    <iframe
                      src="https://www.abandomoviez.net/"
                      width="100%"
                      height="600"
                      style={{ border: "none" }}
                      title="Abandomoviez"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="aullidos" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link href="https://www.aullidos.com/" target="_blank" className="text-neon-green hover:underline">
                    www.aullidos.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[600px] w-full">
                    <iframe
                      src="https://www.aullidos.com/"
                      width="100%"
                      height="600"
                      style={{ border: "none" }}
                      title="Aullidos"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="broke" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link href="https://brokehorrorfan.com/" target="_blank" className="text-neon-green hover:underline">
                    brokehorrorfan.com
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[600px] w-full">
                    <iframe
                      src="https://brokehorrorfan.com/"
                      width="100%"
                      height="600"
                      style={{ border: "none" }}
                      title="Broke Horror Fan"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scream" className="mt-4">
            <Card>
              <CardContent className="p-4">
                <p>
                  Latest news from{" "}
                  <Link
                    href="https://shoutfactory.com/collections/scream-factory"
                    target="_blank"
                    className="text-neon-green hover:underline"
                  >
                    shoutfactory.com/collections/scream-factory
                  </Link>
                </p>
                <div className="mt-4">
                  <div className="relative h-[600px] w-full">
                    <iframe
                      src="https://shoutfactory.com/collections/scream-factory"
                      width="100%"
                      height="600"
                      style={{ border: "none" }}
                      title="Scream Factory"
                      sandbox="allow-scripts allow-same-origin"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
