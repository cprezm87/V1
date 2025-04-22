export interface NewsItem {
  id: string
  title: string
  description: string
  imageUrl: string
  sourceUrl: string
  source: string
  date: string
  category: string
}

// Cache for storing fetched news to avoid repeated requests
const newsCache: Record<string, { items: NewsItem[]; timestamp: number }> = {}
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Add CoolToyReview to the sources
export async function fetchNewsFromSource(source: string): Promise<NewsItem[]> {
  // Check cache first
  const now = Date.now()
  if (newsCache[source] && now - newsCache[source].timestamp < CACHE_DURATION) {
    return newsCache[source].items
  }

  try {
    switch (source) {
      case "fwoosh":
        return await fetchFwooshNews()
      case "toyark":
        return await fetchToyarkNews()
      case "toynewsi":
        return await fetchToyNewsInternationalNews()
      case "afi":
        return await fetchActionFigureInsiderNews()
      case "figurerealm":
        return await fetchFigureRealmNews()
      case "cooltoyr":
        return await fetchCoolToyReviewNews()
      default:
        return []
    }
  } catch (error) {
    console.error(`Error fetching news from ${source}:`, error)
    return []
  }
}

async function fetchFwooshNews(): Promise<NewsItem[]> {
  try {
    // In a real implementation, you would use a server-side API route to fetch this
    // For demo purposes, we'll return mock data based on the screenshot
    const items: NewsItem[] = [
      {
        id: "fwoosh-1",
        title: "Hasbro: Star Wars Celebration Black Series Reveals",
        description: "Hasbro reveals new Star Wars Black Series figures at Star Wars Celebration event.",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fwoosh-starwars-alien-4Zlb0j92NkPwQnDHo19esvzjXCCMq5.jpg",
        sourceUrl: "https://thefwoosh.com/2025/04/hasbro-star-wars-celebration-black-series-reveals/",
        source: "The Fwoosh",
        date: "2 days ago",
        category: "Star Wars",
      },
      {
        id: "fwoosh-2",
        title: "Boss Fight Studio: Red Sonja Review",
        description: "A detailed review of the new Red Sonja figure from Boss Fight Studio.",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fwoosh-redsonja-4Zlb0j92NkPwQnDHo19esvzjXCCMq5.jpg",
        sourceUrl: "https://thefwoosh.com/2025/04/boss-fight-studio-red-sonja-review/",
        source: "The Fwoosh",
        date: "4 days ago",
        category: "Reviews",
      },
      {
        id: "fwoosh-3",
        title: "Boss Fight Studios: Saurozoic Warriors Sokudo Legion Review",
        description: "Check out our review of the latest Saurozoic Warriors figures from Boss Fight Studios.",
        imageUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fwoosh-saurozoic-4Zlb0j92NkPwQnDHo19esvzjXCCMq5.jpg",
        sourceUrl: "https://thefwoosh.com/2025/04/boss-fight-studios-saurozoic-warriors-sokudo-legion-review/",
        source: "The Fwoosh",
        date: "2 months ago",
        category: "Reviews",
      },
    ]

    // Update cache
    newsCache["fwoosh"] = { items, timestamp: Date.now() }
    return items
  } catch (error) {
    console.error("Error fetching news from The Fwoosh:", error)
    return []
  }
}

async function fetchToyarkNews(): Promise<NewsItem[]> {
  // Similar implementation for Toyark
  const items: NewsItem[] = [
    {
      id: "toyark-1",
      title: "NECA Reveals New Alien Figure",
      description: "NECA has revealed a new Alien figure based on the classic 1979 film.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.toyark.com/",
      source: "The Toyark",
      date: "1 day ago",
      category: "Alien",
    },
    {
      id: "toyark-2",
      title: "McFarlane Toys Announces New DC Multiverse Figures",
      description: "McFarlane Toys has announced new DC Multiverse figures coming this fall.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.toyark.com/news/toy-news-on-the-toyark-198/",
      source: "The Toyark",
      date: "3 days ago",
      category: "DC Comics",
    },
  ]

  newsCache["toyark"] = { items, timestamp: Date.now() }
  return items
}

async function fetchToyNewsInternationalNews(): Promise<NewsItem[]> {
  // Implementation for Toy News International
  const items: NewsItem[] = [
    {
      id: "toynewsi-1",
      title: "Hasbro Pulse Con 2025 Announced",
      description: "Hasbro has announced Pulse Con 2025 dates and initial lineup.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://toynewsi.com/",
      source: "Toy News International",
      date: "2 days ago",
      category: "Events",
    },
    {
      id: "toynewsi-2",
      title: "Super7 Reveals New TMNT Ultimates Figures",
      description: "Super7 has revealed new TMNT Ultimates figures for their next wave.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://toynewsi.com/news",
      source: "Toy News International",
      date: "5 days ago",
      category: "TMNT",
    },
  ]

  newsCache["toynewsi"] = { items, timestamp: Date.now() }
  return items
}

