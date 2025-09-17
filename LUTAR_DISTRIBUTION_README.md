# LUTAR Token Distribution System

This document describes the LUTAR token distribution system that automatically sends LUTAR tokens to users' BSC wallet addresses after successful payment confirmation.

## Overview

The system integrates with Thirdweb Engine v2 REST API to automatically distribute LUTAR tokens to users' BSC wallet addresses immediately after they complete a payment on any supported blockchain (BTC, ETH, BNB, SOL, POL, TRX, TON).

## Architecture

### Components

1. **LutarDistributionService** (`lib/lutar-distribution-service.ts`)
   - Core service for handling LUTAR token distribution
   - Interfaces with Thirdweb Engine v2 REST API
   - Handles parameter validation, amount conversion, and error handling

2. **Distribution API Route** (`app/api/distribute-lutar/route.ts`)
   - Next.js API route for handling distribution requests
   - Validates input parameters and backend wallet balance
   - Provides GET endpoint for balance checking and status monitoring

3. **Transaction Modal Integration** (`components/transaction-modal.tsx`)
   - Automatically triggers LUTAR distribution after successful payment
   - Shows real-time distribution status to users
   - Handles distribution errors gracefully

## Configuration

### Thirdweb Engine Settings

```typescript
ENGINE_URL: "https://engine-production-b94f.up.railway.app"
ACCESS_TOKEN: "zBvVLRq77mUNj6-BqNZbHaSYDIULI50GtKghcy9qd28HHEKwkDhpODYyAjkOH7EpL3xIsXO-ATZhnEHxQnYdaA"
BACKEND_WALLET: "0xfdCd87e45b13998326cA206Cc9De268f8CA480f8"
LUTAR_CONTRACT: "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E"
BSC_CHAIN_ID: "56"
LUTAR_DECIMALS: 18
```

### Backend Wallet Balance

Current balance: **999,975,780 LUTAR tokens** (approximately 1 billion tokens available)

## API Endpoints

### POST `/api/distribute-lutar`

Distributes LUTAR tokens to a BSC wallet address.

**Request Body:**
```json
{
  "recipientAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "lutarAmount": "1000.0",
  "paymentTxHash": "0x1234567890abcdef...",
  "paymentChain": "ETH",
  "paymentToken": "ETH", 
  "paymentAmount": "0.1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "LUTAR tokens distributed successfully",
  "distributionTxHash": "0x...",
  "queueId": "...",
  "recipientAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  "amount": "1000.0",
  "paymentTxHash": "0x1234567890abcdef...",
  "timestamp": 1758101601948
}
```

### GET `/api/distribute-lutar?action=balance`

Check the backend wallet's LUTAR token balance.

**Response:**
```json
{
  "success": true,
  "balance": "999975780.000000",
  "wallet": "0xfdCd87e45b13998326cA206Cc9De268f8CA480f8",
  "contract": "0x2770904185Ed743d991D8fA21C8271ae6Cd4080E",
  "chain": "BSC"
}
```

### GET `/api/distribute-lutar?queueId=<queue_id>`

Check the status of a distribution transaction.

**Response:**
```json
{
  "success": true,
  "queueId": "...",
  "status": "mined",
  "transactionHash": "0x..."
}
```

## User Flow

1. **Payment Process:**
   - User selects blockchain and payment token
   - User enters payment amount and BSC wallet address
   - User connects wallet and confirms transaction

2. **Payment Confirmation:**
   - Transaction is executed on the selected blockchain
   - Payment transaction hash is received

3. **Automatic Distribution:**
   - System automatically calls LUTAR distribution API
   - LUTAR tokens are sent from backend wallet to user's BSC address
   - User sees real-time distribution status in the UI

4. **Completion:**
   - User receives confirmation of successful LUTAR token transfer
   - Distribution transaction hash is displayed
   - User can view transaction on BSC explorer

## Error Handling

### Validation Errors
- Invalid BSC wallet address format
- Invalid LUTAR amount
- Missing required parameters

### Distribution Errors
- Insufficient backend wallet balance
- Thirdweb Engine API errors
- Network connectivity issues

### User Experience
- Real-time status updates during distribution
- Clear error messages with troubleshooting steps
- Fallback handling for failed distributions

## Security Features

1. **Parameter Validation:**
   - BSC address format validation (0x + 40 hex characters)
   - Amount validation (positive numbers only)
   - Required field validation

2. **Balance Verification:**
   - Checks backend wallet balance before distribution
   - Prevents overdraft attempts

3. **Idempotency:**
   - Unique idempotency keys for each distribution request
   - Prevents duplicate distributions

4. **Transaction Tracking:**
   - Links distributions to original payment transactions
   - Maintains audit trail for all operations

## Monitoring and Maintenance

### Backend Wallet Management
- Monitor LUTAR token balance regularly
- Refill wallet when balance gets low
- Track distribution volume and patterns

### Error Monitoring
- Monitor API error rates
- Track failed distribution attempts
- Set up alerts for critical issues

### Performance Optimization
- Cache balance checks when appropriate
- Implement retry logic for transient failures
- Monitor Thirdweb Engine API response times

## Testing

### Manual Testing
```bash
# Check backend wallet balance
curl -X GET "http://localhost:3000/api/distribute-lutar?action=balance"

# Test distribution
curl -X POST "http://localhost:3000/api/distribute-lutar" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientAddress": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    "lutarAmount": "10.0",
    "paymentTxHash": "0x1234567890abcdef...",
    "paymentChain": "ETH",
    "paymentToken": "ETH",
    "paymentAmount": "0.001"
  }'
```

### Integration Testing
- Test with various blockchain networks
- Test with different payment amounts
- Test error scenarios (invalid addresses, insufficient balance)
- Test UI integration and status updates

## Future Enhancements

1. **Batch Distribution:**
   - Support for multiple recipients in single transaction
   - Reduced gas costs for bulk operations

2. **Scheduled Distribution:**
   - Support for delayed distributions
   - Time-based release schedules

3. **Enhanced Monitoring:**
   - Real-time distribution dashboard
   - Advanced analytics and reporting

4. **Multi-signature Support:**
   - Enhanced security with multi-sig wallets
   - Governance integration for large distributions

## Support and Troubleshooting

### Common Issues

1. **Distribution Failed:**
   - Check backend wallet balance
   - Verify BSC address format
   - Check Thirdweb Engine API status

2. **Slow Distribution:**
   - Check BSC network congestion
   - Monitor Thirdweb Engine response times
   - Consider gas price optimization

3. **Invalid Address Error:**
   - Ensure BSC address starts with "0x"
   - Verify address is 42 characters long
   - Check for typos in address

### Contact Information
For technical support or issues with the LUTAR distribution system, please contact the development team or check the system logs for detailed error information.
