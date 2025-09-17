import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AntiPhishingBanner } from "@/components/anti-phishing-banner"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "LUTAR Token Presale - Multi-Chain Crypto Platform",
  description:
    "Participate in LUTAR token presale across multiple blockchains including BTC, ETH, BSC, SOL, Polygon, TRON, and TON",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AntiPhishingBanner />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
