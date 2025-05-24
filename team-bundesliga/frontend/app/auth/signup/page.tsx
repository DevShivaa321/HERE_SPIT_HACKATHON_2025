"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { MapPin, ArrowLeft, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function SignUp() {
  const [step, setStep] = useState<"signup" | "verify">("signup")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First, check if the user already exists
      const { data: existingUser } = await supabase.from("user_profiles").select("id").eq("email", email).single()

      if (existingUser) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Sign up the user with phone verification
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      // For demo purposes, we'll simulate OTP verification
      // In a real app, Supabase would send the OTP via email
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code. For demo purposes, use '123456'",
      })

      setStep("verify")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // For demo purposes, we'll accept any 6-digit code
      // In a real app, you would verify with Supabase
      if (otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit code")
      }

      // Simulate verification success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Account verified",
        description: "Welcome to MapInsight AI!",
      })

      // Sign in the user
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = async () => {
    setLoading(true)
    try {
      // In a real app, you would call Supabase to resend the OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification code resent",
        description: "Please check your email for the new verification code. For demo purposes, use '123456'",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification code",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-950 dark:to-indigo-950">
      <div className="container flex flex-1 flex-col items-center justify-center py-12">
        <Link
          href="/"
          className="mb-8 flex items-center text-lg font-medium text-purple-700 hover:text-purple-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              {step === "signup" ? (
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              ) : (
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {step === "signup" ? "Create an account" : "Verify your email"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "signup"
                ? "Enter your email below to create your account"
                : "Enter the verification code sent to your email"}
            </p>
          </div>

          <div className="grid gap-6">
            {step === "signup" ? (
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="flex justify-center">
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 text-center text-lg tracking-widest w-full"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      For demo purposes, enter any 6-digit code (e.g., 123456)
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resendOTP}
                    disabled={loading}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    Resend Code
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline text-purple-600 hover:text-purple-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
