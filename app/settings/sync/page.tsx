import { SheetsConnectionTester } from "@/components/sheets-connection-tester"
import { SheetsSync } from "@/components/sheets-sync"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SyncSettingsPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sync Settings</h1>
        <p className="text-muted-foreground">Manage your Google Sheets integration and sync settings</p>
      </div>

      <div className="grid gap-6">
        <SheetsConnectionTester />

        <Card>
          <CardHeader>
            <CardTitle>Google Sheets Sync</CardTitle>
            <CardDescription>
              Sync your collection data with Google Sheets for backup and cross-device access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This feature allows you to back up your collection to Google Sheets and access it from any device. Your
                data will be organized into three separate sheets: Figures, Wishlist, and Customs.
              </p>

              <SheetsSync className="w-full bg-neon-green text-black hover:bg-neon-green/90" />

              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">About Google Sheets Sync</h4>
                <p className="text-sm text-muted-foreground">
                  Your collection data is automatically synced with Google Sheets when you add, edit, or delete items.
                  You can also manually sync your data using the button above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
