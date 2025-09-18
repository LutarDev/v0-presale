"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface BscWalletInputProps {
  value: string
  onChange: (address: string) => void
  error?: string
  disabled?: boolean
}

export const BscWalletInput: React.FC<BscWalletInputProps> = ({
  value,
  onChange,
  error,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        BSC Wallet Address (Required)
      </label>
      <input
        type="text"
        placeholder="0x..."
        value={value}
        disabled={disabled}
        className={cn(
          "w-full p-3 bg-gray-700 text-white rounded-lg border transition-colors",
          "focus:outline-none focus:ring-0",
          error 
            ? "border-red-500 focus:border-red-400" 
            : "border-gray-600 focus:border-yellow-400"
        )}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}
      <p className="text-gray-400 text-xs">
        ⚠️ You must have access to this wallet address to access your presale participant dashboard
      </p>
    </div>
  )
}
