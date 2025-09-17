# Realtime Service Implementation

## Current Status

The LUTAR Presale Platform now includes a comprehensive real-time data service that handles live updates for balances, prices, transactions, and presale metrics.

## WebSocket Connection Behavior

### Development Mode
- **WebSocket**: Disabled in development mode to avoid connection errors
- **Fallback**: Uses polling every 30 seconds for real-time updates
- **Console**: Shows `[RealtimeService] Development mode: Using polling only`

### Production Mode
- **WebSocket**: Attempts to connect to `wss://api.lutar.io/ws`
- **Fallback**: If WebSocket fails, automatically falls back to polling
- **Reconnection**: Attempts up to 5 reconnections with exponential backoff

## Current Implementation

### Real-time Features
✅ **Balance Updates**: Live wallet balance updates across all supported chains
✅ **Price Updates**: Real-time cryptocurrency price updates via CoinGecko API
✅ **Transaction Updates**: Transaction status and confirmation tracking
✅ **Presale Updates**: Live presale metrics (raised amount, participants, progress)

### Data Sources
- **Balances**: 
  - Bitcoin: Blockstream API
  - Solana: Solana Web3.js
  - TON: TON Center API
  - Ethereum/BSC/Polygon: Direct RPC calls
- **Prices**: CoinGecko API with 1-minute caching
- **Transactions**: Mock data (ready for blockchain integration)
- **Presale**: Mock data (ready for backend integration)

### Error Handling
- **Graceful Degradation**: Falls back to polling if WebSocket fails
- **Retry Logic**: Exponential backoff for failed connections
- **User Feedback**: Loading states and error boundaries
- **Console Logging**: Detailed logging for debugging

## Next Steps for Production

1. **Backend WebSocket Server**: Implement a real WebSocket server at `wss://api.lutar.io/ws`
2. **Database Integration**: Connect presale and transaction data to a real database
3. **Blockchain Integration**: Replace mock transaction updates with real blockchain monitoring
4. **Authentication**: Add WebSocket authentication for secure connections
5. **Rate Limiting**: Implement rate limiting for API calls

## Usage

The real-time service is automatically initialized when the app starts and provides:

```typescript
// Subscribe to balance updates
const subscription = realtimeService.subscribeToBalanceUpdates(
  address, 
  chain, 
  (update) => console.log('Balance updated:', update)
)

// Subscribe to price updates
const priceSubscription = realtimeService.subscribeToPriceUpdates(
  'lutar',
  (update) => console.log('Price updated:', update)
)

// Cleanup
subscription.unsubscribe()
```

## Configuration

The service automatically detects the environment:
- **Development**: `NODE_ENV === 'development'` → Uses polling only
- **Production**: `NODE_ENV === 'production'` → Attempts WebSocket, falls back to polling

This ensures a smooth development experience without WebSocket connection errors while maintaining production-ready real-time capabilities.
