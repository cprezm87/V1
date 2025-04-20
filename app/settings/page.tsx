"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe, AlertTriangle, Download, Upload } from "lucide-react"
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
import { SheetsSync } from "@/components/sheets-sync"

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
    // Aplicar el tema seleccionado
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")

    // Guardar el tema en localStorage
    localStorage.setItem("theme", theme)

    // Guardar el color del tema
    localStorage.setItem("themeColor", themeColor)

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
  const handleExportData = () => {
    try {
      // Get all data from localStorage
      const figureItems = localStorage.getItem("figureItems") || "[]"
      const wishlistItems = localStorage.getItem("wishlistItems") || "[]"
      const customItems = localStorage.getItem("customItems") || "[]"

      // Create a JSON object with all data
      const exportData = {
        figureItems: JSON.parse(figureItems),
        wishlistItems: JSON.parse(wishlistItems),
        customItems: JSON.parse(customItems),
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

      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
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
          description: "There was an error importing your data. Please check the file format.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
    e.target.value = ""
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
          <div className="grid gap-6 md:grid-cols-2">
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
                  <Select value={themeColor} onValueChange={setThemeColor}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neon">Neon Green</SelectItem>
                      <SelectItem value="purple">Neon Purple</SelectItem>
                      <SelectItem value="blue">Neon Blue</SelectItem>
                      <SelectItem value="red">Neon Red</SelectItem>
                      <SelectItem value="orange">Neon Orange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font">{t("settings.font")}</Label>
                  <Select value={font} onValueChange={setFont}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="montserrat">Montserrat</SelectItem>
                      <SelectItem value="opensans">Open Sans</SelectItem>
                      <SelectItem value="poppins">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                  onClick={handleAppearanceSave}
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
          </div>
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
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your collection data to a JSON file for backup purposes.
                </p>
                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export to JSON
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Import Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Import your collection data from a previously exported JSON file.
                </p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="import-file" className="cursor-pointer">
                    <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-md hover:border-neon-green">
                      <Upload className="mr-2 h-4 w-4" />
                      <span>Select backup file</span>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json"
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
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Google Sheets Sync</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sync your collection data with Google Sheets for advanced analysis and sharing.
                </p>
                <div className="space-y-4">
                  <SheetsSync className="w-full bg-neon-green text-black hover:bg-neon-green/90" />

                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">About Google Sheets Sync</h4>
                    <p className="text-sm text-muted-foreground">
                      This feature allows you to back up your collection to Google Sheets and access it from any device.
                      Your data will be organized into three separate sheets: Figures, Wishlist, and Customs.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Sync Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Sync</p>
                      <p className="text-sm text-muted-foreground">Automatically sync changes to Google Sheets</p>
                    </div>
                    <Switch
                      className="data-[state=checked]:bg-neon-green"
                      checked={true}
                      onCheckedChange={() => {
                        toast({
                          title: "Auto Sync Updated",
                          description: "Auto sync setting has been updated.",
                        })
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="sync-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
