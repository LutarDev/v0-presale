/**
 * LUTAR Presale Platform - Icon Component System
 * Unified icon component with TypeScript support and theme handling
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  IconProps, 
  CoinIconProps, 
  WalletIconProps, 
  ArrowIconProps, 
  CheckmarkIconProps,
  ThemedIconProps,
  IconError,
  ICON_SIZES,
  ICON_COLORS,
  IconSize,
  IconColor,
  Theme
} from '@/lib/asset-types'
import { getIconMetadata, getIconPath } from '@/lib/icon-registry'

// ============================================================================
// BASE ICON COMPONENT
// ============================================================================

interface BaseIconProps extends Omit<IconProps, 'name'> {
  category: string
  iconName: string
  fallbackIcon?: string
  showFallback?: boolean
}

export function BaseIcon({
  category,
  iconName,
  size = 'md',
  className = '',
  color,
  strokeWidth,
  fill,
  stroke,
  onClick,
  style,
  fallbackIcon = '/images/icons/coins/lutar.svg',
  showFallback = true
}: BaseIconProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get icon metadata
  const metadata = getIconMetadata(category as any, iconName)
  const iconPath = metadata?.path || fallbackIcon

  // Handle size conversion
  const iconSize = typeof size === 'string' ? ICON_SIZES[size as IconSize] || 24 : size

  // Handle color application
  const iconStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    ...(color && { color: ICON_COLORS[color as IconColor] || color }),
    ...(fill && { fill }),
    ...(stroke && { stroke }),
    ...(strokeWidth && { strokeWidth }),
    ...style
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  // If it's an SVG and we have custom styling, render as img with style
  if (metadata?.format === 'svg' && (color || fill || stroke || strokeWidth)) {
    return (
      <img
        src={iconPath}
        alt={iconName}
        width={iconSize}
        height={iconSize}
        className={`inline-block ${className}`}
        style={iconStyle}
        onClick={onClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    )
  }

  // Use Next.js Image for better optimization
  return (
    <div 
      className={`inline-block ${className}`}
      style={{ width: iconSize, height: iconSize }}
      onClick={onClick}
    >
      <Image
        src={iconPath}
        alt={iconName}
        width={iconSize}
        height={iconSize}
        className="object-contain"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={iconStyle}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width: iconSize, height: iconSize }}
        />
      )}
      {imageError && showFallback && (
        <div 
          className="flex items-center justify-center bg-gray-100 rounded"
          style={{ width: iconSize, height: iconSize }}
        >
          <span className="text-xs text-gray-500">?</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SPECIALIZED ICON COMPONENTS
// ============================================================================

export function CoinIcon({ 
  coin, 
  size = 'md', 
  className = '', 
  color,
  onClick,
  style 
}: CoinIconProps) {
  return (
    <BaseIcon
      category="coins"
      iconName={coin}
      size={size}
      className={className}
      color={color}
      onClick={onClick}
      style={style}
    />
  )
}

export function WalletIcon({ 
  wallet, 
  size = 'md', 
  className = '', 
  color,
  onClick,
  style 
}: WalletIconProps) {
  return (
    <BaseIcon
      category="wallets"
      iconName={wallet}
      size={size}
      className={className}
      color={color}
      onClick={onClick}
      style={style}
    />
  )
}

export function ArrowIcon({ 
  direction, 
  color, 
  style = 'short',
  size = 'md', 
  className = '', 
  onClick,
  ...props 
}: ArrowIconProps) {
  const iconName = style === 'long' 
    ? `long-arrow-${direction}-${color}`
    : `arrow-${direction}-${color}`

  return (
    <BaseIcon
      category="arrows"
      iconName={iconName}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    />
  )
}

export function CheckmarkIcon({ 
  state, 
  style = 'thin',
  size = 'md', 
  className = '', 
  color,
  onClick,
  ...props 
}: CheckmarkIconProps) {
  const iconName = state === 'success' 
    ? `checkmark-${style}-${color || 'black'}`
    : 'failed-checkmark'

  return (
    <BaseIcon
      category="checkmarks"
      iconName={iconName}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    />
  )
}

export function BlockchainFilterIcon({ 
  filter, 
  size = 'md', 
  className = '', 
  color,
  onClick,
  style 
}: { 
  filter: string
  size?: number | string
  className?: string
  color?: string
  onClick?: () => void
  style?: React.CSSProperties 
}) {
  return (
    <BaseIcon
      category="blockchain-filters"
      iconName={filter}
      size={size}
      className={className}
      color={color}
      onClick={onClick}
      style={style}
    />
  )
}

// ============================================================================
// THEMED ICON COMPONENT
// ============================================================================

export function ThemedIcon({ 
  name,
  category,
  theme = 'dark',
  lightIcon,
  darkIcon,
  size = 'md', 
  className = '', 
  color,
  onClick,
  style 
}: ThemedIconProps & { category: string }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(theme)

  // Auto-detect theme from system preference
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light')
      
      const handler = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  // Determine which icon to use
  const iconToUse = currentTheme === 'light' 
    ? (lightIcon || `${name}-light`)
    : (darkIcon || `${name}-dark` || name)

  return (
    <BaseIcon
      category={category}
      iconName={iconToUse}
      size={size}
      className={className}
      color={color}
      onClick={onClick}
      style={style}
    />
  )
}

// ============================================================================
// ICON LOADER COMPONENT
// ============================================================================

interface IconLoaderProps {
  category: string
  iconName: string
  size?: number | string
  className?: string
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function IconLoader({ 
  category, 
  iconName, 
  size = 'md', 
  className = '',
  fallback,
  loading 
}: IconLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => setIsLoading(false)
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  if (hasError && fallback) {
    return <>{fallback}</>
  }

  if (isLoading && loading) {
    return <>{loading}</>
  }

  return (
    <BaseIcon
      category={category}
      iconName={iconName}
      size={size}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}

// ============================================================================
// ICON GRID COMPONENT
// ============================================================================

interface IconGridProps {
  category: string
  icons: string[]
  size?: number | string
  className?: string
  onIconClick?: (iconName: string) => void
  columns?: number
}

export function IconGrid({ 
  category, 
  icons, 
  size = 'md', 
  className = '',
  onIconClick,
  columns = 4
}: IconGridProps) {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {icons.map((iconName) => (
        <div
          key={iconName}
          className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => onIconClick?.(iconName)}
        >
          <BaseIcon
            category={category}
            iconName={iconName}
            size={size}
            className="mb-2"
          />
          <span className="text-xs text-gray-600 capitalize">
            {iconName.replace(/-/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export {
  BaseIcon,
  CoinIcon,
  WalletIcon,
  ArrowIcon,
  CheckmarkIcon,
  BlockchainFilterIcon,
  ThemedIcon,
  IconLoader,
  IconGrid
}

export default BaseIcon
