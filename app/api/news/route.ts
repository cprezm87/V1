import { NextResponse } from "next/server"
import { fetchNewsFromSource, fetchAllNews, fetchNewsByCategory } from "@/lib/news-fetcher"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get("source")
  const category = searchParams.get("category")

  try {
    let news

    if (source) {
      news = await fetchNewsFromSource(source)
    } else if (category) {
      news = await fetchNewsByCategory(category)
    } else {
      news = await fetchAllNews()
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
