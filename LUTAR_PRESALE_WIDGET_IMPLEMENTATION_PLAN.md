# LUTAR Token Presale Widget Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for creating a multi-step LUTAR Token presale widget that replicates the Radom design while extending it with TON support and BSC wallet address collection for token distribution.

## 1. Project Analysis

### 1.1 Current State Analysis
- **Existing Infrastructure**: Well-established LUTAR presale platform with multi-chain support
- **Design System**: Comprehensive icon system, blockchain configurations, and UI components
- **Payment Processing**: Existing transaction handling and LUTAR distribution system
- **Wallet Integration**: Multi-chain wallet adapters and connection management

### 1.2 Radom Widget Analysis
Based on the RadomWidgetExample folder analysis:

**Design Characteristics:**
- Dark theme with `rgba(0, 0, 0, 0.84)` background
- Rounded corners (25px border-radius)
- White text with opacity variations
- Yellow/gold accent color (`rgb(255, 199, 0)`)
- Inter font family
- 450px width, responsive design

**Flow Structure:**
1. **Start View**: Currency selection with countdown timer
2. **Step 1**: Payment currency selector (3x3 grid)
3. **Step 2**: Amount input with email field
4. **Step 3**: QR code and payment details
5. **Step 3.1**: Wallet selection modal
6. **Step 4**: Connected wallet with transaction approval

## 2. Implementation Architecture

### 2.1 Component Structure
```
components/
├── presale-widget/
│   ├── PresaleWidget.tsx           # Main widget container
│   ├── steps/
│   │   ├── Step1CurrencySelection.tsx
│   │   ├── Step2AmountInput.tsx
│   │   ├── Step3PaymentDetails.tsx
│   │   ├── Step3_1WalletSelection.tsx
│   │   ├── Step4WalletConnected.tsx
│   │   └── Step5Completion.tsx
│   ├── shared/
│   │   ├── CurrencySelector.tsx
│   │   ├── AmountInput.tsx
│   │   ├── QRCodeDisplay.tsx
│   │   ├── WalletConnection.tsx
│   │   ├── CountdownTimer.tsx
│   │   └── BscWalletInput.tsx
│   └── types/
│       └── presale-widget.types.ts
```

### 2.2 State Management
```typescript
interface PresaleWidgetState {
  currentStep: number
  selectedCurrency: PaymentCurrency
  paymentAmount: string
  tokenAmount: string
  email: string
  bscWalletAddress: string
  connectedWallet: WalletConnection | null
  paymentDetails: PaymentDetails | null
  transactionStatus: TransactionStatus
  countdownTime: number
}
```

## 3. Detailed Implementation Steps

### 3.1 Step 1: Currency Selection
**Objective**: Replicate Radom's currency selection with TON support

**Features:**
- 3x3 grid layout matching Radom design
- Extended currency list including TON, USDT on TON, USDC on TON
- Visual feedback for selected currency
- Integration with existing icon system

**Implementation:**
```typescript
const SUPPORTED_CURRENCIES = [
  // Existing currencies from Radom
  { symbol: 'SOL', name: 'Solana', chain: 'solana', icon: 'solana' },
  { symbol: 'POL', name: 'Polygon', chain: 'polygon', icon: 'polygon' },
  { symbol: 'BNB', name: 'BNB', chain: 'bsc', icon: 'bnb' },
  { symbol: 'USDT', name: 'Tether on Ethereum', chain: 'ethereum', icon: 'usdt-eth' },
  { symbol: 'USDT', name: 'Tether on Polygon', chain: 'polygon', icon: 'usdt-polygon' },
  { symbol: 'USDC', name: 'USD Coin on Polygon', chain: 'polygon', icon: 'usdc-polygon' },
  
  // Extended currencies
  { symbol: 'TON', name: 'TON', chain: 'ton', icon: 'ton' },
  { symbol: 'USDT', name: 'Tether on TON', chain: 'ton', icon: 'usdt-ton' },
  { symbol: 'USDC', name: 'USD Coin on TON', chain: 'ton', icon: 'usdc-ton' }
]
```

