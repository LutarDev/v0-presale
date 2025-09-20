/**
 * TronLink Connection Helper
 * Provides utilities for better TronLink integration
 */

export interface TronLinkState {
  isInstalled: boolean
  isReady: boolean
  hasAccount: boolean
  address?: string
}

export function getTronLinkState(): TronLinkState {
  if (typeof window === "undefined") {
    return {
      isInstalled: false,
      isReady: false,
      hasAccount: false
    }
  }

  const tronWeb = (window as any).tronWeb

  if (!tronWeb) {
    return {
      isInstalled: false,
      isReady: false,
      hasAccount: false
    }
  }

  return {
    isInstalled: true,
    isReady: tronWeb.ready,
    hasAccount: !!(tronWeb.defaultAddress?.base58),
    address: tronWeb.defaultAddress?.base58
  }
}

export function waitForTronLinkReady(timeout: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const checkReady = () => {
      const state = getTronLinkState()
      
      if (state.isReady && state.hasAccount) {
        resolve(true)
        return
      }
      
      if (Date.now() - startTime > timeout) {
        resolve(false)
        return
      }
      
      setTimeout(checkReady, 100)
    }
    
    checkReady()
  })
}

export async function requestTronLinkAccess(): Promise<{ success: boolean; error?: string }> {
  try {
    const tronWeb = (window as any).tronWeb
    
    if (!tronWeb) {
      return { success: false, error: "TronLink not found" }
    }

    await tronWeb.request({ method: 'tron_requestAccounts' })
    
    // Wait for the request to complete
    const isReady = await waitForTronLinkReady(5000)
    
    if (!isReady) {
      return { success: false, error: "TronLink failed to initialize after account request" }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error("TronLink access request failed:", error)
    
    if (error.code === 4001) {
      return { success: false, error: "User rejected the connection request" }
    }
    
    return { 
      success: false, 
      error: error.message || "Failed to request TronLink access" 
    }
  }
}