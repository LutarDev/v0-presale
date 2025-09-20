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

export function waitForTronLinkReady(timeout: number = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now()
    let attempts = 0
    const maxAttempts = Math.floor(timeout / 500) // Check every 500ms instead of 100ms
    
    const checkReady = () => {
      attempts++
      const state = getTronLinkState()
      
      console.log(`[TronLink Helper] Check attempt ${attempts}/${maxAttempts}:`, {
        isReady: state.isReady,
        hasAccount: state.hasAccount,
        address: state.address,
        elapsed: Date.now() - startTime
      })
      
      if (state.isReady && state.hasAccount) {
        console.log('[TronLink Helper] TronLink is ready!')
        resolve(true)
        return
      }
      
      if (attempts >= maxAttempts || Date.now() - startTime > timeout) {
        console.warn('[TronLink Helper] Timeout waiting for TronLink to be ready')
        resolve(false)
        return
      }
      
      // Use longer intervals to avoid overwhelming TronLink
      setTimeout(checkReady, 500)
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

    console.log('[TronLink Helper] Requesting account access...')
    
    // Use a timeout for the request itself
    const requestPromise = tronWeb.request({ method: 'tron_requestAccounts' })
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    })
    
    await Promise.race([requestPromise, timeoutPromise])
    
    console.log('[TronLink Helper] Account request completed, waiting for initialization...')
    
    // Wait for the request to complete with longer timeout
    const isReady = await waitForTronLinkReady(15000)
    
    if (!isReady) {
      return { success: false, error: "TronLink failed to initialize after account request" }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error("TronLink access request failed:", error)
    
    if (error.code === 4001) {
      return { success: false, error: "User rejected the connection request" }
    }
    
    if (error.message?.includes('timeout')) {
      return { success: false, error: "Request timed out. Please try again." }
    }
    
    return { 
      success: false, 
      error: error.message || "Failed to request TronLink access" 
    }
  }
}