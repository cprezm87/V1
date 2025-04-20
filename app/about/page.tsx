"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container flex flex-col items-center py-10">
      <div className="mb-8 flex justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-4Zlb0j92NkPwQnDHo19esvzjXCCMq5.png"
          alt="OPACO Pérez"
          width={300}
          height={100}
          className="h-auto"
        />
      </div>

      <div className="max-w-2xl text-center">
        <div className="mb-8 space-y-2">
          <p>Version: 1.0</p>
          <p>Creation Date: May 11, 2019</p>
          <p>Developer: Opaco Pérez</p>
          <p>Platform: Web</p>
          <p>Technology: Python + NiceGUI + Vercel</p>
        </div>

        <div className="mb-8 space-y-4">
          <p>
            Thank you for downloading OpacoVault. This app was designed so you can keep a visual and detailed record of
            each piece in your collection.
          </p>
          <p>Your support keeps this independent project alive.</p>
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
  )
}
