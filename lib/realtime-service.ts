export interface RealtimeSubscription {
  id: string
  type: 'balance' | 'price' | 'transaction' | 'presale'
  unsubscribe: () => void
}

export interface BalanceUpdate {
  address: string
  chain: string
  balances: Record<string, string>
  timestamp: number
}

export interface PriceUpdate {
  symbol: string
  price: number
  change24h: number
  timestamp: number
}

export interface TransactionUpdate {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  timestamp: number
}

export interface PresaleUpdate {
  totalRaised: number
  participants: number
  progress: number
  timestamp: number
}

type EventCallback<T> = (data: T) => void

export class RealtimeService {
  private static instance: RealtimeService
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private eventListeners: Map<string, Set<EventCallback<any>>> = new Map()
  private wsConnection: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isDevelopment = process.env.NODE_ENV === 'development'
  private usePollingOnly = this.isDevelopment // Use polling only in development

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService()
    }
    return RealtimeService.instance
  }

  // Initialize WebSocket connection
  private initializeWebSocket(): void {
    if (typeof window === 'undefined') return

    // Skip WebSocket in development mode
    if (this.usePollingOnly) {
      console.log('[RealtimeService] Development mode: Using polling only')
      this.startPolling()
      return
    }

    try {
      // Use a mock WebSocket for now - in production, this would connect to your backend
      this.wsConnection = new WebSocket('wss://api.lutar.io/ws')
      
      this.wsConnection.onopen = () => {
        console.log('[RealtimeService] WebSocket connected')
        this.reconnectAttempts = 0
      }

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('[RealtimeService] Error parsing message:', error)
        }
      }

      this.wsConnection.onclose = () => {
        console.log('[RealtimeService] WebSocket disconnected')
        this.attemptReconnect()
      }

      this.wsConnection.onerror = (error) => {
        console.error('[RealtimeService] WebSocket error:', error)
      }
    } catch (error) {
      console.error('[RealtimeService] Failed to initialize WebSocket:', error)
      this.fallbackToPolling()
    }
  }

  // Fallback to polling if WebSocket fails
  private fallbackToPolling(): void {
    console.log('[RealtimeService] Falling back to polling')
    // Implement polling logic here
    this.startPolling()
  }

  private startPolling(): void {
    // Poll every 30 seconds
    setInterval(() => {
      this.pollForUpdates()
    }, 30000)
  }

  private async pollForUpdates(): Promise<void> {
    // Implement polling logic for different data types
    const activeSubscriptions = Array.from(this.subscriptions.values())
    
    for (const subscription of activeSubscriptions) {
      try {
        switch (subscription.type) {
          case 'balance':
            await this.pollBalanceUpdate(subscription)
            break
          case 'price':
            await this.pollPriceUpdate(subscription)
            break
          case 'transaction':
            await this.pollTransactionUpdate(subscription)
            break
          case 'presale':
            await this.pollPresaleUpdate(subscription)
            break
        }
      } catch (error) {
        console.error(`[RealtimeService] Error polling ${subscription.type}:`, error)
      }
    }
  }

  private async pollBalanceUpdate(subscription: RealtimeSubscription): Promise<void> {
    // Mock balance update polling
    const mockUpdate: BalanceUpdate = {
      address: subscription.id.split(':')[1] || '',
      chain: subscription.id.split(':')[0] || '',
      balances: {
        native: (Math.random() * 10).toFixed(4),
        usdc: (Math.random() * 1000).toFixed(2),
      },
      timestamp: Date.now(),
    }

    this.emit('balance', mockUpdate)
  }

  private async pollPriceUpdate(subscription: RealtimeSubscription): Promise<void> {
    // Mock price update polling
    const mockUpdate: PriceUpdate = {
      symbol: subscription.id,
      price: Math.random() * 100,
      change24h: (Math.random() - 0.5) * 20,
      timestamp: Date.now(),
    }

    this.emit('price', mockUpdate)
  }

  private async pollTransactionUpdate(subscription: RealtimeSubscription): Promise<void> {
    // Mock transaction update polling
    const mockUpdate: TransactionUpdate = {
      hash: subscription.id,
      status: 'confirmed',
      confirmations: Math.floor(Math.random() * 12) + 1,
      timestamp: Date.now(),
    }

    this.emit('transaction', mockUpdate)
  }

  private async pollPresaleUpdate(subscription: RealtimeSubscription): Promise<void> {
    // Mock presale update polling
    const mockUpdate: PresaleUpdate = {
      totalRaised: Math.random() * 1000000,
      participants: Math.floor(Math.random() * 1000) + 100,
      progress: Math.random() * 100,
      timestamp: Date.now(),
    }

    this.emit('presale', mockUpdate)
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`[RealtimeService] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.initializeWebSocket()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      console.log('[RealtimeService] Max reconnection attempts reached, falling back to polling')
      this.fallbackToPolling()
    }
  }

  private handleMessage(data: any): void {
    const { type, payload } = data
    
    switch (type) {
      case 'balance_update':
        this.emit('balance', payload)
        break
      case 'price_update':
        this.emit('price', payload)
        break
      case 'transaction_update':
        this.emit('transaction', payload)
        break
      case 'presale_update':
        this.emit('presale', payload)
        break
      default:
        console.warn('[RealtimeService] Unknown message type:', type)
    }
  }

  private emit(eventType: string, data: any): void {
    const listeners = this.eventListeners.get(eventType)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('[RealtimeService] Error in event callback:', error)
        }
      })
    }
  }

  // Public API methods
  public subscribeToBalanceUpdates(address: string, chain: string, callback: EventCallback<BalanceUpdate>): RealtimeSubscription {
    const id = `${chain}:${address}`
    const subscription: RealtimeSubscription = {
      id,
      type: 'balance',
      unsubscribe: () => this.unsubscribe(id)
    }

    this.subscriptions.set(id, subscription)
    this.addEventListener('balance', callback)

    return subscription
  }

  public subscribeToPriceUpdates(symbol: string, callback: EventCallback<PriceUpdate>): RealtimeSubscription {
    const subscription: RealtimeSubscription = {
      id: symbol,
      type: 'price',
      unsubscribe: () => this.unsubscribe(symbol)
    }

    this.subscriptions.set(symbol, subscription)
    this.addEventListener('price', callback)

    return subscription
  }

  public subscribeToTransactionUpdates(txHash: string, callback: EventCallback<TransactionUpdate>): RealtimeSubscription {
    const subscription: RealtimeSubscription = {
      id: txHash,
      type: 'transaction',
      unsubscribe: () => this.unsubscribe(txHash)
    }

    this.subscriptions.set(txHash, subscription)
    this.addEventListener('transaction', callback)

    return subscription
  }

  public subscribeToPresaleUpdates(callback: EventCallback<PresaleUpdate>): RealtimeSubscription {
    const id = 'presale:global'
    const subscription: RealtimeSubscription = {
      id,
      type: 'presale',
      unsubscribe: () => this.unsubscribe(id)
    }

    this.subscriptions.set(id, subscription)
    this.addEventListener('presale', callback)

    return subscription
  }

  private addEventListener(eventType: string, callback: EventCallback<any>): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set())
    }
    this.eventListeners.get(eventType)!.add(callback)
  }

  private unsubscribe(id: string): void {
    const subscription = this.subscriptions.get(id)
    if (subscription) {
      this.subscriptions.delete(id)
    }
  }

  public disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }
    
    this.subscriptions.clear()
    this.eventListeners.clear()
  }

  public isConnected(): boolean {
    return this.wsConnection?.readyState === WebSocket.OPEN
  }

  // Initialize the service
  public initialize(): void {
    if (typeof window !== 'undefined') {
      this.initializeWebSocket()
    }
  }
}

// Export singleton instance
export const realtimeService = RealtimeService.getInstance()
