import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container flex flex-col items-center py-10">
      <div className="mb-8 flex justify-center">
        <Image src="/logo.png" alt="OPACO Pérez" width={300} height={100} className="h-auto" />
      </div>

      <div className="max-w-2xl text-center">
        <div className="mb-8 space-y-2">
          <p>Version: 1.0</p>
          <p>Creation Date: May 11, 2019</p>
          <p>Developer: Opaco Pérez</p>
          <p>Platform: Windows (.exe)</p>
          <p>Technology: Python + NiceGUI</p>
        </div>

        <div className="mb-8 space-y-4">
          <p>
            Thank you for downloading OpacoVault. This app was designed so you can keep a visual and detailed record of
            each piece in your collection.
          </p>
          <p>Your support keeps this independent project alive.</p>
        </div>

        <div className="mb-8 space-y-2">
          <p>Instagram: opacoperezpdf</p>
          <p>TikTok: @opacoperez</p>
          <p>YouTube: @OpacoPerez</p>
          <p>Email: c.prezm87@gmail.com</p>
        </div>

        <p className="mb-8">Tag me when you upload your display cases or figures using #OpacoVault!</p>

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
