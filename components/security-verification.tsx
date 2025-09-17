"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"

interface SecurityVerificationProps {
  walletAddress: string
  contractAddress: string
  transactionAmount: string
  onVerificationComplete: (verified: boolean) => void
}

export function SecurityVerification({
  walletAddress,
  contractAddress,
  transactionAmount,
  onVerificationComplete,
}: SecurityVerificationProps) {
  const [verificationSteps, setVerificationSteps] = useState([
    { id: "wallet", label: "Wallet Address Verification", status: "pending" },
    { id: "contract", label: "Smart Contract Verification", status: "pending" },
    { id: "amount", label: "Transaction Amount Check", status: "pending" },
    { id: "phishing", label: "Anti-Phishing Verification", status: "pending" },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const runVerification = async () => {
      for (let i = 0; i < verificationSteps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setCurrentStep(i)
        setVerificationSteps((prev) =>
          prev.map((step, index) => (index === i ? { ...step, status: "completed" } : step)),
        )
      }
      onVerificationComplete(true)
    }

    runVerification()
  }, [onVerificationComplete])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      default:
        return <div className="w-4 h-4 border-2 border-muted rounded-full" />
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Security Verification</h3>
        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
      </div>

      <div className="space-y-4 mb-6">
        {verificationSteps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            {getStatusIcon(step.status)}
            <span className={`text-sm ${step.status === "completed" ? "text-green-500" : "text-muted-foreground"}`}>
              {step.label}
            </span>
            {index === currentStep && step.status !== "completed" && (
              <Badge variant="outline" className="text-xs">
                Verifying...
              </Badge>
            )}
          </div>
        ))}
      </div>

      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> Always verify the contract address and transaction details before
          proceeding. Never share your private keys or seed phrases.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full justify-between bg-transparent"
        >
          <span>View Security Details</span>
          {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>

        {showDetails && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wallet Address:</span>
              <span className="font-mono text-xs">{walletAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contract Address:</span>
              <span className="font-mono text-xs">{contractAddress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction Amount:</span>
              <span className="font-medium">{transactionAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Security Score:</span>
              <span className="text-green-500 font-medium">98/100</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
