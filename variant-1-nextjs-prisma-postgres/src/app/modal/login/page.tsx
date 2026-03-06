import { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { ModalLayout } from "@/components/ui/modal-layout"
import { X } from "lucide-react"

export const metadata: Metadata = {
  title: "Login Modal",
  description: "Login to your account",
}

export default function LoginModalPage() {
  return (
    <ModalLayout>
      <div className="absolute right-4 top-4">
        <Link href="/" className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Link>
      </div>
      <div className="flex flex-col space-y-2 text-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <LoginForm />
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/modal/register" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </div>
    </ModalLayout>
  )
}
