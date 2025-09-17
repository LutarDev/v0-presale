"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Lock, Eye } from "lucide-react"
import { useState } from "react"

interface TransactionSecurityCheckProps {
  transactionDetails: {
    amount: string
    token: string
    recipient: string
    gasLimit: string
    gasPrice: string
  }
  onSecurityConfirm: (confirmed: boolean) => void
}

export function TransactionSecurityCheck({ transactionDetails, onSecurityConfirm }: TransactionSecurityCheckProps) {
  const [securityChecks, setSecurityChecks] = useState({
    verifiedContract: false,
    confirmedAmount: false,
    understoodRisks: false,
    checkedPhishing: false,
  })

  const allChecksCompleted = Object.values(securityChecks).every(Boolean)

  const handleCheckChange = (key: keyof typeof securityChecks, checked: boolean) => {
    setSecurityChecks((prev) => ({ ...prev, [key]: checked }))
  }

  const handleConfirm = () => {
    if (allChecksCompleted) {
      onSecurityConfirm(true)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Transaction Security Check</h3>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Please review all transaction details carefully before proceeding. This action
          cannot be undone.
        </AlertDescription>
      </Alert>

      <div className="space-y-4 mb-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Transaction Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">
                {transactionDetails.amount} {transactionDetails.token}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-mono text-xs">{transactionDetails.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Limit:</span>
              <span>{transactionDetails.gasLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gas Price:</span>
              <span>{transactionDetails.gasPrice} Gwei</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="verified-contract"
              checked={securityChecks.verifiedContract}
              onCheckedChange={(checked) => handleCheckChange("verifiedContract", checked as boolean)}
            />
            <label htmlFor="verified-contract" className="text-sm leading-relaxed">
              I have verified that the contract address matches the official LUTAR presale contract
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="confirmed-amount"
              checked={securityChecks.confirmedAmount}
              onCheckedChange={(checked) => handleCheckChange("confirmedAmount", checked as boolean)}
            />
            <label htmlFor="confirmed-amount" className="text-sm leading-relaxed">
              I have confirmed the transaction amount and understand it will be deducted from my wallet
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="understood-risks"
              checked={securityChecks.understoodRisks}
              onCheckedChange={(checked) => handleCheckChange("understoodRisks", checked as boolean)}
            />
            <label htmlFor="understood-risks" className="text-sm leading-relaxed">
              I understand the risks involved in cryptocurrency transactions and token presales
            </label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="checked-phishing"
              checked={securityChecks.checkedPhishing}
              onCheckedChange={(checked) => handleCheckChange("checkedPhishing", checked as boolean)}
            />
            <label htmlFor="checked-phishing" className="text-sm leading-relaxed">
              I have verified I am on the official LUTAR website and not a phishing site
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleConfirm}
          disabled={!allChecksCompleted}
          className="flex-1"
          variant={allChecksCompleted ? "default" : "secondary"}
        >
          <Lock className="w-4 h-4 mr-2" />
          {allChecksCompleted ? "Proceed Securely" : "Complete Security Checks"}
        </Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>

      {!allChecksCompleted && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Please complete all security checks to proceed with the transaction
        </p>
      )}
    </Card>
  )
}
