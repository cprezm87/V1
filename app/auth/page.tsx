import type { Metadata } from "next"
import AuthPageClient from "./AuthPageClient"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return <AuthPageClient />
}
