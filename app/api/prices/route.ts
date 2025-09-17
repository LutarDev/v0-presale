import { NextRequest, NextResponse } from 'next/server'

// Supported tokens mapping
const TOKEN_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  POL: "matic-network",
  TRX: "tron",
  TON: "the-open-network",
  USDC: "usd-coin",
  USDT: "tether",
  // LUTAR: "lutar-token", // LUTAR token ID - not available on CoinGecko, will use fallback
}

const COINGECKO_API = "https://api.coingecko.com/api/v3"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get('symbols')?.split(',') || []
    const singleSymbol = searchParams.get('symbol')
    
    if (symbols.length === 0 && !singleSymbol) {
      return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
    }

    // Determine which tokens to fetch
    const tokensToFetch = singleSymbol ? [singleSymbol] : symbols
    const cacheKey = tokensToFetch.sort().join(',')
    
    // Check cache first
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[API] GET: Returning cached data for:', cacheKey)
      return NextResponse.json(cached.data)
    }
    
    // Map symbols to CoinGecko IDs
    const tokenIds = tokensToFetch
      .map(symbol => TOKEN_IDS[symbol.toUpperCase() as keyof typeof TOKEN_IDS])
      .filter(Boolean)
      .join(",")

    if (!tokenIds) {
      return NextResponse.json({ error: 'No valid tokens found' }, { status: 400 })
    }

    console.log('[API] GET: Making request to CoinGecko for:', cacheKey)

    // Make request to CoinGecko API
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${tokenIds}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LUTAR-Presale/1.0',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`CoinGecko API error: ${response.status} ${response.statusText} - ${errorText}`)
      return NextResponse.json({ error: 'Failed to fetch prices' }, { status: response.status })
    }

    const data = await response.json()
    console.log('[API] GET: CoinGecko response:', data)
    
    // Transform the response to match our expected format
    const prices: Record<string, number> = {}
    
    for (const [tokenId, priceData] of Object.entries(data)) {
      const symbol = Object.keys(TOKEN_IDS).find(
        key => TOKEN_IDS[key as keyof typeof TOKEN_IDS] === tokenId
      )
      if (symbol && priceData && typeof priceData === "object" && "usd" in priceData) {
        prices[symbol] = (priceData as any).usd
      }
    }

    // Add fallback prices for tokens not available on CoinGecko
    const fallbackPrices = {
      LUTAR: 0.004, // LUTAR token price in USD
    }

    for (const symbol of tokensToFetch) {
      const upperSymbol = symbol.toUpperCase()
      if (!prices[upperSymbol] && fallbackPrices[upperSymbol as keyof typeof fallbackPrices]) {
        console.log(`[API] GET: Using fallback price for ${upperSymbol}: ${fallbackPrices[upperSymbol as keyof typeof fallbackPrices]}`)
        prices[upperSymbol] = fallbackPrices[upperSymbol as keyof typeof fallbackPrices]
      }
    }

    const result = {
      prices,
      timestamp: Date.now(),
    }

    // Cache the result
    requestCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    // Clean up old cache entries
    for (const [key, value] of requestCache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL * 2) {
        requestCache.delete(key)
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Price API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle rate limiting with a simple in-memory cache
const requestCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 30000 // 30 seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symbols } = body

    console.log('[API] POST request received with symbols:', symbols)

    if (!symbols || !Array.isArray(symbols)) {
      console.log('[API] Invalid symbols array:', symbols)
      return NextResponse.json({ error: 'Invalid symbols array' }, { status: 400 })
    }

    const cacheKey = symbols.sort().join(',')
    const cached = requestCache.get(cacheKey)
    
    // Check if we have cached data that's still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[API] Returning cached data for:', cacheKey)
      return NextResponse.json(cached.data)
    }

    // Make request to CoinGecko API
    const tokenIds = symbols
      .map(symbol => TOKEN_IDS[symbol.toUpperCase() as keyof typeof TOKEN_IDS])
      .filter(Boolean)
      .join(",")

    console.log('[API] Mapped symbols to token IDs:', tokenIds)

    if (!tokenIds) {
      console.log('[API] No valid tokens found for symbols:', symbols)
      return NextResponse.json({ error: 'No valid tokens found' }, { status: 400 })
    }

    console.log('[API] Making request to CoinGecko:', `${COINGECKO_API}/simple/price?ids=${tokenIds}&vs_currencies=usd`)
    
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${tokenIds}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LUTAR-Presale/1.0',
        },
        signal: AbortSignal.timeout(10000),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`CoinGecko API error: ${response.status} ${response.statusText} - ${errorText}`)
      return NextResponse.json({ error: 'Failed to fetch prices' }, { status: response.status })
    }

    const data = await response.json()
    console.log('[API] CoinGecko response:', data)
    
    // Transform the response
    const prices: Record<string, number> = {}
    
    for (const [tokenId, priceData] of Object.entries(data)) {
      const symbol = Object.keys(TOKEN_IDS).find(
        key => TOKEN_IDS[key as keyof typeof TOKEN_IDS] === tokenId
      )
      if (symbol && priceData && typeof priceData === "object" && "usd" in priceData) {
        prices[symbol] = (priceData as any).usd
      }
    }

    // Add fallback prices for tokens not available on CoinGecko
    const fallbackPrices = {
      LUTAR: 0.004, // LUTAR token price in USD
    }

    for (const symbol of symbols) {
      const upperSymbol = symbol.toUpperCase()
      if (!prices[upperSymbol] && fallbackPrices[upperSymbol as keyof typeof fallbackPrices]) {
        console.log(`[API] Using fallback price for ${upperSymbol}: ${fallbackPrices[upperSymbol as keyof typeof fallbackPrices]}`)
        prices[upperSymbol] = fallbackPrices[upperSymbol as keyof typeof fallbackPrices]
      }
    }

    const result = {
      prices,
      timestamp: Date.now(),
    }

    // Cache the result
    requestCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    })

    // Clean up old cache entries
    for (const [key, value] of requestCache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL * 2) {
        requestCache.delete(key)
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Price API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
