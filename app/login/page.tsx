"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { FirebaseError } from "firebase/app"
import { useTheme } from "@/contexts/theme-context"
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const { toast } = useToast()
  const { signIn, signUp, resetPassword } = useAuth()
  const { t } = useTheme()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [resetEmailInput, setResetEmailInput] = useState("")
  const [showResetPassword, setShowResetPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple validation
      if (!loginEmail || !loginPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      await signIn(loginEmail, loginPassword)

      toast({
        title: "Success",
        description: "You have been logged in successfully",
      })
    } catch (error) {
      console.error("Login error:", error)

      let errorMessage = "Error logging in. Please try again."

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address."
            break
          case "auth/user-disabled":
            errorMessage = "This account has been disabled."
            break
          case "auth/user-not-found":
            errorMessage = "No account exists with this email."
            break
          case "auth/wrong-password":
            errorMessage = "Incorrect password."
            break
          default:
            errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simple validation
      if (!registerName || !registerEmail || !registerPassword) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        })
        return
      }

      await signUp(registerEmail, registerPassword)

      toast({
        title: "Success",
        description: "Your account has been created successfully",
      })
    } catch (error) {
      console.error("Registration error:", error)

      let errorMessage = "Error creating account. Please try again."

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "An account with this email already exists."
            break
          case "auth/invalid-email":
            errorMessage = "Invalid email address."
            break
          case "auth/weak-password":
            errorMessage = "Password is too weak."
            break
          default:
            errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!resetEmailInput) {
        toast({
          title: "Error",
          description: "Please enter your email address",
          variant: "destructive",
        })
        return
      }

      await resetPassword(resetEmailInput)
      setResetEmailSent(true)

      toast({
        title: "Email Sent",
        description: "A password reset email has been sent",
      })
    } catch (error) {
      console.error("Password reset error:", error)

      let errorMessage = "Error sending email. Please try again."

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email address."
            break
          case "auth/user-not-found":
            errorMessage = "No account exists with this email."
            break
          default:
            errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)

      toast({
        title: "Success",
        description: "You have been logged in with Google successfully",
      })
    } catch (error) {
      console.error("Google login error:", error)

      let errorMessage = "Error logging in with Google. Please try again."

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/unauthorized-domain":
            errorMessage =
              "This domain is not authorized for authentication. Please add it to your Firebase console under Authentication > Settings > Authorized domains."
            break
          case "auth/popup-closed-by-user":
            errorMessage = "Login popup was closed. Please try again."
            break
          case "auth/cancelled-popup-request":
            errorMessage = "Login request was cancelled. Please try again."
            break
          case "auth/popup-blocked":
            errorMessage = "Login popup was blocked by your browser. Please allow popups for this site."
            break
          default:
            errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsLoading(true)

    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)

      toast({
        title: "Success",
        description: "You have been logged in with GitHub successfully",
      })
    } catch (error) {
      console.error("GitHub login error:", error)

      let errorMessage = "Error logging in with GitHub. Please try again."

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/unauthorized-domain":
            errorMessage =
              "This domain is not authorized for authentication. Please add it to your Firebase console under Authentication > Settings > Authorized domains."
            break
          case "auth/popup-closed-by-user":
            errorMessage = "Login popup was closed. Please try again."
            break
          case "auth/cancelled-popup-request":
            errorMessage = "Login request was cancelled. Please try again."
            break
          case "auth/popup-blocked":
            errorMessage = "Login popup was blocked by your browser. Please allow popups for this site."
            break
          default:
            errorMessage = `Error: ${error.message}`
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-4Zlb0j92NkPwQnDHo19esvzjXCCMq5.png"
            alt="OPACO Pérez"
            width={250}
            height={80}
            className="h-auto"
          />
        </div>

        <Card className="border-neon-green/20 w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to OpacoVault</CardTitle>
            <CardDescription>Your personal collection management system</CardDescription>
          </CardHeader>
          <CardContent>
            {showResetPassword ? (
              <div className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmailInput}
                      onChange={(e) => setResetEmailInput(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Email"}
                  </Button>
                </form>
                {resetEmailSent && (
                  <p className="text-sm text-center text-neon-green">
                    An email has been sent to your address. Please check your inbox.
                  </p>
                )}
                <div className="text-center">
                  <Button variant="link" onClick={() => setShowResetPassword(false)} className="text-neon-green">
                    Back to login
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                          type="button"
                          variant="link"
                          className="text-xs text-neon-green hover:underline"
                          onClick={() => setShowResetPassword(true)}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the{" "}
                        <a href="#" className="text-neon-green hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-neon-green hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-neon-green text-black hover:bg-neon-green/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <Image src="/google.png" alt="Google" width={20} height={20} className="mr-2" />
                {isLoading ? "Connecting..." : "Google"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleGithubSignIn} disabled={isLoading}>
                <Image src="/github.png" alt="GitHub" width={20} height={20} className="mr-2" />
                {isLoading ? "Connecting..." : "GitHub"}
              </Button>
            </div>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">© 2025 OpacoVault. All rights reserved.</p>
      </div>
    </div>
  )
}
