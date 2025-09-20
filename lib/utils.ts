import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid Ethereum/BSC address
 * @param address - The address to validate
 * @returns boolean - True if valid, false otherwise
 */
export function isValidEthereumAddress(address: string): boolean {
  // Basic format check
  if (!address || typeof address !== 'string') {
    return false
  }

  // Must start with 0x and be 42 characters total
  if (!address.startsWith('0x') || address.length !== 42) {
    return false
  }

  // Must contain only valid hex characters
  const hexPattern = /^0x[a-fA-F0-9]{40}$/
  if (!hexPattern.test(address)) {
    return false
  }

  // Additional checks for common mistakes
  const addressLower = address.toLowerCase()
  
  // Check for null address (all zeros)
  if (addressLower === '0x0000000000000000000000000000000000000000') {
    return false
  }

  // Check for burn address (all f's)
  if (addressLower === '0xffffffffffffffffffffffffffffffffffffffff') {
    return false
  }

  return true
}

/**
 * Validates if a string is a valid BSC address (same as Ethereum)
 * @param address - The BSC address to validate
 * @returns boolean - True if valid, false otherwise
 */
export function isValidBSCAddress(address: string): boolean {
  return isValidEthereumAddress(address)
}

/**
 * Validates BSC address with additional checks and returns detailed result
 * @param address - The BSC address to validate
 * @returns object with validation result and error message if invalid
 */
export function validateBSCAddress(address: string): { 
  isValid: boolean; 
  error?: string; 
  warnings?: string[] 
} {
  const warnings: string[] = []

  // Basic validation
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required' }
  }

  // Trim whitespace
  const trimmedAddress = address.trim()
  if (trimmedAddress !== address) {
    warnings.push('Address contains leading/trailing whitespace')
  }

  // Format validation
  if (!trimmedAddress.startsWith('0x')) {
    return { isValid: false, error: 'Address must start with 0x' }
  }

  if (trimmedAddress.length !== 42) {
    return { 
      isValid: false, 
      error: `Invalid address length. Expected 42 characters, got ${trimmedAddress.length}` 
    }
  }

  // Hex validation
  const hexPattern = /^0x[a-fA-F0-9]{40}$/
  if (!hexPattern.test(trimmedAddress)) {
    return { isValid: false, error: 'Address contains invalid characters. Only hexadecimal characters (0-9, a-f, A-F) are allowed' }
  }

  const addressLower = trimmedAddress.toLowerCase()

  // Special address checks
  if (addressLower === '0x0000000000000000000000000000000000000000') {
    return { isValid: false, error: 'Cannot use null address (0x000...)' }
  }

  if (addressLower === '0xffffffffffffffffffffffffffffffffffffffff') {
    return { isValid: false, error: 'Cannot use burn address (0xfff...)' }
  }

  // Checksum validation (if mixed case)
  if (trimmedAddress !== addressLower && trimmedAddress !== trimmedAddress.toUpperCase()) {
    // This is a mixed case address, should validate checksum
    // For now, we'll add a warning but still allow it
    warnings.push('Mixed case address detected. Ensure checksum is correct.')
  }

  return { 
    isValid: true, 
    warnings: warnings.length > 0 ? warnings : undefined 
  }
}