async function fetchActionFigureInsiderNews(): Promise<NewsItem[]> {
  // Implementation for Action Figure Insider
  const items: NewsItem[] = [
    {
      id: "afi-1",
      title: "Mezco One:12 Collective Expands Horror Line",
      description: "Mezco is expanding their One:12 Collective horror line with new figures.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.actionfigureinsider.com/",
      source: "Action Figure Insider",
      date: "1 day ago",
      category: "Horror",
    },
    {
      id: "afi-2",
      title: "Diamond Select Toys Announces New Marvel Figures",
      description: "Diamond Select Toys has announced new Marvel figures coming this winter.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.actionfigureinsider.com/category/news/",
      source: "Action Figure Insider",
      date: "4 days ago",
      category: "Marvel",
    },
  ]

  newsCache["afi"] = { items, timestamp: Date.now() }
  return items
}

async function fetchFigureRealmNews(): Promise<NewsItem[]> {
  // Implementation for Figure Realm
  const items: NewsItem[] = [
    {
      id: "figurerealm-1",
      title: "New Figure Database Updates",
      description: "Check out the latest additions to our comprehensive figure database.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.figurerealm.com/home",
      source: "Figure Realm",
      date: "3 days ago",
      category: "Database",
    },
    {
      id: "figurerealm-2",
      title: "Collector Spotlight: Horror Figures",
      description: "Featured collector showcase of rare horror figure collections.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      sourceUrl: "https://www.figurerealm.com/galleries",
      source: "Figure Realm",
      date: "1 week ago",
      category: "Collectors",
    },
  ]

  newsCache["figurerealm"] = { items, timestamp: Date.now() }
  return items
}

// Add this new function after fetchFigureRealmNews
async function fetchCoolToyReviewNews(): Promise<NewsItem[]> {
  // Implementation for Cool Toy Review
  const items: NewsItem[] = [
    {
      id: "cooltoyr-1",
      title: "Hot Toys: Scarecrow 2.0",
      description:
        "Hot Toys' newest movie masterpiece collectible figure pays homage to one of Batman's most notorious villains.",
      imageUrl:
        "https://sjc.microlink.io/9Vvp2XE2IzZBAmPbd7J_NjRKa8rxi-njj3MEuWY1aV3vKep-L0wBYNPi4bL-rcWfLXjxczBfx7FXm0qEPODyHA.jpeg",
      sourceUrl: "https://www.cooltoyreview.com/hot-toys-scarecrow-2-0/",
      source: "Cool Toy Review",
      date: "1 day ago",
      category: "Hot Toys",
    },
    {
      id: "cooltoyr-2",
      title: "Mezco Toyz: Superman vs the Mechanical Monsters Review",
      description:
        "Something different for us today as we check out a Mezco product with a great retro look. Check out this classic Superman episode deluxe set.",
      imageUrl:
        "https://sjc.microlink.io/9Vvp2XE2IzZBAmPbd7J_NjRKa8rxi-njj3MEuWY1aV3vKep-L0wBYNPi4bL-rcWfLXjxczBfx7FXm0qEPODyHA.jpeg",
      sourceUrl: "https://www.cooltoyreview.com/mezco-toyz-superman-vs-the-mechanical-monsters-review/",
      source: "Cool Toy Review",
      date: "3 days ago",
      category: "Mezco",
    },
  ]

  newsCache["cooltoyr"] = { items, timestamp: Date.now() }
  return items
}

// Update the sources array in fetchAllNews function
export async function fetchAllNews(): Promise<NewsItem[]> {
  const sources = ["fwoosh", "toyark", "toynewsi", "afi", "figurerealm", "cooltoyr"]
  const allNewsPromises = sources.map((source) => fetchNewsFromSource(source))
  const allNewsArrays = await Promise.all(allNewsPromises)

  // Flatten the array of arrays and sort by date (newest first)
  return allNewsArrays.flat().sort((a, b) => {
    // Simple date comparison for demo purposes
    // In a real app, you'd parse the dates properly
    return a.date.localeCompare(b.date)
  })
}

// Function to fetch news by category
export async function fetchNewsByCategory(category: string): Promise<NewsItem[]> {
  const allNews = await fetchAllNews()
  return allNews.filter((item) => item.category.toLowerCase() === category.toLowerCase())
}
