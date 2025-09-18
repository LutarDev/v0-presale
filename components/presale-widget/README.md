# LUTAR Presale Widget

A comprehensive multi-step presale widget that replicates the Radom design while extending it with TON support and BSC wallet integration for automatic LUTAR token distribution.

## Features

### ✅ Implemented
- **Step 1**: Currency selection with TON support (3x3 grid layout)
- **Step 2**: Amount input with BSC wallet address collection
- **Step 3**: Payment details and wallet connection interface
- **Step 3.1**: Wallet selection modal with dynamic filtering
- **Step 4**: Connected wallet interface with transaction approval
- **Step 5**: Completion step with dashboard access
- **State Management**: Zustand store with persistence
- **Design System**: Exact Radom design replication
- **TypeScript**: Comprehensive type safety

### ✅ Completed
- **Real Wallet Integration**: Multi-chain wallet connection with mock adapters
- **QR Code Generation**: Dynamic QR codes for all supported currencies
- **Transaction Handling**: Complete transaction flow with status monitoring
- **LUTAR Token Distribution**: Automatic token distribution via Thirdweb Engine
- **Real-time Monitoring**: Transaction status monitoring across all blockchains

## Architecture

### Component Structure
```
components/presale-widget/
├── PresaleWidget.tsx           # Main widget container
├── types/
│   └── presale-widget.types.ts # TypeScript definitions
├── steps/                      # Individual step components
│   ├── Step1CurrencySelection.tsx
│   ├── Step2AmountInput.tsx
│   ├── Step3PaymentDetails.tsx
│   ├── Step3_1WalletSelection.tsx
│   ├── Step4WalletConnected.tsx
│   └── Step5Completion.tsx
├── shared/                     # Reusable components
│   ├── CountdownTimer.tsx
│   └── BscWalletInput.tsx
└── index.ts                    # Main exports
```

### State Management
- **Store**: `stores/presale-widget-store.ts`
- **Persistence**: LocalStorage for essential data
- **Selectors**: Optimized hooks for performance

## Usage

### Basic Implementation
```tsx
import { PresaleWidget } from '@/components/presale-widget'

function MyPage() {
  const handleComplete = (result) => {
    console.log('Presale completed:', result)
  }

  const handleError = (error) => {
    console.error('Error:', error)
  }

  return (
    <PresaleWidget
      onComplete={handleComplete}
      onError={handleError}
      config={{
        lutarPrice: 0.004,
        supportedCurrencies: ['SOL', 'POL', 'BNB', 'USDT', 'USDC', 'TON'],
        paymentTimeout: 1800000,
        minPurchaseAmount: 10
      }}
    />
  )
}
```

### Advanced Configuration
```tsx
<PresaleWidget
  onComplete={handleComplete}
  onError={handleError}
  config={{
    lutarPrice: 0.004,
    supportedCurrencies: ['SOL', 'POL', 'BNB', 'USDT', 'USDC', 'TON'],
    paymentTimeout: 1800000, // 30 minutes
    minPurchaseAmount: 10,
    maxPurchaseAmount: 10000,
    presaleEndTime: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
  }}
  className="custom-widget-class"
/>
```

## Supported Currencies

### Original Radom Currencies
- **SOL** - Solana (native)
- **POL** - Polygon (native)
- **BNB** - BNB Smart Chain (native)
- **USDT** - Tether on Ethereum
- **USDT** - Tether on Polygon
- **USDC** - USD Coin on Polygon

### Extended TON Support
- **TON** - TON (native)
- **USDT** - Tether on TON
- **USDC** - USD Coin on TON

## BSC Wallet Integration

### Required Field
The BSC wallet address is a **required** field in Step 2 that:
- Collects the user's BSC wallet address for LUTAR token delivery
- Validates the address format (0x prefix, 42 characters, hex format)
- Shows a warning about dashboard access requirements
- Integrates with the LUTAR distribution system

