import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Multi-Chain Token
            <span className="block text-primary">Presale Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Participate in LUTAR token presale across 7 major blockchains. Secure, fast, and decentralized token
            distribution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href="/buy">
                Join Presale Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              View Whitepaper
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ready to participate? Connect your wallet using the button in the header above to get started.
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
              <span>Supported blockchains:</span>
              <div className="flex gap-1">
                <span className="px-2 py-1 bg-[#f7931a]/20 text-[#f7931a] rounded text-xs">BTC</span>
                <span className="px-2 py-1 bg-[#627eea]/20 text-[#627eea] rounded text-xs">ETH</span>
                <span className="px-2 py-1 bg-[#f3ba2f]/20 text-[#f3ba2f] rounded text-xs">BNB</span>
                <span className="px-2 py-1 bg-[#8c24a2]/20 text-[#8c24a2] rounded text-xs">SOL</span>
                <span className="px-2 py-1 bg-[#8247e5]/20 text-[#8247e5] rounded text-xs">POL</span>
                <span className="px-2 py-1 bg-[#ff060a]/20 text-[#ff060a] rounded text-xs">TRX</span>
                <span className="px-2 py-1 bg-[#0088cc]/20 text-[#0088cc] rounded text-xs">TON</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 text-center hover:bg-card/80 transition-colors">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure & Audited</h3>
            <p className="text-muted-foreground text-sm">Smart contracts audited by leading security firms</p>
          </Card>

          <Card className="p-6 text-center hover:bg-card/80 transition-colors">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Processing</h3>
            <p className="text-muted-foreground text-sm">Fast transaction processing across all supported chains</p>
          </Card>

          <Card className="p-6 text-center hover:bg-card/80 transition-colors">
            <div className="w-12 h-12 bg-ring/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-ring" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Multi-Chain Support</h3>
            <p className="text-muted-foreground text-sm">Support for 7 major blockchains and their native tokens</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
