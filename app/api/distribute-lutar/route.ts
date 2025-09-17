import { NextRequest, NextResponse } from "next/server"
import { LutarDistributionService, type LutarDistributionParams } from "@/lib/lutar-distribution-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[API] LUTAR distribution request:", body)

    // Validate required fields
    const requiredFields = ['recipientAddress', 'lutarAmount', 'paymentTxHash', 'paymentChain', 'paymentToken', 'paymentAmount']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create distribution parameters
    const distributionParams: LutarDistributionParams = {
      recipientAddress: body.recipientAddress,
      lutarAmount: body.lutarAmount,
      paymentTxHash: body.paymentTxHash,
      paymentChain: body.paymentChain,
      paymentToken: body.paymentToken,
      paymentAmount: body.paymentAmount,
    }

    // Validate BSC address format
    if (!distributionParams.recipientAddress.startsWith("0x") || distributionParams.recipientAddress.length !== 42) {
      return NextResponse.json(
        { error: "Invalid BSC wallet address format. Must be a valid Ethereum address starting with 0x" },
        { status: 400 }
      )
    }

    // Validate LUTAR amount
    const lutarAmountNum = Number.parseFloat(distributionParams.lutarAmount)
    if (isNaN(lutarAmountNum) || lutarAmountNum <= 0) {
      return NextResponse.json(
        { error: "Invalid LUTAR amount. Must be a positive number" },
        { status: 400 }
      )
    }

    console.log("[API] Starting LUTAR distribution with params:", distributionParams)

    // Check backend wallet balance first
    const balanceCheck = await LutarDistributionService.getBackendWalletBalance()
    if (!balanceCheck.success) {
      console.error("[API] Failed to check backend wallet balance:", balanceCheck.error)
      return NextResponse.json(
        { error: "Failed to verify backend wallet balance", details: balanceCheck.error },
        { status: 500 }
      )
    }

    console.log("[API] Backend wallet LUTAR balance:", balanceCheck.balance)

    // Check if we have enough balance
    const requiredAmount = Number.parseFloat(distributionParams.lutarAmount)
    const availableBalance = Number.parseFloat(balanceCheck.balance || "0")
    
    if (availableBalance < requiredAmount) {
      return NextResponse.json(
        { 
          error: "Insufficient LUTAR tokens in backend wallet", 
          availableBalance: balanceCheck.balance,
          requiredAmount: distributionParams.lutarAmount
        },
        { status: 400 }
      )
    }

    // Execute LUTAR token distribution
    const distributionResult = await LutarDistributionService.distributeLutarTokens(distributionParams)

    if (!distributionResult.success) {
      console.error("[API] LUTAR distribution failed:", distributionResult.error)
      return NextResponse.json(
        { 
          error: "Failed to distribute LUTAR tokens", 
          details: distributionResult.error 
        },
        { status: 500 }
      )
    }

    console.log("[API] LUTAR distribution successful:", distributionResult)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "LUTAR tokens distributed successfully",
      distributionTxHash: distributionResult.distributionTxHash,
      queueId: distributionResult.queueId,
      recipientAddress: distributionParams.recipientAddress,
      amount: distributionParams.lutarAmount,
      paymentTxHash: distributionParams.paymentTxHash,
      timestamp: Date.now(),
    })

  } catch (error) {
    console.error("[API] LUTAR distribution API error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check distribution status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queueId = searchParams.get('queueId')
    const action = searchParams.get('action')

    if (action === 'balance') {
      // Check backend wallet balance
      const balanceCheck = await LutarDistributionService.getBackendWalletBalance()
      
      if (!balanceCheck.success) {
        return NextResponse.json(
          { error: "Failed to get balance", details: balanceCheck.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        balance: balanceCheck.balance,
        wallet: "0xfdCd87e45b13998326cA206Cc9De268f8CA480f8",
        contract: "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E",
        chain: "BSC",
      })
    }

    if (!queueId) {
      return NextResponse.json(
        { error: "queueId parameter is required" },
        { status: 400 }
      )
    }

    // Check distribution status
    const statusCheck = await LutarDistributionService.checkDistributionStatus(queueId)
    
    if (!statusCheck.success) {
      return NextResponse.json(
        { error: "Failed to check status", details: statusCheck.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      queueId,
      status: statusCheck.status,
      transactionHash: statusCheck.transactionHash,
    })

  } catch (error) {
    console.error("[API] Distribution status check error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
