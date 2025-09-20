export interface PriceData {
  symbol: string
  price: number
  change24h: number
  timestamp: number
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: number
}

// Cache for price data
const priceCache = new Map<string, PriceData>()
const rateCache = new Map<string, ExchangeRate>()
const CACHE_TTL = 60000 // 1 minute

// API endpoints
const INTERNAL_API = "/api/prices"
const COINGECKO_API = "https://api.coingecko.com/api/v3"
const BINANCE_API = "https://api.binance.com/api/v3"
const COINBASE_API = "https://api.coinbase.com/v2"
const CRYPTOCOMPARE_API = "https://min-api.cryptocompare.com/data"

// Fallback mock prices when API fails
const FALLBACK_PRICES = {
  BTC: 45000,
  ETH: 2800,
  BNB: 320,
  SOL: 100,
  POL: 0.85,
  TRX: 0.12,
  TON: 2.5,
  USDC: 1,
  USDT: 1,
  LUTAR: 0.004, // LUTAR token price in USD
}

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

export class PriceService {
  private static instance: PriceService
  private updateInterval?: NodeJS.Timeout
  private requestQueue: Array<() => Promise<void>> = []
  private isProcessingQueue = false
  private lastRequestTime = 0
  private readonly MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests
  private consecutiveFailures = 0
  private readonly MAX_FAILURES = 3

