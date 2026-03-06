import { Metadata } from "next"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { ModalLayout } from "@/components/ui/modal-layout"
import { X } from "lucide-react"

export const metadata: Metadata = {
  title: "Register Modal",
  description: "Create an account",
}

export default function RegisterModalPage() {
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
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <RegisterForm />
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/modal/login" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </ModalLayout>
  )
}
