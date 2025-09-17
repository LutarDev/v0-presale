import { Header } from "@/components/header"
import { SecurityDashboard } from "@/components/security-dashboard"
import { Footer } from "@/components/footer"

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security Center</h1>
            <p className="text-muted-foreground">Monitor and manage your account security settings</p>
          </div>
          <SecurityDashboard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
