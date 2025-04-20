"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("en")

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profile" className="whitespace-nowrap">
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="whitespace-nowrap">
            Appearance
          </TabsTrigger>
          <TabsTrigger value="language" className="whitespace-nowrap">
            Language
          </TabsTrigger>
          <TabsTrigger value="notifications" className="whitespace-nowrap">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="whitespace-nowrap">
            Security
          </TabsTrigger>
          <TabsTrigger value="updates" className="whitespace-nowrap">
            Updates
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-neon-green">
                    <Image src="/user.jpg" alt="User profile" fill className="object-cover" />
                  </div>
                  <Button className="bg-neon-green text-black hover:bg-neon-green/90">Change Photo</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Opaco Pérez" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="c.prezm87@gmail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Collector of action figures and memorabilia. Focused on horror and sci-fi franchises."
                  />
                </div>

                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90">Save Changes</Button>
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
                    <h3 className="text-lg font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Toggle dark mode on or off</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-neon-green"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="neon">
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
                  <Label htmlFor="font">Font</Label>
                  <Select defaultValue="inter">
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className={`rounded-lg border p-4 ${darkMode ? "bg-background" : "bg-white text-black"}`}>
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
          </div>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Language</h2>
                <p className="text-muted-foreground mb-6">Choose your preferred language.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroup value={language} onValueChange={setLanguage} className="flex flex-col space-y-4">
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
                      <RadioGroup value={language} onValueChange={setLanguage} className="flex flex-col space-y-4">
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

              <p className="text-sm text-muted-foreground">The application will restart to apply language changes.</p>

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90">Apply Language</Button>
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
                <Switch defaultChecked className="data-[state=checked]:bg-neon-green" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Pop-up Notifications</h3>
                  <p className="text-sm text-muted-foreground">Show pop-up notifications</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-neon-green" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Calendar Notifications</h3>
                  <p className="text-sm text-muted-foreground">Sync with calendar for release dates</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-neon-green" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-time">Notification Time</Label>
                <Select defaultValue="1day">
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

              <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90">Change Password</Button>
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
                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90">Check for Updates</Button>
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

                <Button className="w-full bg-neon-green text-black hover:bg-neon-green/90">Submit Bug Report</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