  static getInstance(): PriceService {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService()
    }
    return PriceService.instance
  }

  // Start periodic price updates
  startPriceUpdates(intervalMs: number = 60000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.updateAllPrices()
      } catch (error) {
        console.error("[PriceService] Error updating prices:", error)
      }
    }, intervalMs)

    // Initial update
    this.updateAllPrices()
  }

  // Stop price updates
  stopPriceUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = undefined
    }
  }

  // Get price for a specific token
  async getTokenPrice(symbol: string): Promise<number> {
    const cacheKey = symbol.toUpperCase()
    const cached = priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.price
    }

    try {
      const price = await this.fetchTokenPrice(symbol)
      priceCache.set(cacheKey, {
        symbol: cacheKey,
        price,
        change24h: 0,
        timestamp: Date.now(),
      })
      return price
    } catch (error) {
      console.error(`[PriceService] Error fetching price for ${symbol}:`, error)
      // Return cached price if available, otherwise 0
      return cached?.price || 0
    }
  }

  // Get exchange rate between two tokens
  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1

    const cacheKey = `${from}-${to}`
    const cached = rateCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.rate
    }

    try {
      const rate = await this.fetchExchangeRate(from, to)
      rateCache.set(cacheKey, {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        rate,
        timestamp: Date.now(),
      })
      return rate
    } catch (error) {
      console.error(`[PriceService] Error fetching exchange rate ${from}/${to}:`, error)
      // Return cached rate if available, otherwise 1
      return cached?.rate || 1
    }
  }

  // Get multiple token prices at once
  async getTokenPrices(symbols: string[]): Promise<Map<string, number>> {
    const prices = new Map<string, number>()
    
    // Check cache first
    const uncachedSymbols: string[] = []
    for (const symbol of symbols) {
      const cacheKey = symbol.toUpperCase()
      const cached = priceCache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        prices.set(symbol, cached.price)
      } else {
        uncachedSymbols.push(symbol)
      }
    }

    // Fetch uncached prices
    if (uncachedSymbols.length > 0) {
      try {
        const fetchedPrices = await this.fetchMultiplePrices(uncachedSymbols)
        for (const [symbol, price] of fetchedPrices) {
          prices.set(symbol, price)
          priceCache.set(symbol.toUpperCase(), {
            symbol: symbol.toUpperCase(),
            price,
            change24h: 0,
            timestamp: Date.now(),
          })
        }
      } catch (error) {
        console.error("[PriceService] Error fetching multiple prices:", error)
      }
    }

    return prices
  }

  // Update all supported token prices
  private async updateAllPrices() {
    const symbols = Object.keys(TOKEN_IDS)
    await this.getTokenPrices(symbols)
  }

  // Fetch price for a single token with multiple API fallbacks
  private async fetchTokenPrice(symbol: string): Promise<number> {
    const upperSymbol = symbol.toUpperCase()
    
    // Try internal API first
    try {
      await this.rateLimit()
      
      const response = await fetch(
        `${INTERNAL_API}?symbol=${upperSymbol}`,
        {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(8000)
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const price = data.prices?.[upperSymbol]
        if (price && price > 0) {
          this.markRequestSuccess()
          return price
        }
      }
    } catch (error) {
      console.warn(`[PriceService] Internal API failed for ${symbol}:`, error)
    }

    // Try external APIs as fallbacks
    const externalPrice = await this.tryExternalTokenPrice(upperSymbol)
    if (externalPrice > 0) {
      this.markRequestSuccess()
      return externalPrice
    }

    // Mark failure and return fallback
    this.markRequestFailure()
    console.warn(`[PriceService] All APIs failed for ${symbol}, using fallback`)
    return FALLBACK_PRICES[upperSymbol as keyof typeof FALLBACK_PRICES] || 0
  }

  // Try external APIs for token price
  private async tryExternalTokenPrice(symbol: string): Promise<number> {
    const tokenId = TOKEN_IDS[symbol as keyof typeof TOKEN_IDS]
    if (!tokenId) {
      console.warn(`[PriceService] No token ID mapping for ${symbol}`)
      return 0
    }

    const apis = [
      {
        name: 'CoinGecko',
        fetch: async () => {
          const response = await fetch(
            `${COINGECKO_API}/simple/price?ids=${tokenId}&vs_currencies=usd`,
            { 
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(5000)
            }
          )
          if (response.ok) {
            const data = await response.json()
            return data[tokenId]?.usd || 0
          }
          throw new Error(`CoinGecko API error: ${response.status}`)
        }
      },
      {
        name: 'CryptoCompare',
        fetch: async () => {
          const response = await fetch(
            `${CRYPTOCOMPARE_API}/price?fsym=${symbol}&tsyms=USD`,
            { 
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(5000)
            }
          )
          if (response.ok) {
            const data = await response.json()
            return data.USD || 0
          }
          throw new Error(`CryptoCompare API error: ${response.status}`)
        }
      },
      {
        name: 'Coinbase',
        fetch: async () => {
          const response = await fetch(
            `${COINBASE_API}/exchange-rates?currency=${symbol}`,
            { 
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(5000)
            }
          )
          if (response.ok) {
            const data = await response.json()
            const rate = data.data?.rates?.USD
            return rate ? parseFloat(rate) : 0
          }
          throw new Error(`Coinbase API error: ${response.status}`)
        }
      }
    ]

    // Try each external API
    for (const api of apis) {
      try {
        const price = await api.fetch()
        if (price > 0) {
          console.log(`[PriceService] Got ${symbol} price from ${api.name}: $${price}`)
          return price
        }
      } catch (error) {
        console.warn(`[PriceService] ${api.name} failed for ${symbol}:`, error)
        continue
      }
    }

    return 0 // No external API worked
  }

  // Fetch multiple token prices using internal API
  private async fetchMultiplePrices(symbols: string[]): Promise<Map<string, number>> {
    try {
      await this.rateLimit()
      
      const response = await fetch(INTERNAL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      })
      
      if (!response.ok) {
        this.markRequestFailure()
        throw new Error("Failed to fetch multiple prices")
      }

      const data = await response.json()
      this.markRequestSuccess()
      const prices = new Map<string, number>()

      // Map the response to our expected format
      for (const [symbol, price] of Object.entries(data.prices || {})) {
        prices.set(symbol, price as number)
      }

      return prices
    } catch (error) {
      this.markRequestFailure()
      console.error("[PriceService] API error for multiple prices, using fallbacks:", error)
      // Return fallback prices if API fails
      const fallbackPrices = new Map<string, number>()
      for (const symbol of symbols) {
        const upperSymbol = symbol.toUpperCase()
        fallbackPrices.set(upperSymbol, FALLBACK_PRICES[upperSymbol as keyof typeof FALLBACK_PRICES] || 0)
      }
      return fallbackPrices
    }
  }

  // Fetch exchange rate between two tokens with multiple API sources
  private async fetchExchangeRate(from: string, to: string): Promise<number> {
    try {
      // Handle USD as the base currency
      if (to.toUpperCase() === 'USD') {
        return await this.fetchTokenPrice(from)
      }
      
      if (from.toUpperCase() === 'USD') {
        const toPrice = await this.fetchTokenPrice(to)
        return toPrice === 0 ? 0 : 1 / toPrice
      }

      // Try direct exchange rate APIs first for better accuracy
      const directRate = await this.tryDirectExchangeRate(from, to)
      if (directRate !== null) {
        return directRate
      }

      // Fallback: calculate from USD prices
      const [fromPrice, toPrice] = await Promise.all([
        this.fetchTokenPrice(from),
        this.fetchTokenPrice(to),
      ])

      if (fromPrice === 0 || toPrice === 0) {
        throw new Error(`Invalid prices: ${from}=${fromPrice}, ${to}=${toPrice}`)
      }

      return fromPrice / toPrice
    } catch (error) {
      console.error(`[PriceService] Error calculating exchange rate ${from}/${to}:`, error)
      // Return fallback exchange rate if calculation fails
      return this.getFallbackExchangeRate(from, to)
    }
  }

  // Try direct exchange rate from multiple APIs
  private async tryDirectExchangeRate(from: string, to: string): Promise<number | null> {
    const apis = [
      {
        name: 'Binance',
        fetch: async () => {
          const response = await fetch(`${BINANCE_API}/ticker/price?symbol=${from}${to}`, {
            signal: AbortSignal.timeout(5000)
          })
          if (response.ok) {
            const data = await response.json()
            return parseFloat(data.price)
          }
          throw new Error(`Binance API error: ${response.status}`)
        }
      },
      {
        name: 'CryptoCompare',
        fetch: async () => {
          const response = await fetch(`${CRYPTOCOMPARE_API}/price?fsym=${from}&tsyms=${to}`, {
            signal: AbortSignal.timeout(5000)
          })
          if (response.ok) {
            const data = await response.json()
            const rate = data[to]
            if (rate && rate > 0) return rate
          }
          throw new Error(`CryptoCompare API error: ${response.status}`)
        }
      }
    ]

    // Try each API with proper error handling
    for (const api of apis) {
      try {
        const rate = await api.fetch()
        if (rate && rate > 0) {
          console.log(`[PriceService] Got ${from}/${to} direct rate from ${api.name}: ${rate}`)
          return rate
        }
      } catch (error) {
        console.warn(`[PriceService] ${api.name} failed for ${from}/${to}:`, error)
        continue
      }
    }

    return null // No direct rate available
  }

  // Get fallback exchange rate when API fails
  private getFallbackExchangeRate(from: string, to: string): number {
    const fromPrice = FALLBACK_PRICES[from.toUpperCase() as keyof typeof FALLBACK_PRICES] || 1
    const toPrice = FALLBACK_PRICES[to.toUpperCase() as keyof typeof FALLBACK_PRICES] || 1
    
    if (to.toUpperCase() === 'USD') {
      return fromPrice
    }
    
    if (from.toUpperCase() === 'USD') {
      return toPrice === 0 ? 0 : 1 / toPrice
    }
    
    return toPrice === 0 ? 0 : fromPrice / toPrice
  }

  // Get cached price data
  getCachedPrice(symbol: string): PriceData | null {
    return priceCache.get(symbol.toUpperCase()) || null
  }

  // Clear cache
  clearCache() {
    priceCache.clear()
    rateCache.clear()
  }

  // Rate limiting: ensure minimum time between requests with exponential backoff
  private async rateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    // Calculate delay based on consecutive failures
    let delay = this.MIN_REQUEST_INTERVAL
    if (this.consecutiveFailures > 0) {
      // Exponential backoff: 2s, 4s, 8s, 16s...
      delay = this.MIN_REQUEST_INTERVAL * Math.pow(2, this.consecutiveFailures - 1)
    }
    
    if (timeSinceLastRequest < delay) {
      const waitTime = delay - timeSinceLastRequest
      console.log(`[PriceService] Rate limiting: waiting ${waitTime}ms (failures: ${this.consecutiveFailures})`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }

  // Mark request as successful (reset failure counter)
  private markRequestSuccess(): void {
    this.consecutiveFailures = 0
  }

  // Mark request as failed (increment failure counter)
  private markRequestFailure(): void {
    this.consecutiveFailures++
    console.log(`[PriceService] Request failed, consecutive failures: ${this.consecutiveFailures}`)
  }

  // Process queued requests with rate limiting
  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return
    }

    this.isProcessingQueue = true

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        await this.rateLimit()
        try {
          await request()
        } catch (error) {
          console.error("[PriceService] Error processing queued request:", error)
        }
      }
    }

    this.isProcessingQueue = false
  }
}

// Export singleton instance
export const priceService = PriceService.getInstance()