### 3.2 Step 2: Amount Input & User Details
**Objective**: Collect payment amount, email, and BSC wallet address

**Features:**
- Real-time LUTAR token calculation
- Email field (optional)
- BSC wallet address field (required)
- Validation for all inputs
- Warning about wallet access requirement

**Key Addition - BSC Wallet Field:**
```typescript
const BscWalletInput = () => {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm font-medium">
        BSC Wallet Address (Required)
      </label>
      <input
        type="text"
        placeholder="0x..."
        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-400"
        onChange={(e) => onBscWalletChange(e.target.value)}
      />
      <p className="text-gray-400 text-xs">
        ⚠️ You must have access to this wallet address to access your presale participant dashboard
      </p>
    </div>
  )
}
```

### 3.3 Step 3: Payment Details & QR Code
**Objective**: Display payment information and wallet connection option

**Features:**
- QR code generation for payment address
- Payment amount and address display
- Copy functionality for address and amount
- Countdown timer for payment window
- Wallet connection button

### 3.4 Step 3.1: Wallet Selection Modal
**Objective**: Allow users to select compatible wallet

**Features:**
- Dynamic wallet list based on selected currency
- Wallet detection and "Detected" status
- Modal design matching Radom's styling
- Close button and proper focus management

### 3.5 Step 4: Connected Wallet Interface
**Objective**: Show connected wallet and enable transaction approval

**Features:**
- Connected wallet address display
- Disconnect option
- "Open Wallet" button for transaction approval
- Transaction monitoring
- Balance display

### 3.6 Step 5: Completion & Dashboard Access
**Objective**: Confirm successful payment and provide dashboard access

**Features:**
- Transaction confirmation display
- LUTAR token distribution status
- Dashboard access button
- Transaction history link

## 4. Integration Points

### 4.1 LUTAR Distribution System
**Integration with existing system:**
```typescript
const distributeLutarTokens = async (request: DistributionRequest) => {
  const response = await fetch('/api/distribute-lutar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientAddress: bscWalletAddress,
      lutarAmount: calculatedTokenAmount,
      paymentTxHash: txHash,
      paymentChain: selectedCurrency.chain,
      paymentToken: selectedCurrency.symbol,
      paymentAmount: paymentAmount
    })
  })
  
  return response.json()
}
```

### 4.2 Existing Infrastructure
- **Wallet Adapters**: Leverage existing multi-chain wallet system
- **Blockchain Config**: Extend with TON configuration
- **Icon System**: Use existing icon components
- **Transaction Handler**: Integrate with current payment processing

## 5. Technical Specifications

### 5.1 Styling Requirements
```css
/* Match Radom's exact styling */
.presale-widget {
  background: rgba(0, 0, 0, 0.84);
  border-radius: 25px;
  width: 450px;
  min-height: 550px;
  padding: 30px;
  color: white;
  font-family: Inter, sans-serif;
}

.widget-title {
  font-size: 46px;
  font-weight: 800;
  color: rgb(255, 255, 255);
}

.continue-button {
  background: rgb(255, 199, 0);
  color: rgba(0, 0, 0, 0.95);
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}
```

### 5.2 State Management
```typescript
// Using Zustand for state management
interface PresaleWidgetStore {
  currentStep: number
  selectedCurrency: PaymentCurrency | null
  paymentAmount: string
  tokenAmount: string
  email: string
  bscWalletAddress: string
  connectedWallet: WalletConnection | null
  paymentDetails: PaymentDetails | null
  transactionInfo: TransactionInfo | null
  
  // Actions
  setCurrentStep: (step: number) => void
  setSelectedCurrency: (currency: PaymentCurrency) => void
  setPaymentAmount: (amount: string) => void
  setBscWalletAddress: (address: string) => void
  connectWallet: (wallet: WalletAdapter) => void
  disconnectWallet: () => void
  proceedToNextStep: () => void
  goBackToPreviousStep: () => void
}
```

## 6. Implementation Timeline

