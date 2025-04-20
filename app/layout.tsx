import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RootLayoutContent } from "./RootLayoutContent"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OpacoVault",
  description: "Collection app with dark theme",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  )
}
