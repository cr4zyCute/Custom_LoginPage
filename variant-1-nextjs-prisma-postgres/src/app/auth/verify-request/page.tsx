
import { Metadata } from "next"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Check your email",
  description: "A sign in link has been sent to your email address.",
}

export default function VerifyRequestPage() {
  return (
    <AuthLayout 
      title="Check your email" 
      description="A sign in link has been sent to your email address."
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
           Click the link in the email we sent to sign in. If you don't see it, check your spam folder.
        </p>
        <Link href="/login">
            <Button variant="outline" className="w-full">
                Back to Login
            </Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
