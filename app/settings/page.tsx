"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, AlertTriangle, Download, Upload, RefreshCw } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/contexts/theme-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Primero, vamos a añadir las importaciones necesarias para las fuentes
// Añadir estas importaciones al inicio del archivo, después de las importaciones existentes
import { Inter, Roboto, Montserrat, Open_Sans, Poppins } from "next/font/google"

// Añadir esta importación al inicio del archivo, junto con las demás importaciones
import GoogleSheetsImport from "./google-sheets-import"

// Definir las fuentes
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-opensans" })
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" })

// Definir los temas de colores
const themeColors = {
  neon: {
    primary: "#83FF00",
    secondary: "#111111",
    accent: "#83FF00",
    background: "#0A0A0A",
  },
  purple: {
    primary: "#9D00FF",
    secondary: "#111111",
    accent: "#9D00FF",
    background: "#0A0A0A",
  },
  blue: {
    primary: "#00A3FF",
    secondary: "#111111",
    accent: "#00A3FF",
    background: "#0A0A0A",
  },
  red: {
    primary: "#FF0044",
    secondary: "#111111",
    accent: "#FF0044",
    background: "#0A0A0A",
  },
  orange: {
    primary: "#FF6B00",
    secondary: "#111111",
    accent: "#FF6B00",
    background: "#0A0A0A",
  },
}