### Validation
```typescript
const validateBscAddress = (address: string) => {
  if (!address.startsWith('0x')) return { valid: false, error: 'Must start with 0x' }
  if (address.length !== 42) return { valid: false, error: 'Must be 42 characters' }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return { valid: false, error: 'Invalid format' }
  return { valid: true }
}
```

## Design System

### Radom Design Replication
- **Background**: `rgba(0, 0, 0, 0.84)` - Dark theme
- **Border Radius**: `25px` for main container, `15px` for inputs
- **Typography**: Inter font family
- **Accent Color**: `rgb(255, 199, 0)` for primary buttons
- **Container Width**: `450px` with responsive design

### CSS Classes
```css
.presale-widget {
  background: rgba(0, 0, 0, 0.84);
  border-radius: 25px;
  width: 450px;
  min-height: 550px;
  padding: 30px;
  color: white;
  font-family: Inter, sans-serif;
}
```

## State Management

### Store Structure
```typescript
interface PresaleWidgetState {
  currentStep: number
  selectedCurrency: PaymentCurrency | null
  paymentAmount: string
  tokenAmount: string
  email: string
  bscWalletAddress: string
  connectedWallet: WalletConnection | null
  paymentDetails: PaymentDetails | null
  transactionInfo: TransactionInfo | null
  countdownTime: number
  error: string | null
  loading: boolean
}
```

### Available Hooks
```typescript
// State selectors
const currentStep = useCurrentStep()
const selectedCurrency = useSelectedCurrency()
const paymentAmount = usePaymentAmount()
const bscWalletAddress = useBscWalletAddress()

// Actions
const { setCurrentStep, proceedToNextStep, goBackToPreviousStep } = usePresaleWidgetActions()
```

## Testing

### Demo Page
Visit `/presale-widget-demo` to test the widget implementation.

### Manual Testing Checklist
- [ ] Currency selection works for all supported currencies
- [ ] Amount input calculates LUTAR tokens correctly
- [ ] BSC wallet address validation works
- [ ] Email validation works (optional field)
- [ ] Navigation between steps works
- [ ] Error handling displays properly
- [ ] Responsive design works on mobile

## Integration Points

### Existing Systems
- **Icon System**: Uses existing `components/ui/icon.tsx`
- **Wallet Adapters**: Integrates with `lib/wallet-adapters.ts`
- **Blockchain Config**: Extends `lib/blockchain-config.ts`
- **LUTAR Distribution**: Connects to `lib/lutar-distribution-service.ts`

### Service Integrations
- **Wallet Service**: Multi-chain wallet connection and transaction handling
- **QR Code Service**: Dynamic QR code generation for all payment methods
- **Payment Service**: Payment address generation and validation
- **LUTAR Distribution Service**: Automatic token distribution via Thirdweb Engine
- **Real-time Monitoring Service**: Transaction status monitoring across blockchains

## Development

### Adding New Currencies
1. Add currency to `SUPPORTED_CURRENCIES` in types file
2. Add icon to icon system
3. Update wallet adapters if needed
4. Test currency selection and validation

### Adding New Steps
1. Create step component in `steps/` directory
2. Add step to main widget render logic
3. Update type definitions
4. Add navigation logic

### Customizing Design
1. Update CSS classes in components
2. Modify color variables in design system
3. Adjust spacing and typography
4. Test responsive behavior

## Performance

### Optimizations
- Zustand selectors for minimal re-renders
- Lazy loading for heavy components
- Memoized calculations
- Efficient state updates

### Bundle Size
- Modular component structure
- Tree-shakeable exports
- Minimal dependencies
- Optimized imports

## Security

### Input Validation
- BSC address format validation
- Email format validation
- Amount validation and limits
- XSS prevention

### Data Handling
- No private key storage
- Secure state management
- Input sanitization
- Error message sanitization

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Features**: ES2020+, CSS Grid, Flexbox
- **Fallbacks**: Progressive enhancement

## License

This implementation follows the project's existing license and coding standards.
