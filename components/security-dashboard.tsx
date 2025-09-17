"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { useState } from "react"

const securityMetrics = [
  {
    label: "Wallet Security Score",
    value: "98/100",
    status: "excellent",
    description: "Your wallet connection is secure",
  },
  {
    label: "Transaction History",
    value: "Clean",
    status: "good",
    description: "No suspicious activity detected",
  },
  {
    label: "Phishing Protection",
    value: "Active",
    status: "excellent",
    description: "Real-time phishing detection enabled",
  },
  {
    label: "Smart Contract Audit",
    value: "Verified",
    status: "excellent",
    description: "Contract audited by CertiK & Quantstamp",
  },
]

const securityAlerts = [
  {
    type: "info",
    title: "Security Update Available",
    message: "A new security patch is available for your wallet. Update recommended.",
    timestamp: "2 hours ago",
  },
  {
    type: "warning",
    title: "Unusual Login Location",
    message: "Login detected from a new location. If this wasn't you, secure your account immediately.",
    timestamp: "1 day ago",
  },
]

export function SecurityDashboard() {
  const [lastSecurityScan, setLastSecurityScan] = useState("2 minutes ago")
  const [isScanning, setIsScanning] = useState(false)

  const runSecurityScan = async () => {
    setIsScanning(true)
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setLastSecurityScan("Just now")
    setIsScanning(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500/20 text-green-500 border-green-500/30"
      case "good":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "warning":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30"
      default:
        return "bg-red-500/20 text-red-500 border-red-500/30"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Shield className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Overview
            </h3>
            <p className="text-sm text-muted-foreground">Monitor your account security status</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runSecurityScan}
            disabled={isScanning}
            className="bg-transparent"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isScanning ? "Scanning..." : "Security Scan"}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {securityMetrics.map((metric, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.label}</span>
                <Badge className={getStatusColor(metric.status)}>{metric.value}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last security scan: {lastSecurityScan}</span>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>All systems secure</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Alerts</h3>
        <div className="space-y-3">
          {securityAlerts.map((alert, index) => (
            <Alert key={index} className={alert.type === "warning" ? "border-amber-500 bg-amber-500/10" : ""}>
              {getAlertIcon(alert.type)}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>{alert.title}</strong>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Best Practices</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Use Hardware Wallets</p>
              <p className="text-sm text-muted-foreground">
                Store your tokens in a hardware wallet for maximum security
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Verify Contract Addresses</p>
              <p className="text-sm text-muted-foreground">
                Always double-check contract addresses before transactions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Enable Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your accounts</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Keep Software Updated</p>
              <p className="text-sm text-muted-foreground">
                Regularly update your wallet software and browser extensions
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
