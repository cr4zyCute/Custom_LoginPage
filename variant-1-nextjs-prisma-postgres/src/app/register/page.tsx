
import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account",
}

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      description="Enter your email below to create your account"
    >
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          Login
        </Link>
      </div>

      <RegisterForm />
      
      <p className="px-8 text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  )
}
