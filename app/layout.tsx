import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import AppHeader from "@/components/AppHeader"
import AppFooter from "@/components/AppFooter"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dev Utility Hub",
  description: "All-in-one developer tools dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-zinc-50 dark:bg-linear-to-br dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-100 antialiased`}
      >
        <Providers>
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  </Providers>
      </body>
    </html>
  )
}
