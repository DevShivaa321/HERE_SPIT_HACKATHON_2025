"use client"

import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 flex-col items-center justify-center py-12">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent you a verification link. Please check your email to verify your account.
            </p>
          </div>

          <div className="grid gap-4">
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive an email? Check your spam folder or try again.
            </p>
            <Link href="/auth/signup">
              <Button variant="outline" className="w-full">
                Back to Sign Up
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