### Phase 1: Core Infrastructure (Week 1)
- [ ] Create widget component structure
- [ ] Implement state management
- [ ] Set up styling system matching Radom design
- [ ] Create type definitions

### Phase 2: Step Implementation (Weeks 2-3)
- [ ] Step 1: Currency selection with TON support
- [ ] Step 2: Amount input and BSC wallet collection
- [ ] Step 3: Payment details and QR code
- [ ] Step 3.1: Wallet selection modal

### Phase 3: Advanced Features (Week 4)
- [ ] Step 4: Connected wallet interface
- [ ] Step 5: Completion and dashboard access
- [ ] LUTAR distribution integration
- [ ] Transaction monitoring

### Phase 4: Testing & Refinement (Week 5)
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance optimization

## 7. Quality Assurance

### 7.1 Testing Strategy
- **Unit Tests**: Component rendering and state management
- **Integration Tests**: Wallet connection and payment flow
- **E2E Tests**: Complete user journey
- **Cross-browser Testing**: Chrome, Firefox, Safari, Edge

### 7.2 Performance Requirements
- **Load Time**: < 2 seconds initial load
- **Responsiveness**: 60fps animations
- **Mobile Optimization**: Touch-friendly interface
- **Accessibility**: WCAG 2.1 AA compliance

## 8. Deployment Strategy

### 8.1 Modular Integration
```typescript
// Easy integration into existing pages
<PresaleWidget
  onComplete={(result) => {
    console.log('Presale completed:', result)
  }}
  onError={(error) => {
    console.error('Presale error:', error)
  }}
  config={{
    lutarPrice: 0.004,
    supportedCurrencies: ['SOL', 'POL', 'BNB', 'USDT', 'USDC', 'TON'],
    paymentTimeout: 1800000, // 30 minutes
    minPurchaseAmount: 10
  }}
/>
```

### 8.2 Environment Configuration
- **Development**: Test mode with mock data
- **Staging**: Real APIs with testnet
- **Production**: Full integration with mainnet

## 9. Success Metrics

### 9.1 User Experience
- **Conversion Rate**: > 80% completion rate
- **Time to Complete**: < 5 minutes average
- **Error Rate**: < 5% transaction failures
- **User Satisfaction**: > 4.5/5 rating

### 9.2 Technical Performance
- **Uptime**: 99.9% availability
- **Response Time**: < 500ms API responses
- **Error Recovery**: 100% error handling coverage
- **Mobile Usage**: > 60% mobile completion rate

## 10. Risk Mitigation

### 10.1 Technical Risks
- **Wallet Connection Failures**: Implement retry logic and fallbacks
- **Network Congestion**: Optimize gas estimation and transaction handling
- **Browser Compatibility**: Extensive cross-browser testing
- **Mobile Performance**: Progressive enhancement approach

### 10.2 Business Risks
- **User Confusion**: Clear instructions and validation messages
- **Payment Failures**: Comprehensive error handling and recovery
- **Token Distribution Issues**: Real-time monitoring and alerts
- **Security Concerns**: Multi-layer validation and audit trails

## 11. Future Enhancements

### 11.1 Short-term (3 months)
- Additional payment methods
- Enhanced mobile experience
- Real-time price updates
- Advanced analytics

### 11.2 Long-term (6+ months)
- Multi-language support
- Advanced security features
- Integration with more wallets
- Automated compliance features

## 12. Conclusion

This implementation plan provides a comprehensive roadmap for creating a LUTAR Token presale widget that matches the Radom design while extending functionality with TON support and BSC wallet integration. The modular architecture ensures easy integration and maintenance, while the phased approach allows for iterative development and testing.

The key success factors are:
1. **Exact Design Replication**: Matching Radom's visual design precisely
2. **Extended Functionality**: Adding TON support and BSC wallet collection
3. **Seamless Integration**: Leveraging existing infrastructure
4. **User Experience**: Ensuring smooth, intuitive flow
5. **Technical Excellence**: Robust, scalable implementation

This plan ensures the widget will be production-ready, user-friendly, and maintainable while meeting all specified requirements.
