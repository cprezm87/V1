"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CloudIcon as CloudSync, Download, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface SheetsSyncProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function SheetsSync({ variant = "outline", size = "default", className = "" }: SheetsSyncProps) {
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncDirection, setSyncDirection] = useState<"upload" | "download">("upload")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [syncComplete, setSyncComplete] = useState(false)

  // Update the handleSync function to include better error handling
  const handleSync = async (direction: "upload" | "download") => {
    try {
      setIsSyncing(true)
      setSyncDirection(direction)
      setSyncProgress(0)
      setSyncComplete(false)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setSyncProgress((prev) => {
          const newProgress = prev + 5
          if (newProgress >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return newProgress
        })
      }, 200)

      if (direction === "upload") {
        // Get data from localStorage
        const figureItems = JSON.parse(localStorage.getItem("figureItems") || "[]")
        const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems") || "[]")
        const customItems = JSON.parse(localStorage.getItem("customItems") || "[]")

        // Upload to Google Sheets
        const response = await fetch("/api/sheets/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            figures: figureItems,
            wishlist: wishlistItems,
            customs: customItems,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.message || "Failed to sync data")
        }
      } else {
        // Download from Google Sheets
        const [figuresRes, wishlistRes, customsRes] = await Promise.all([
          fetch("/api/sheets/figures"),
          fetch("/api/sheets/wishlist"),
          fetch("/api/sheets/customs"),
        ])

        const [figuresData, wishlistData, customsData] = await Promise.all([
          figuresRes.json(),
          wishlistRes.json(),
          customsRes.json(),
        ])

        if (!figuresData.success || !wishlistData.success || !customsData.success) {
          throw new Error("Failed to fetch data from Google Sheets")
        }

        // Update localStorage
        localStorage.setItem("figureItems", JSON.stringify(figuresData.data))
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistData.data))
        localStorage.setItem("customItems", JSON.stringify(customsData.data))
      }

      // Complete sync
      clearInterval(progressInterval)
      setSyncProgress(100)
      setSyncComplete(true)

      toast({
        title: "Sync Complete",
        description:
          direction === "upload"
            ? "Your collection has been uploaded to Google Sheets"
            : "Your collection has been updated from Google Sheets",
      })

      // Close dialog after a delay
      setTimeout(() => {
        setIsDialogOpen(false)
        setIsSyncing(false)
      }, 1500)
    } catch (error) {
      console.error("Sync error:", error)
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "An error occurred during synchronization",
        variant: "destructive",
      })
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            <CloudSync className="mr-2 h-4 w-4" />
            Google Sheets Sync
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync with Google Sheets</DialogTitle>
            <DialogDescription>
              Choose whether to upload your local collection to Google Sheets or download from Google Sheets to update
              your local collection.
            </DialogDescription>
          </DialogHeader>

          {isSyncing ? (
            <div className="space-y-4 py-4">
              <div className="text-center">
                <p className="font-medium mb-2">
                  {syncDirection === "upload" ? "Uploading to Google Sheets..." : "Downloading from Google Sheets..."}
                </p>
                <Progress value={syncProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {syncComplete ? "Sync complete!" : `${syncProgress}% complete`}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-32 p-4"
                onClick={() => handleSync("upload")}
              >
                <Upload className="h-8 w-8 mb-2" />
                <span className="font-medium">Upload to Sheets</span>
                <span className="text-xs text-muted-foreground mt-1">Send your local collection to Google Sheets</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-32 p-4"
                onClick={() => handleSync("download")}
              >
                <Download className="h-8 w-8 mb-2" />
                <span className="font-medium">Download from Sheets</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Update your local collection from Google Sheets
                </span>
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSyncing}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
