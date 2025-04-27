"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Globe,
  Upload,
  AlertTriangle,
  RefreshCw,
  FileUp,
  FileDown,
  Moon,
  Sun,
  Trash2,
  LogOut,
  Lock,
  History,
  Laptop,
  Smartphone,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "@/contexts/theme-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Primero, vamos a añadir las importaciones necesarias para las fuentes
// Añadir estas importaciones al inicio del archivo, después de las importaciones existentes
import { Inter, Roboto, Montserrat, Open_Sans, Poppins } from "next/font/google"

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
  const { theme, toggleTheme, language, setLanguage } = useTheme()
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
  const importFileRef = useRef<HTMLInputElement>(null)

  // Añadir este estado cerca de los otros estados al inicio del componente
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [spreadsheetId, setSpreadsheetId] = useState("")
  const [syncFigures, setSyncFigures] = useState(true)
  const [syncWishlist, setSyncWishlist] = useState(true)
  const [syncCustoms, setSyncCustoms] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState("manual")
  const [currency, setCurrency] = useState("USD")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)
  const [autoBackupFrequency, setAutoBackupFrequency] = useState("7days")
  const [readOnlyMode, setReadOnlyMode] = useState(false)
  const [connectedDevices, setConnectedDevices] = useState([
    { id: "device1", name: "Chrome on Windows", lastActive: "Today", type: "desktop" },
    { id: "device2", name: "Safari on iPhone", lastActive: "Yesterday", type: "mobile" },
  ])
  const [activityHistory, setActivityHistory] = useState([
    { id: "act1", action: "Added figure", item: "Freddy Krueger", date: "2023-10-15" },
    { id: "act2", action: "Edited figure", item: "Jason Voorhees", date: "2023-10-14" },
    { id: "act3", action: "Deleted figure", item: "Michael Myers", date: "2023-10-12" },
  ])
  const [newsNotifications, setNewsNotifications] = useState(true)
  const [updateNotifications, setUpdateNotifications] = useState(true)
  const [errorNotifications, setErrorNotifications] = useState(true)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [confirmDeleteText, setConfirmDeleteText] = useState("")
  const [dropboxConnected, setDropboxConnected] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)

  // Función para aplicar los colores del tema a las variables CSS
  const applyThemeColors = (colors: { primary: string; secondary: string; accent: string; background: string }) => {
    // Variables CSS principales
    document.documentElement.style.setProperty("--primary", colors.primary)
    document.documentElement.style.setProperty("--accent", colors.accent)
    document.documentElement.style.setProperty("--neon-green", colors.primary)

    // Variables CSS adicionales que dependen del color primario
    document.documentElement.style.setProperty("--ring", colors.primary)
    document.documentElement.style.setProperty("--sidebar-accent", colors.primary)
    document.documentElement.style.setProperty("--sidebar-ring", colors.primary)

    // Actualizar colores de fondo si es necesario
    document.documentElement.style.setProperty("--secondary", colors.secondary)

    // Actualizar colores derivados
    const primaryRGB = hexToRGB(colors.primary)
    if (primaryRGB) {
      document.documentElement.style.setProperty("--primary-rgb", `${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}`)
    }
  }

  // Función auxiliar para convertir hex a RGB
  const hexToRGB = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  // Añadir este useEffect después de la definición de los estados
  useEffect(() => {
    // Cargar configuraciones guardadas
    const savedTheme = localStorage.getItem("theme") as "dark" | "light"
    const savedThemeColor = localStorage.getItem("themeColor")
    const savedFont = localStorage.getItem("font")
    const savedCurrency = localStorage.getItem("currency")

    // Aplicar tema guardado
    if (savedTheme) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
      document.documentElement.classList.toggle("light", savedTheme === "light")
    }

    // Aplicar color de tema guardado
    if (savedThemeColor && themeColors[savedThemeColor as keyof typeof themeColors]) {
      setThemeColor(savedThemeColor)
      const colors = themeColors[savedThemeColor as keyof typeof themeColors]
      applyThemeColors(colors)
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

    // Aplicar moneda guardada
    if (savedCurrency) {
      setCurrency(savedCurrency)
    }
  }, [])

  // Handle profile save
  const handleProfileSave = () => {
    toast({
      title: "Save Changes",
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
          title: "Photo Changed",
          description: "Your profile photo has been updated.",
        })
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle appearance save
  const handleAppearanceSave = () => {
    toast({
      title: "Save Appearance",
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    })

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
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
    try {
      // Limpiar todo el localStorage
      localStorage.clear()

      // Reiniciar todos los estados a sus valores predeterminados
      setName("Opaco Pérez")
      setEmail("c.prezm87@gmail.com")
      setBio("Collector of action figures and memorabilia. Focused on horror and sci-fi franchises.")
      setThemeColor("neon")
      setFont("inter")
      setNotificationSound(true)
      setPopupNotifications(true)
      setCalendarNotifications(true)
      setNotificationTime("1day")
      setLogoPreview("/logo.png")
      setUserPhotoPreview("/user.jpg")
      setIsGoogleConnected(false)
      setSpreadsheetId("")
      setSyncFigures(true)
      setSyncWishlist(true)
      setSyncCustoms(true)
      setSyncFrequency("manual")
      setCurrency("USD")

      // Cerrar el diálogo de confirmación
      setIsResetDialogOpen(false)

      // Mostrar mensaje de éxito
      toast({
        title: "Application Reset",
        description: "The application has been reset successfully. The page will reload in 3 seconds.",
      })

      // Programar recarga de la página después de 3 segundos
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    } catch (error) {
      console.error("Error resetting application:", error)
      toast({
        title: "Error",
        description: "An error occurred while resetting the application. Please try again.",
        variant: "destructive",
      })
    }
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

  // Handle currency save
  const handleCurrencySave = () => {
    // Guardar en localStorage
    localStorage.setItem("currency", currency)

    toast({
      title: "Currency Updated",
      description: "Your currency settings have been updated successfully.",
    })
  }

  // Handle Google connection
  const handleGoogleConnect = () => {
    setIsGoogleConnected(true)
    toast({
      title: "Connected to Google",
      description: "Your account has been connected to Google successfully.",
    })
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customize Your Experience</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        {/* Modificar la sección de TabsList para que tenga el orden correcto de pestañas
        y asegurarse de que todas las pestañas solicitadas estén incluidas */}
        <TabsList className="w-full flex flex-wrap justify-center gap-4 mb-8 overflow-hidden">
          <TabsTrigger value="profile" className="px-4">
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="px-4">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-4">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="language" className="px-4">
            Language
          </TabsTrigger>
          <TabsTrigger value="currency" className="px-4">
            Currency
          </TabsTrigger>
          <TabsTrigger value="security" className="px-4">
            Security
          </TabsTrigger>
          <TabsTrigger value="backup" className="px-4">
            Backup
          </TabsTrigger>
          <TabsTrigger value="sync" className="px-4">
            Sync
          </TabsTrigger>
          <TabsTrigger value="updates" className="px-4">
            Updates
          </TabsTrigger>
          <TabsTrigger value="readonly" className="px-4">
            Read-only
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 overflow-hidden">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleProfileSave}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* User Photo Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-neon-green">
                    <Image
                      src={userPhotoPreview || "/placeholder.svg?height=128&width=128"}
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
                        <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
                        <p className="text-xs text-muted-foreground mt-1">No size limit</p>
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
                      Change Photo
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
                      src={logoPreview || "/placeholder.svg?height=80&width=240"}
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
                        <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Drag and drop an image, or click to select</p>
                        <p className="text-xs text-muted-foreground mt-1">No size limit</p>
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
                      Update Logo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Dark Mode</h3>
                  <p className="text-sm text-muted-foreground">Toggle dark mode on or off</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-neon-green"
                  />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={themeColor}
                  onValueChange={(value) => {
                    setThemeColor(value)
                    // Aplicar colores del tema seleccionado
                    const colors = themeColors[value as keyof typeof themeColors]
                    applyThemeColors(colors)
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
                <Label htmlFor="font">Font</Label>
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

                  // Aplicar todos los colores del tema
                  applyThemeColors(colors)

                  // Aplicar tema claro/oscuro
                  document.documentElement.classList.toggle("dark", theme === "dark")
                  document.documentElement.classList.toggle("light", theme === "light")

                  // Notificar al usuario
                  handleAppearanceSave()
                }}
              >
                Save Appearance
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Preview</h3>
              <div className={`rounded-lg border p-4 ${theme === "dark" ? "bg-background" : "bg-white text-black"}`}>
                <h4 className="font-medium">Theme Preview</h4>
                <p className="text-sm">This is how your theme will look.</p>
                <div className="mt-4 flex gap-2">
                  <Button className="bg-neon-green text-black hover:bg-neon-green/90">Primary</Button>
                  <Button variant="outline" className="border-neon-green text-neon-green hover:bg-neon-green/10">
                    Secondary
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 overflow-hidden">
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
                  <h3 className="text-lg font-medium">Popup Notifications</h3>
                  <p className="text-sm text-muted-foreground">Show popup notifications</p>
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
                  <p className="text-sm text-muted-foreground">Receive notifications for calendar events</p>
                </div>
                <Switch
                  checked={calendarNotifications}
                  onCheckedChange={setCalendarNotifications}
                  className="data-[state=checked]:bg-neon-green"
                />
              </div>

              {/* New notification types */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Notification Types</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">News & Updates</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new figures and releases
                      </p>
                    </div>
                    <Switch
                      checked={newsNotifications}
                      onCheckedChange={setNewsNotifications}
                      className="data-[state=checked]:bg-neon-green"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">App Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications about app updates</p>
                    </div>
                    <Switch
                      checked={updateNotifications}
                      onCheckedChange={setUpdateNotifications}
                      className="data-[state=checked]:bg-neon-green"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Error Alerts</h4>
                      <p className="text-sm text-muted-foreground">Receive notifications about errors and issues</p>
                    </div>
                    <Switch
                      checked={errorNotifications}
                      onCheckedChange={setErrorNotifications}
                      className="data-[state=checked]:bg-neon-green"
                    />
                  </div>
                </div>
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
                    <SelectItem value="1week">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                onClick={() => {
                  toast({
                    title: "Notifications Updated",
                    description: "Your notification settings have been updated successfully.",
                  })
                }}
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Language</h2>
                <p className="text-muted-foreground mb-6">Choose Language</p>

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
                          <RadioGroupItem value="es" id="es" />
                          <Label htmlFor="es" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Spanish
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="zh" id="zh" />
                          <Label htmlFor="zh" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Chinese (Mandarin)
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fr" id="fr" />
                          <Label htmlFor="fr" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> French
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
                          <RadioGroupItem value="de" id="de" />
                          <Label htmlFor="de" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> German
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ru" id="ru" />
                          <Label htmlFor="ru" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Russian
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pt" id="pt" />
                          <Label htmlFor="pt" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" /> Portuguese
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
                </div>
              </div>

              <p className="text-sm text-muted-foreground">The application will restart to apply language changes</p>

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleLanguageSave}>
                Apply Language
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Tab */}
        <TabsContent value="currency" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Currency</h2>
                <p className="text-muted-foreground mb-6">Choose your preferred currency</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="COP">COP - Colombian Peso</SelectItem>
                        <SelectItem value="MXN">MXN - Mexican Peso</SelectItem>
                        <SelectItem value="BRL">BRL - Brazilian Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleCurrencySave}>
                Save Currency Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Security</h2>
                <p className="text-muted-foreground mb-6">Manage your account security</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-neon-green text-black hover:bg-neon-green/90"
                  onClick={handlePasswordChange}
                >
                  Change Password
                </Button>

                {/* Device Management Section */}
                <div className="pt-6 border-t mt-6">
                  <h3 className="text-lg font-medium mb-2">Device Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage devices where you're currently logged in</p>

                  <div className="space-y-3">
                    {connectedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          {device.type === "desktop" ? (
                            <Laptop className="h-5 w-5 mr-3 text-muted-foreground" />
                          ) : (
                            <Smartphone className="h-5 w-5 mr-3 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setConnectedDevices(connectedDevices.filter((d) => d.id !== device.id))
                            toast({
                              title: "Device Logged Out",
                              description: `You've been logged out from ${device.name}.`,
                            })
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-1" /> Log Out
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t mt-6">
                  <h3 className="text-lg font-medium mb-2">Reset Application</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will reset all settings and data to default values. This action cannot be undone.
                  </p>

                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Reset Application
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Application</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to reset the application? This will delete all your data and settings.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>This action cannot be undone.</AlertDescription>
                        </Alert>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleAppReset}>
                          Reset
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Delete Account Section */}
                <div className="pt-6 border-t mt-6">
                  <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>

                  <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete your account? This will permanently remove all your data and
                          cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>This action is permanent and cannot be undone.</AlertDescription>
                        </Alert>

                        <div className="mt-4 space-y-2">
                          <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
                          <Input
                            id="confirm-delete"
                            value={confirmDeleteText}
                            onChange={(e) => setConfirmDeleteText(e.target.value)}
                            placeholder="DELETE"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          disabled={confirmDeleteText !== "DELETE"}
                          onClick={() => {
                            setDeleteAccountDialogOpen(false)
                            toast({
                              title: "Account Deleted",
                              description: "Your account has been permanently deleted.",
                            })
                            // In a real app, you would redirect to a logout or home page
                          }}
                        >
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Tab */}
        <TabsContent value="backup" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Backup & Restore</h2>
                <p className="text-muted-foreground mb-6">Manage your data backups</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Export Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export your collection data in different formats
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="flex items-center" onClick={() => handleExportData("json")}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export as JSON
                      </Button>
                      <Button variant="outline" className="flex items-center" onClick={() => handleExportData("csv")}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export as CSV
                      </Button>
                      <Button variant="outline" className="flex items-center" onClick={() => handleExportData("excel")}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export as Excel
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Import Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">Import your collection data from a backup file</p>

                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={() => importFileRef.current?.click()}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                    <input
                      ref={importFileRef}
                      type="file"
                      accept=".json,.csv"
                      className="hidden"
                      onChange={handleImportData}
                    />
                  </div>

                  {/* Automatic Backup Section */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Automatic Backup</h3>
                    <p className="text-sm text-muted-foreground mb-4">Configure automatic backups of your collection</p>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Enable Automatic Backup</h4>
                        <p className="text-sm text-muted-foreground">Regularly backup your data automatically</p>
                      </div>
                      <Switch
                        checked={autoBackupEnabled}
                        onCheckedChange={setAutoBackupEnabled}
                        className="data-[state=checked]:bg-neon-green"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select
                        value={autoBackupFrequency}
                        onValueChange={setAutoBackupFrequency}
                        disabled={!autoBackupEnabled}
                      >
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1day">Daily</SelectItem>
                          <SelectItem value="7days">Weekly</SelectItem>
                          <SelectItem value="30days">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full mt-4 bg-neon-green text-black hover:bg-neon-green/90"
                      disabled={!autoBackupEnabled}
                      onClick={() => {
                        toast({
                          title: "Automatic Backup Configured",
                          description: `Your data will be backed up ${
                            autoBackupFrequency === "1day"
                              ? "daily"
                              : autoBackupFrequency === "7days"
                                ? "weekly"
                                : "monthly"
                          }.`,
                        })
                      }}
                    >
                      Save Backup Settings
                    </Button>
                  </div>

                  {/* Activity History Section */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Activity History</h3>
                    <p className="text-sm text-muted-foreground mb-4">View your recent collection activities</p>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {activityHistory.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center">
                            <History className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">
                                {activity.action}: {activity.item}
                              </p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => {
                        toast({
                          title: "Activity History",
                          description: "Full activity history downloaded.",
                        })
                      }}
                    >
                      Export Full History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Tab */}
        <TabsContent value="sync" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Sync</h2>
                <p className="text-muted-foreground mb-6">Sync your data with external services</p>

                <div className="space-y-4">
                  {/* Google Section */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Connect to Google</h3>
                      <p className="text-sm text-muted-foreground">Connect to Google for syncing</p>
                    </div>
                    <Button
                      variant={isGoogleConnected ? "outline" : "default"}
                      className={isGoogleConnected ? "" : "bg-neon-green text-black hover:bg-neon-green/90"}
                      onClick={handleGoogleConnect}
                      disabled={isGoogleConnected}
                    >
                      {isGoogleConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  {/* Google Sheets Section */}
                  <div className="space-y-2">
                    <Label htmlFor="spreadsheet-id">Google Sheets ID or URL</Label>
                    <Input
                      id="spreadsheet-id"
                      placeholder="Enter Google Sheets ID or URL"
                      value={spreadsheetId}
                      onChange={(e) => setSpreadsheetId(e.target.value)}
                      disabled={!isGoogleConnected}
                    />
                  </div>

                  {/* Google Drive Section */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <h3 className="text-lg font-medium">Connect to Google Drive</h3>
                      <p className="text-sm text-muted-foreground">Backup your collection to Google Drive</p>
                    </div>
                    <Button
                      variant={driveConnected ? "outline" : "default"}
                      className={driveConnected ? "" : "bg-neon-green text-black hover:bg-neon-green/90"}
                      onClick={() => {
                        setDriveConnected(true)
                        toast({
                          title: "Connected to Google Drive",
                          description: "Your account has been connected to Google Drive successfully.",
                        })
                      }}
                      disabled={driveConnected}
                    >
                      {driveConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  {/* Dropbox Section */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <h3 className="text-lg font-medium">Connect to Dropbox</h3>
                      <p className="text-sm text-muted-foreground">Backup your collection to Dropbox</p>
                    </div>
                    <Button
                      variant={dropboxConnected ? "outline" : "default"}
                      className={dropboxConnected ? "" : "bg-neon-green text-black hover:bg-neon-green/90"}
                      onClick={() => {
                        setDropboxConnected(true)
                        toast({
                          title: "Connected to Dropbox",
                          description: "Your account has been connected to Dropbox successfully.",
                        })
                      }}
                      disabled={dropboxConnected}
                    >
                      {dropboxConnected ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Sync Options</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-figures"
                          checked={syncFigures}
                          onCheckedChange={setSyncFigures}
                          disabled={!isGoogleConnected && !driveConnected && !dropboxConnected}
                          className="data-[state=checked]:bg-neon-green"
                        />
                        <Label htmlFor="sync-figures">Sync Figures</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-wishlist"
                          checked={syncWishlist}
                          onCheckedChange={setSyncWishlist}
                          disabled={!isGoogleConnected && !driveConnected && !dropboxConnected}
                          className="data-[state=checked]:bg-neon-green"
                        />
                        <Label htmlFor="sync-wishlist">Sync Wishlist</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="sync-customs"
                          checked={syncCustoms}
                          onCheckedChange={setSyncCustoms}
                          disabled={!isGoogleConnected && !driveConnected && !dropboxConnected}
                          className="data-[state=checked]:bg-neon-green"
                        />
                        <Label htmlFor="sync-customs">Sync Customs</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select
                      value={syncFrequency}
                      onValueChange={setSyncFrequency}
                      disabled={!isGoogleConnected && !driveConnected && !dropboxConnected}
                    >
                      <SelectTrigger id="sync-frequency">
                        <SelectValue placeholder="Select sync frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                    onClick={handleGoogleSheetsSync}
                    disabled={!isGoogleConnected && !driveConnected && !dropboxConnected}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Updates Tab */}
        <TabsContent value="updates" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Updates</h2>
                <p className="text-muted-foreground mb-6">Check for updates and report bugs</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Application Version</h3>
                    <p className="text-sm text-muted-foreground">Current Version: 1.0.0</p>
                  </div>

                  <Button
                    className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                    onClick={handleCheckUpdates}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check for Updates
                  </Button>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Report a Bug</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you encounter any issues, please report them here
                    </p>

                    <div className="space-y-2">
                      <Textarea placeholder="Describe the bug you encountered..." className="min-h-[100px]" />
                    </div>

                    <Button
                      className="w-full mt-2 bg-neon-green text-black hover:bg-neon-green/90"
                      onClick={handleBugReport}
                    >
                      Submit Bug Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Read-only Mode tab */}
        <TabsContent value="readonly" className="mt-6 overflow-hidden">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Read-only Mode</h2>
                <p className="text-muted-foreground mb-6">Prevent accidental changes to your collection</p>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Enable Read-only Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      When enabled, you can view but not edit your collection
                    </p>
                  </div>
                  <Switch
                    checked={readOnlyMode}
                    onCheckedChange={(checked) => {
                      setReadOnlyMode(checked)
                      toast({
                        title: checked ? "Read-only Mode Enabled" : "Read-only Mode Disabled",
                        description: checked
                          ? "You can now safely browse your collection without making changes."
                          : "You can now edit your collection.",
                      })
                    }}
                    className="data-[state=checked]:bg-neon-green"
                  />
                </div>

                <div className="mt-6 p-4 border rounded-md bg-muted/50">
                  <div className="flex items-start">
                    <Lock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">What does Read-only Mode do?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Read-only mode prevents any changes to your collection, including adding, editing, or deleting
                        items. This is useful when you want to show your collection to others without risking accidental
                        changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Quick Access</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You can quickly toggle Read-only Mode using the lock icon in the top navigation bar
                  </p>

                  <div className="flex items-center p-3 border rounded-md bg-background">
                    <div className="flex-1">
                      <p className="text-sm">Toggle Read-only Mode</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border rounded">
                        Ctrl
                      </kbd>
                      <span className="text-xs text-muted-foreground">+</span>
                      <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border rounded">
                        L
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