export default function SettingsPage() {
  const { toast } = useToast()
  const { theme, toggleTheme, language, setLanguage, t } = useTheme()
  const [name, setName] = useState("Opaco Pérez")
  const [email, setEmail] = useState("c.prezm87@gmail.com")
  const [bio, setBio] = useState(
    "Collector of action figures and memorabilia. Focused on horror and sci-fi franchises.",
  )
  const [themeColor, setThemeColor] = useState("neon")
  const [font, setFont] = useState("inter")
  const [notificationSound, setNotificationSound] = useState(true)
  const [popupNotifications, setPopupNotifications] = useState(true)
  const [calendarNotifications, setCalendarNotifications] = useState(true)
  const [notificationTime, setNotificationTime] = useState("1day")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [logoPreview, setLogoPreview] = useState("/logo.png")
  const [userPhotoPreview, setUserPhotoPreview] = useState("/user.jpg")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const userPhotoInputRef = useRef<HTMLInputElement>(null)

  // Añadir este estado cerca de los otros estados al inicio del componente
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [spreadsheetId, setSpreadsheetId] = useState("")
  const [syncFigures, setSyncFigures] = useState(true)
  const [syncWishlist, setSyncWishlist] = useState(true)
  const [syncCustoms, setSyncCustoms] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("manual")

  // Añadir este useEffect después de la definición de los estados
  useEffect(() => {
    // Cargar configuraciones guardadas
    const savedTheme = localStorage.getItem("theme") as "dark" | "light"
    const savedThemeColor = localStorage.getItem("themeColor")
    const savedFont = localStorage.getItem("font")

    // Aplicar tema guardado
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.classList.toggle("light", savedTheme === "light")
    }

    // Aplicar color de tema guardado
    if (savedThemeColor && themeColors[savedThemeColor as keyof typeof themeColors]) {
      setThemeColor(savedThemeColor)
      const colors = themeColors[savedThemeColor as keyof typeof themeColors]
      document.documentElement.style.setProperty("--primary", colors.primary)
      document.documentElement.style.setProperty("--accent", colors.accent)
      document.documentElement.style.setProperty("--neon-green", colors.primary)
    }

    // Aplicar fuente guardada
    if (savedFont) {
      setFont(savedFont)
      const fontClass =
        savedFont === "inter"
          ? inter.className
          : savedFont === "roboto"
            ? roboto.className
            : savedFont === "montserrat"
              ? montserrat.className
              : savedFont === "opensans"
                ? openSans.className
                : savedFont === "poppins"
                  ? poppins.className
                  : inter.className
      document.body.className = fontClass
    }
  }, [])

  // Handle profile save
  const handleProfileSave = () => {
    toast({
      title: t("profile.saveChanges"),
      description: "Your profile has been updated successfully.",
    })
  }

  // Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoPreview(event.target.result as string)
        toast({
          title: "Logo Updated",
          description: "Your sidebar logo has been updated successfully.",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle user photo change
  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 5MB limit",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setUserPhotoPreview(event.target.result as string)
        toast({
          title: t("profile.photoChanged"),
          description: t("profile.photoUpdated"),
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle appearance save
  const handleAppearanceSave = () => {
    toast({
      title: t("settings.saveAppearance"),
      description: "Your appearance settings have been updated successfully.",
    })
  }

  // Handle language save
  const handleLanguageSave = () => {
    toast({
      title: "Language Updated",
      description: "Your language settings have been updated successfully. The application will restart.",
    })

    // Simulate app restart
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  // Handle password change
  const handlePasswordChange = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    })
  }

  // Handle check for updates
  const handleCheckUpdates = () => {
    toast({
      title: "Checking for Updates",
      description: "Checking for updates...",
    })

    setTimeout(() => {
      toast({
        title: "Up to Date",
        description: "You are using the latest version of OpacoVault.",
      })
    }, 2000)
  }

  // Handle bug report
  const handleBugReport = () => {
    toast({
      title: "Bug Report Submitted",
      description: "Thank you for your bug report. We will look into it.",
    })
  }

  // Handle app reset
  const handleAppReset = () => {
    // Clear localStorage
    localStorage.clear()

    setIsResetDialogOpen(false)

    toast({
      title: "App Reset",
      description: "The app has been reset to its initial state. Please refresh the page.",
    })
  }

  // Handle export data
  const handleExportData = (format: "json" | "csv" | "excel") => {
    try {
      // Get all data from localStorage
      const figureItems = localStorage.getItem("figureItems") || "[]"
      const wishlistItems = localStorage.getItem("wishlistItems") || "[]"
      const customItems = localStorage.getItem("customItems") || "[]"

      // Parse the data
      const figuresData = JSON.parse(figureItems)
      const wishlistData = JSON.parse(wishlistItems)
      const customsData = JSON.parse(customItems)

      if (format === "json") {
        // Create a JSON object with all data
        const exportData = {
          figureItems: figuresData,
          wishlistItems: wishlistData,
          customItems: customsData,
          exportDate: new Date().toISOString(),
        }

        // Convert to JSON string
        const jsonString = JSON.stringify(exportData, null, 2)

        // Create a blob and download link
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `opacovault-backup-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()

        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else if (format === "csv") {
        // Function to convert array of objects to CSV
        const convertToCSV = (objArray: any[]) => {
          if (objArray.length === 0) return ""

          // Get headers from first object
          const headers = Object.keys(objArray[0])

          // Create CSV header row
          let csv = headers.join(",") + "\n"

          // Add data rows
          objArray.forEach((obj) => {
            const row = headers
              .map((header) => {
                // Handle values that might contain commas or quotes
                let value = obj[header] === null || obj[header] === undefined ? "" : obj[header]

                // Convert objects or arrays to string
                if (typeof value === "object") value = JSON.stringify(value)

                // Escape quotes and wrap in quotes if contains comma or quote
                value = String(value).replace(/"/g, '""')
                if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                  value = `"${value}"`
                }

                return value
              })
              .join(",")

            csv += row + "\n"
          })

          return csv
        }

        // Create separate CSV files for each collection
        const collections = [
          { name: "figures", data: figuresData },
          { name: "wishlist", data: wishlistData },
          { name: "customs", data: customsData },
        ]

        collections.forEach((collection) => {
          if (collection.data.length > 0) {
            const csv = convertToCSV(collection.data)
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `opacovault-${collection.name}-${new Date().toISOString().split("T")[0]}.csv`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        })
      } else if (format === "excel") {
        // For Excel, we'll use CSV format with .xlsx extension
        // In a real app, you would use a library like xlsx or exceljs

        // Function to convert array of objects to CSV
        const convertToCSV = (objArray: any[]) => {
          if (objArray.length === 0) return ""

          // Get headers from first object
          const headers = Object.keys(objArray[0])

          // Create CSV header row
          let csv = headers.join(",") + "\n"

          // Add data rows
          objArray.forEach((obj) => {
            const row = headers
              .map((header) => {
                // Handle values that might contain commas or quotes
                let value = obj[header] === null || obj[header] === undefined ? "" : obj[header]

                // Convert objects or arrays to string
                if (typeof value === "object") value = JSON.stringify(value)

                // Escape quotes and wrap in quotes if contains comma or quote
                value = String(value).replace(/"/g, '""')
                if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                  value = `"${value}"`
                }

                return value
              })
              .join(",")

            csv += row + "\n"
          })

          return csv
        }

        // Create separate Excel files for each collection
        const collections = [
          { name: "figures", data: figuresData },
          { name: "wishlist", data: wishlistData },
          { name: "customs", data: customsData },
        ]

        collections.forEach((collection) => {
          if (collection.data.length > 0) {
            const csv = convertToCSV(collection.data)
            const blob = new Blob([csv], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `opacovault-${collection.name}-${new Date().toISOString().split("T")[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        })
      }

      toast({
        title: "Data Exported",
        description: `Your data has been exported successfully in ${format.toUpperCase()} format.`,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
    }
  }

  // Handle import data
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExtension = file.name.split(".").pop()?.toLowerCase()

    if (fileExtension === "json") {
      // Handle JSON import
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string)

          // Validate the imported data
          if (!importData.figureItems || !importData.wishlistItems || !importData.customItems) {
            throw new Error("Invalid backup file format")
          }

          // Save to localStorage
          localStorage.setItem("figureItems", JSON.stringify(importData.figureItems))
          localStorage.setItem("wishlistItems", JSON.stringify(importData.wishlistItems))
          localStorage.setItem("customItems", JSON.stringify(importData.customItems))

          toast({
            title: "Data Imported",
            description: "Your data has been imported successfully. Please refresh the page.",
          })
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "There was an error importing your JSON data. Please check the file format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    } else if (fileExtension === "csv") {
      // Handle CSV import
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string

          // Parse CSV
          const lines = csvText.split("\n")
          const headers = lines[0].split(",")

          // Check if this is a valid CSV export
          const isValidCsv = headers.includes("id") && headers.includes("name")

          if (!isValidCsv) {
            throw new Error("Invalid CSV format")
          }

          // Parse the CSV data into objects
          const items = []
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const item: any = {}

            headers.forEach((header, index) => {
              // Handle quoted values
              let value = values[index] || ""
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1).replace(/""/g, '"')
              }

              // Convert numeric values
              if (header === "price" || header === "ranking") {
                item[header] = Number(value) || 0
              } else if (header === "released" || header === "buy") {
                item[header] = value.toLowerCase() === "true"
              } else {
                item[header] = value
              }
            })

            items.push(item)
          }

          // Determine the type of data based on the headers
          if (headers.includes("shelf") && headers.includes("display")) {
            localStorage.setItem("figureItems", JSON.stringify(items))
            toast({
              title: "Figures Imported",
              description: `Successfully imported ${items.length} figures from CSV.`,
            })
          } else if (headers.includes("released") && headers.includes("buy")) {
            localStorage.setItem("wishlistItems", JSON.stringify(items))
            toast({
              title: "Wishlist Imported",
              description: `Successfully imported ${items.length} wishlist items from CSV.`,
            })
          } else if (headers.includes("head") && headers.includes("body")) {
            localStorage.setItem("customItems", JSON.stringify(items))
            toast({
              title: "Custom Items Imported",
              description: `Successfully imported ${items.length} custom items from CSV.`,
            })
          } else {
            throw new Error("Could not determine data type from CSV")
          }
        } catch (error) {
          console.error("CSV import error:", error)
          toast({
            title: "Import Failed",
            description: "There was an error importing your CSV data. Please check the file format.",
            variant: "destructive",
          })
        }
      }
      reader.readAsText(file)
    } else {
      toast({
        title: "Import Failed",
        description: "Unsupported file format. Please use JSON or CSV files.",
        variant: "destructive",
      })
    }

    e.target.value = ""
  }

  // Actualizar la función handleGoogleSheetsSync
  const handleGoogleSheetsSync = () => {
    if (!isGoogleConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to Google Sheets first.",
        variant: "destructive",
      })
      return
    }

    if (!spreadsheetId) {
      toast({
        title: "Missing Spreadsheet ID",
        description: "Please enter a Google Sheets ID or URL.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Google Sheets Sync",
      description: "Syncing with Google Sheets...",
    })

    // Simulate sync process
    setTimeout(() => {
      toast({
        title: "Sync Complete",
        description: `Your data has been synced with Google Sheets. Synced: ${[
          syncFigures ? "Figures" : "",
          syncWishlist ? "Wishlist" : "",
          syncCustoms ? "Customs" : "",
        ]
          .filter(Boolean)
          .join(", ")}`,
      })
    }, 2000)
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("nav.settings")}</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile" className="whitespace-nowrap">
            {t("settings.profile")}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="whitespace-nowrap">
            {t("settings.appearance")}
          </TabsTrigger>
          <TabsTrigger value="language" className="whitespace-nowrap">
            {t("settings.language")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap">
            {t("settings.notifications")}
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            {t("settings.security")}
          </TabsTrigger>
          <TabsTrigger value="backup" className="whitespace-nowrap">
            {t("settings.backup")}
          </TabsTrigger>
          <TabsTrigger value="sync" className="whitespace-nowrap">
            {t("settings.sync")}
          </TabsTrigger>
          <TabsTrigger value="reset" className="whitespace-nowrap">
            {t("settings.reset")}
          </TabsTrigger>
          <TabsTrigger value="updates" className="whitespace-nowrap">
            {t("settings.updates")}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.name")}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("profile.bio")}</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleProfileSave}>
                  {t("profile.saveChanges")}
                </Button>
              </CardContent>
            </Card>

            {/* User Photo Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-neon-green">
                    <Image
                      src={userPhotoPreview || "/placeholder.svg"}
                      alt="User profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <div
                        className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:border-neon-green"
                        onClick={() => userPhotoInputRef.current?.click()}
                      >
                        <p className="text-sm text-muted-foreground">{t("profile.dragDrop")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("profile.maxSize")}</p>
                        <input
                          ref={userPhotoInputRef}
                          id="user-photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleUserPhotoChange}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                      onClick={() => userPhotoInputRef.current?.click()}
                    >
                      {t("profile.changePhoto")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logo Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative h-20 w-60 overflow-hidden">
                    <Image
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo"
                      width={240}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <div
                        className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:border-neon-green"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <p className="text-sm text-muted-foreground">{t("profile.dragDrop")}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t("profile.maxSize")}</p>
                        <input
                          ref={logoInputRef}
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {t("profile.updateLogo")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{t("settings.darkMode")}</h3>
                  <p className="text-sm text-muted-foreground">Toggle dark mode on or off</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-neon-green"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">{t("settings.theme")}</Label>
                <Select
                  value={themeColor}
                  onValueChange={(value) => {
                    setThemeColor(value)
                    // Aplicar colores del tema seleccionado
                    const colors = themeColors[value as keyof typeof themeColors]
                    document.documentElement.style.setProperty("--primary", colors.primary)
                    document.documentElement.style.setProperty("--accent", colors.accent)

                    // Actualizar las variables CSS para los colores del tema
                    document.documentElement.style.setProperty("--neon-green", colors.primary)
                  }}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neon" className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-[#83FF00] mr-2"></div>
                      Neon Green
                    </SelectItem>
                    <SelectItem value="purple" className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-[#9D00FF] mr-2"></div>
                      Neon Purple
                    </SelectItem>
                    <SelectItem value="blue" className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-[#00A3FF] mr-2"></div>
                      Neon Blue
                    </SelectItem>
                    <SelectItem value="red" className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-[#FF0044] mr-2"></div>
                      Neon Red
                    </SelectItem>
                    <SelectItem value="orange" className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-[#FF6B00] mr-2"></div>
                      Neon Orange
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font">{t("settings.font")}</Label>
                <Select
                  value={font}
                  onValueChange={(value) => {
                    setFont(value)
                    // Aplicar la fuente seleccionada
                    const fontClass =
                      value === "inter"
                        ? inter.className
                        : value === "roboto"
                          ? roboto.className
                          : value === "montserrat"
                            ? montserrat.className
                            : value === "opensans"
                              ? openSans.className
                              : value === "poppins"
                                ? poppins.className
                                : inter.className

                    // Aplicar la clase de fuente al elemento body
                    document.body.className = fontClass
                  }}
                >
                  <SelectTrigger id="font">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter" className={inter.className}>
                      Inter
                    </SelectItem>
                    <SelectItem value="roboto" className={roboto.className}>
                      Roboto
                    </SelectItem>
                    <SelectItem value="montserrat" className={montserrat.className}>
                      Montserrat
                    </SelectItem>
                    <SelectItem value="opensans" className={openSans.className}>
                      Open Sans
                    </SelectItem>
                    <SelectItem value="poppins" className={poppins.className}>
                      Poppins
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                onClick={() => {
                  // Guardar configuraciones en localStorage
                  localStorage.setItem("theme", theme)
                  localStorage.setItem("themeColor", themeColor)
                  localStorage.setItem("font", font)

                  // Aplicar cambios
                  const colors = themeColors[themeColor as keyof typeof themeColors]
                  document.documentElement.style.setProperty("--primary", colors.primary)
                  document.documentElement.style.setProperty("--accent", colors.accent)
                  document.documentElement.style.setProperty("--neon-green", colors.primary)

                  // Aplicar tema
                  document.documentElement.classList.toggle("dark", theme === "dark")
                  document.documentElement.classList.toggle("light", theme === "light")

                  // Notificar al usuario
                  handleAppearanceSave()
                }}
              >
                {t("settings.saveAppearance")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{t("settings.preview")}</h3>
              <div className={`rounded-lg border p-4 ${theme === "dark" ? "bg-background" : "bg-white text-black"}`}>
                <h4 className="font-medium">{t("settings.themePreview")}</h4>
                <p className="text-sm">This is how your theme will look.</p>
                <div className="mt-4 flex gap-2">
                  <Button className="bg-neon-green text-black hover:bg-neon-green/90">{t("settings.primary")}</Button>
                  <Button variant="outline" className="border-neon-green text-neon-green hover:bg-neon-green/10">
                    {t("settings.secondary")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">{t("settings.language")}</h2>
                <p className="text-muted-foreground mb-6">{t("settings.chooseLanguage")}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup
                        value={language}
                        onValueChange={(val) => setLanguage(val as any)}
                        className="flex flex-col space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en" id="en" />
                          <Label htmlFor="en" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> English
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pt" id="pt" />
                          <Label htmlFor="pt" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Portuguese
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="zh" id="zh" />
                          <Label htmlFor="zh" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Chinese (Mandarin)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="it" id="it" />
                          <Label htmlFor="it" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Italian
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup
                        value={language}
                        onValueChange={(val) => setLanguage(val as any)}
                        className="flex flex-col space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="es" id="es" />
                          <Label htmlFor="es" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Spanish
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fr" id="fr" />
                          <Label htmlFor="fr" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> French
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ru" id="ru" />
                          <Label htmlFor="ru" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Russian
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="de" id="de" />
                          <Label htmlFor="de" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> German
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{t("settings.restartLanguage")}</p>

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleLanguageSave}>
                {t("settings.applyLanguage")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Sound Notifications</h3>
                  <p className="text-sm text-muted-foreground">Enable sound for notifications</p>
                </div>
                <Switch
                  checked={notificationSound}
                  onCheckedChange={setNotificationSound}
                  className="data-[state=checked]:bg-neon-green"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pop-up Notifications</h3>
                  <p className="text-sm text-muted-foreground">Show pop-up notifications</p>
                </div>
                <Switch
                  checked={popupNotifications}
                  onCheckedChange={setPopupNotifications}
                  className="data-[state=checked]:bg-neon-green"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Calendar Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Sync with calendar for release dates and Rewind events
                  </p>
                </div>
                <Switch
                  checked={calendarNotifications}
                  onCheckedChange={setCalendarNotifications}
                  className="data-[state=checked]:bg-neon-green"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-time">Notification Time</Label>
                <Select value={notificationTime} onValueChange={setNotificationTime}>
                  <SelectTrigger id="notification-time">
                    <SelectValue placeholder="Select notification time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="3hours">3 hours before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                    <SelectItem value="3days">3 days before</SelectItem>
                    <SelectItem value="1week">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                onClick={() => {
                  toast({
                    title: "Notifications Updated",
                    description: "Your notification settings have been updated.",
                  })
                }}
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export & Backup</CardTitle>
              <CardDescription>Export your collection data in different formats for backup or analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your collection data to different formats for backup or analysis purposes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                    onClick={() => handleExportData("json")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to JSON
                  </Button>
                  <Button
                    className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                    onClick={() => handleExportData("csv")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export to CSV
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Import your collection data from a previously exported JSON or CSV file.
                </p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="import-file" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-md hover:border-neon-green">
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Select JSON or CSV backup file</span>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json,.csv"
                        className="hidden"
                        onChange={handleImportData}
                      />
                    </div>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Note: Importing data will overwrite your current collection. Make sure to export your current data
                    first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Tab */}
        <TabsContent value="sync" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets Sync</CardTitle>
              <CardDescription>
                Sync your collection data with Google Sheets for advanced analysis and sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Connection Status</h3>
                <div className={`flex items-center space-x-2 mb-4`}>
                  <div className={`h-3 w-3 rounded-full ${isGoogleConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                  <p className="text-sm">
                    {isGoogleConnected ? "Connected to Google Sheets" : "Not connected to Google Sheets"}
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setIsGoogleConnected(!isGoogleConnected)
                    toast({
                      title: isGoogleConnected ? "Disconnected" : "Connected",
                      description: isGoogleConnected
                        ? "Disconnected from Google Sheets"
                        : "Successfully connected to Google Sheets",
                    })
                  }}
                >
                  {isGoogleConnected ? "Disconnect Google Account" : "Connect Google Account"}
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Google Sheets Configuration</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="spreadsheet-id">Spreadsheet ID or URL</Label>
                    <Input
                      id="spreadsheet-id"
                      placeholder="Enter Google Sheets ID or URL"
                      value={spreadsheetId}
                      onChange={(e) => setSpreadsheetId(e.target.value)}
                      disabled={!isGoogleConnected}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data to Sync</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sync-figures"
                          checked={syncFigures}
                          onCheckedChange={(checked) => setSyncFigures(!!checked)}
                          disabled={!isGoogleConnected}
                        />
                        <Label htmlFor="sync-figures">Figures Collection</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sync-wishlist"
                          checked={syncWishlist}
                          onCheckedChange={(checked) => setSyncWishlist(!!checked)}
                          disabled={!isGoogleConnected}
                        />
                        <Label htmlFor="sync-wishlist">Wishlist Items</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sync-customs"
                          checked={syncCustoms}
                          onCheckedChange={(checked) => setSyncCustoms(!!checked)}
                          disabled={!isGoogleConnected}
                        />
                        <Label htmlFor="sync-customs">Custom Items</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select value={syncFrequency} onValueChange={setSyncFrequency} disabled={!isGoogleConnected}>
                      <SelectTrigger id="sync-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="manual">Manual only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                  onClick={handleGoogleSheetsSync}
                  disabled={!isGoogleConnected}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Export to Google Sheets
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-2">
                  {isGoogleConnected
                    ? `Sync frequency: ${
                        syncFrequency === "realtime"
                          ? "Real-time"
                          : syncFrequency === "hourly"
                            ? "Every hour"
                            : syncFrequency === "daily"
                              ? "Once a day"
                              : syncFrequency === "weekly"
                                ? "Once a week"
                                : "Manual only"
                      }`
                    : "Connect to Google Sheets to enable synchronization"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Añadir el componente de importación de Google Sheets aquí */}
          <div className="mt-6">
            <GoogleSheetsImport />
          </div>
        </TabsContent>

        {/* Reset Tab */}
        <TabsContent value="reset" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Reset Application</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset the application to its initial state. This will delete all your data.
                </p>

                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reset Application
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete all your collection data and reset
                        the application to its initial state.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleAppReset}>
                        Yes, Reset Everything
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <p className="text-xs text-muted-foreground mt-2">
                  Note: We recommend exporting your data before resetting the application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Check for Updates</h3>
                <p className="text-sm text-muted-foreground">Current version: 1.0.0</p>
                <p className="text-sm text-muted-foreground">Last checked: April 19, 2025</p>
                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleCheckUpdates}>
                  Check for Updates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-medium">Report a Bug</h3>
                <div className="space-y-2">
                  <Label htmlFor="bug-title">Bug Title</Label>
                  <Input id="bug-title" placeholder="Brief description of the issue" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bug-description">Bug Description</Label>
                  <Textarea id="bug-description" placeholder="Please provide details about the bug..." rows={4} />
                </div>

                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleBugReport}>
                  Submit Bug Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
