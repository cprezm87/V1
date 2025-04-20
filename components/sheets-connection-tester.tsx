"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { CloudIcon, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SheetsConnectionTester() {
  const { toast } = useToast()
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      setIsTesting(true)
      setError(null)
      setTestResult(null)

      const response = await fetch("/api/sheets/test-connection")
      const result = await response.json()

      if (result.success) {
        setTestResult(result)
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Google Sheets",
        })
      } else {
        setError(result.error || "Failed to connect to Google Sheets")
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect to Google Sheets",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error testing connection:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      toast({
        title: "Connection Failed",
        description: "An error occurred while testing the connection",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Sheets Connection Test</CardTitle>
        <CardDescription>
          Test your connection to Google Sheets and verify that your environment variables are set up correctly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {testResult && testResult.success && (
          <Alert className="mb-4 bg-neon-green/20 border-neon-green">
            <CheckCircle className="h-4 w-4 text-neon-green" />
            <AlertTitle className="text-neon-green">Connection Successful</AlertTitle>
            <AlertDescription>
              <div className="mt-2">
                <p>
                  <strong>Spreadsheet Title:</strong> {testResult.spreadsheetInfo.title}
                </p>
                <p>
                  <strong>Sheet Count:</strong> {testResult.spreadsheetInfo.sheetCount}
                </p>
                <p>
                  <strong>Sheets:</strong> {testResult.spreadsheetInfo.sheets.join(", ")}
                </p>

                <div className="mt-2">
                  <p>
                    <strong>Test Results:</strong>
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li className="flex items-center">
                      Figures Sheet:
                      {testResult.testResults.figures ? (
                        <CheckCircle className="ml-2 h-4 w-4 text-neon-green" />
                      ) : (
                        <XCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </li>
                    <li className="flex items-center">
                      Wishlist Sheet:
                      {testResult.testResults.wishlist ? (
                        <CheckCircle className="ml-2 h-4 w-4 text-neon-green" />
                      ) : (
                        <XCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </li>
                    <li className="flex items-center">
                      Customs Sheet:
                      {testResult.testResults.customs ? (
                        <CheckCircle className="ml-2 h-4 w-4 text-neon-green" />
                      ) : (
                        <XCircle className="ml-2 h-4 w-4 text-red-500" />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This will test your connection to Google Sheets and verify that your environment variables are set up
            correctly. It will also create test rows in each sheet to verify write permissions.
          </p>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-medium">Required Environment Variables:</p>
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>GOOGLE_SHEETS_CLIENT_EMAIL</li>
              <li>GOOGLE_SHEETS_PRIVATE_KEY</li>
              <li>GOOGLE_SHEETS_DOCUMENT_ID</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={testConnection}
          disabled={isTesting}
          className="w-full bg-neon-green text-black hover:bg-neon-green/90"
        >
          {isTesting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <CloudIcon className="mr-2 h-4 w-4" />
              Test Google Sheets Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
