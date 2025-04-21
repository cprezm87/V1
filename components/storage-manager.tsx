"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function StorageManager() {
  const { toast } = useToast()
  const [storageUsage, setStorageUsage] = useState<number>(0)
  const [storageLimit, setStorageLimit] = useState<number>(5 * 1024 * 1024) // Assume 5MB limit
  const [storageItems, setStorageItems] = useState<{ key: string; size: number; count?: number }[]>([])

  // Calculate storage usage
  useEffect(() => {
    try {
      let totalSize = 0
      const items: { key: string; size: number; count?: number }[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || ""
        const value = localStorage.getItem(key) || ""
        const size = new Blob([value]).size
        totalSize += size

        // Add item details
        if (key === "figureItems" || key === "wishlistItems" || key === "customItems") {
          try {
            const parsedData = JSON.parse(value)
            items.push({ key, size, count: Array.isArray(parsedData) ? parsedData.length : 0 })
          } catch {
            items.push({ key, size })
          }
        } else {
          items.push({ key, size })
        }
      }

      // Sort by size (largest first)
      items.sort((a, b) => b.size - a.size)

      setStorageUsage(totalSize)
      setStorageItems(items)
    } catch (error) {
      console.error("Error calculating storage usage:", error)
    }
  }, [])

  // Format bytes to human-readable size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Clear specific storage item
  const clearStorageItem = (key: string) => {
    try {
      localStorage.removeItem(key)
      toast({
        title: "Storage Cleared",
        description: `Successfully cleared ${key} from storage.`,
      })

      // Refresh page to update state
      window.location.reload()
    } catch (error) {
      console.error(`Error clearing ${key}:`, error)
      toast({
        title: "Error",
        description: `Failed to clear ${key} from storage.`,
        variant: "destructive",
      })
    }
  }

  // Clear all storage
  const clearAllStorage = () => {
    try {
      localStorage.clear()
      toast({
        title: "Storage Cleared",
        description: "Successfully cleared all local storage.",
      })

      // Refresh page to update state
      window.location.reload()
    } catch (error) {
      console.error("Error clearing storage:", error)
      toast({
        title: "Error",
        description: "Failed to clear storage.",
        variant: "destructive",
      })
    }
  }

  // Calculate usage percentage
  const usagePercentage = Math.min(100, (storageUsage / storageLimit) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Management</CardTitle>
        <CardDescription>Manage your browser's local storage usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {usagePercentage > 80 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Storage Almost Full</AlertTitle>
            <AlertDescription>
              Your browser storage is almost full. Consider clearing some data to prevent errors.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Usage</span>
            <span>
              {formatBytes(storageUsage)} / {formatBytes(storageLimit)}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Storage Items</h3>
          <div className="space-y-2">
            {storageItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="font-medium">{item.key}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(item.size)}
                    {item.count !== undefined && ` • ${item.count} items`}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => clearStorageItem(item.key)} className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear {item.key}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={clearAllStorage} className="w-full">
          Clear All Storage
        </Button>
      </CardFooter>
    </Card>
  )
}
