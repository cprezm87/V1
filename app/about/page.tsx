"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  return (
    <div className="container py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">App Essentials</h1>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="faq" className="flex-1">
            FAQ
          </TabsTrigger>
          <TabsTrigger value="about" className="flex-1">
            About The Vault
          </TabsTrigger>
          <TabsTrigger value="behind" className="flex-1">
            Behind The App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="flex flex-col items-center py-6 overflow-visible">
            <div className="mb-8 flex justify-center">
              <Image src="/OV.png" alt="OPACO Pérez" width={300} height={100} className="h-auto" />
            </div>

            <div className="max-w-2xl text-center">
              <div className="mb-8 space-y-2">
                <p>Version: 1.0</p>
                <p>Creation Date: May 11, 2019</p>
                <p>Developer: Opaco Pérez</p>
                <p>Platform: App Web</p>
                <p>Technology: Python + NiceGUI + Vercel</p>
              </div>

              <div className="mb-8 space-y-4">
                <p>
                  Thank you for downloading OpacoVault. This app was designed so you can keep a visual and detailed
                  record of each piece in your collection.
                </p>
                <p className="text-neon-green font-bold">Your support keeps this independent project alive.</p>
              </div>

              <div className="mb-8">
                <Button
                  className="bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold py-2 px-4 rounded"
                  onClick={() => window.open("https://www.paypal.com", "_blank")}
                >
                  <Image src="/paypal.png" alt="PayPal" width={24} height={24} className="mr-2" />
                  Support via PayPal
                </Button>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p>© 2025 OpacoVault. All rights reserved.</p>
                <p>
                  This app is for personal and non-commercial use. Redistribution without the author's authorization is
                  prohibited.
                </p>
                <p>Logos, images, and references belong to their respective brands and franchises.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="behind">
          <div className="flex flex-col items-center py-6 overflow-visible">
            <div className="mb-8 flex justify-center">
              <div className="rounded-full border-2 border-neon-green p-1">
                <Image src="/perez.jpg" alt="Opaco Pérez" width={400} height={400} className="h-auto rounded-full" />
              </div>
            </div>

            <div className="max-w-2xl text-center">
              <div className="mb-8 space-y-4">
                <p>
                  Hi, I'm Opaco Pérez — a passionate horror figure collector, lifelong horror film enthusiast, proud dad
                  and rugbier.
                </p>
                <p>
                  I've been immersed in the world of horror since I can remember. Beyond collecting, I've given talks at
                  Comic-Con about the history of horror cinema, combining my love for storytelling with a deep
                  appreciation for the genre's evolution. I also share horror movie reviews on social media, where I
                  connect with fellow fans from around the world.
                </p>
                <p>
                  This app was born from a personal need — I wanted a way to keep my growing horror collection
                  organized, always updated, and accessible anywhere I go. Whether I'm adding a new figure, planning my
                  wishlist, or just admiring my collection on the move, this virtual vault keeps it all in one place.
                </p>
                <p>Thanks for supporting this project and being part of the horror community!</p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Follow Me</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Instagram:</span>{" "}
                    <Link
                      href="https://www.instagram.com/opacoperezpdf/"
                      className="text-neon-green hover:underline"
                      target="_blank"
                    >
                      opacoperezpdf
                    </Link>
                  </p>
                  <p>
                    <span className="font-semibold">TikTok:</span>{" "}
                    <Link
                      href="https://www.tiktok.com/@opacoperez"
                      className="text-neon-green hover:underline"
                      target="_blank"
                    >
                      @opacoperez
                    </Link>
                  </p>
                </div>
              </div>

              <p className="mb-8">Tag me when you upload your display cases or figures using #OpacoVault</p>

              <p className="mb-8">Stay spooky,</p>

              <div className="mb-8 flex justify-center">
                <Image src="logo.png" alt="logo.png" width={300} height={100} className="h-auto" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <div className="max-w-3xl mx-auto py-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions (FAQ)</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">What is this app for?</h3>
                <p>
                  This app is designed to help collectors manage their horror-themed figures, customs, accessories, and
                  prop collections. It includes sections to track inventory, wishlist items, customs, anniversaries, and
                  more.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">What tabs are available in the app?</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Checklist:</strong> Track figures you already own with detailed information.
                  </li>
                  <li>
                    <strong>Wishlist:</strong> Log the items you want to buy, with release status and tracking.
                  </li>
                  <li>
                    <strong>Customs:</strong> Document your custom-made or modified figures.
                  </li>
                  <li>
                    <strong>Rewind:</strong> Celebrate movie anniversaries and save memorable releases.
                  </li>
                  <li>
                    <strong>Statistics (optional):</strong> Analyze your collection data visually.
                  </li>
                  <li>
                    <strong>About:</strong> Learn about the app's features and how it works.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">
                  What information can I store for each figure?
                </h3>
                <p>Each form allows you to enter detailed fields like:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, Franchise, Brand, Serie</li>
                  <li>Year Released, Year Purchased, Price</li>
                  <li>Photos, Logos, Reviews, Comments</li>
                  <li>Shelf & Display locations, Tags, and more.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Are the entries saved online?</h3>
                <p>
                  If connected to a database like Neon or Google Sheets, your data will persist even if you refresh or
                  update the app. Otherwise, unsaved data may be lost.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Is my data private?</h3>
                <p>
                  Yes. Your data is stored privately unless you decide to share access. No information is made public.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Can I test the app without registering?</h3>
                <p>
                  Yes. You can fill in forms and test all tabs. However, without a connected database, your data won't
                  be saved permanently.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Can I customize the fields or layout?</h3>
                <p>
                  Currently, the layout is fixed for simplicity. Future updates may allow field customization and theme
                  adjustments.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">
                  Will my data be lost if the app is updated?
                </h3>
                <p>
                  If you're using a connected database (Neon, Supabase, or Sheets), no. Your data remains safe. If you
                  rely on local storage, updates may clear your data.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Can I export or back up my collection?</h3>
                <p>
                  Export options can be added upon request. Database-integrated versions already allow manual backups.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">
                  What is the "Add Movie Anniversary" form for?
                </h3>
                <p>
                  It lets you register horror movie anniversaries with posters, trailers, and release dates, helping you
                  celebrate cult classics.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-neon-green mb-2">Who is this app for?</h3>
                <p>
                  Collectors, horror fans, custom creators, and inventory lovers who want to manage and admire their
                  collection in one centralized place.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
