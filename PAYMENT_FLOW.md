# Payment Flow Diagrams

Visual representation of how payments work in the admin transaction system.

## Card Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Clicks $ icon on account                                    │
│  2. Selects "Deposit" + "Card"                                  │
│  3. Enters amount: $100.00                                      │
│  4. Enters card details in Stripe Elements                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE ELEMENTS (Client)                      │
│                                                                  │
│  • Validates card number format                                 │
│  • Checks expiry date                                           │
│  • Validates CVC                                                │
│  • Creates payment method token                                 │
│  • Returns: pm_xxxxxxxxxxxxx                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  POST /api/admin/transactions                                   │
│  {                                                              │
│    accountId: 123,                                              │
│    type: "deposit",                                             │
│    amount: 100.00,                                              │
│    paymentMethod: "card",                                       │
│    paymentDetails: {                                            │
│      stripePaymentMethodId: "pm_xxxxx"                          │
│    }                                                            │
│  }                                                              │
│                                                                  │
│  Server Actions:                                                │
│  1. ✓ Verify admin permissions                                 │
│  2. ✓ Get account details                                      │
│  3. → Send to Stripe API                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE API                                    │
│                                                                  │
│  stripe.paymentIntents.create({                                 │
│    amount: 10000, // $100.00 in cents                          │
│    currency: 'usd',                                             │
│    payment_method: 'pm_xxxxx',                                  │
│    confirm: true                                                │
│  })                                                             │
│                                                                  │
│  Stripe Actions:                                                │
│  • Validates card with issuing bank                            │
│  • Checks for fraud                                            │
│  • Processes payment                                           │
│  • Returns result                                              │
│                                                                  │
│  Result: { status: "succeeded", id: "pi_xxxxx" }               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER (Continued)                       │
│                                                                  │
│  4. ✓ Payment succeeded                                        │
│  5. ✓ Create transaction record                                │
│     - Reference: TXN1234567890                                  │
│     - Status: completed                                         │
│     - Payment method: card                                      │
│     - Stripe ID: pi_xxxxx                                       │
│  6. ✓ Update account balance                                   │
│     - Old: $500.00                                             │
│     - New: $600.00                                             │
│  7. ✓ Return success response                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows success message: "Card deposit successful"            │
│  • Refreshes account data                                      │
│  • Updates balance display: $600.00                            │
│  • Adds transaction to history                                 │
│  • Closes modal                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Bank Transfer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Clicks $ icon on account                                    │
│  2. Selects "Deposit" + "Bank"                                  │
│  3. Enters amount: $500.00                                      │
│  4. Selects bank: "Chase Bank"                                  │
│  5. Enters account holder: "John Doe"                           │
│  6. Enters account number: 123456789                            │
│  7. Enters routing number: 110000000                            │
│  8. Clicks "Deposit Funds"                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  POST /api/admin/transactions                                   │
│  {                                                              │
│    accountId: 123,                                              │
│    type: "deposit",                                             │
│    amount: 500.00,                                              │
│    paymentMethod: "bank",                                       │
│    paymentDetails: {                                            │
│      bank: {                                                    │
│        name: "Chase Bank",                                      │
│        accountNumber: "123456789",                              │
│        accountHolderName: "John Doe",                           │
│        routingNumber: "110000000"                               │
│      }                                                          │
│    }                                                            │
│  }                                                              │
│                                                                  │
│  Server Actions:                                                │
│  1. ✓ Verify admin permissions                                 │
│  2. ✓ Get account details                                      │
│  3. ✓ Validate routing number (9 digits)                       │
│  4. ✓ Validate account holder name                             │
│  5. ✓ Create transaction record                                │
│     - Reference: TXN1234567891                                  │
│     - Status: completed                                         │
│     - Payment method: bank                                      │
│     - Bank details stored                                       │
│  6. ✓ Update account balance                                   │
│     - Old: $500.00                                             │
│     - New: $1,000.00                                           │
│  7. ✓ Return success response                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows success message: "Deposit successful"                 │
│  • Refreshes account data                                      │
│  • Updates balance display: $1,000.00                          │
│  • Adds transaction to history                                 │
│  • Closes modal                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Account Adjustment Flow (Direct)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Clicks $ icon on account                                    │
│  2. Selects "Deposit" + "Account"                               │
│  3. Enters amount: $250.00                                      │
│  4. Enters description: "Bonus payment"                         │
│  5. Clicks "Deposit Funds"                                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  POST /api/admin/transactions                                   │
│  {                                                              │
│    accountId: 123,                                              │
│    type: "deposit",                                             │
│    amount: 250.00,                                              │
│    paymentMethod: "account",                                    │
│    description: "Bonus payment"                                 │
│  }                                                              │
│                                                                  │
│  Server Actions:                                                │
│  1. ✓ Verify admin permissions                                 │
│  2. ✓ Get account details                                      │
│  3. ✓ Create transaction record                                │
│     - Reference: TXN1234567892                                  │
│     - Status: completed                                         │
│     - Payment method: account                                   │
│  4. ✓ Update account balance (instant)                         │
│     - Old: $1,000.00                                           │
│     - New: $1,250.00                                           │
│  5. ✓ Return success response                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows success message: "Deposit successful"                 │
│  • Refreshes account data                                      │
│  • Updates balance display: $1,250.00                          │
│  • Adds transaction to history                                 │
│  • Closes modal                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow (Card Declined)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Enters card: 4000 0000 0000 0002 (test declined card)      │
│  2. Clicks "Deposit"                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE ELEMENTS                               │
│                                                                  │
│  • Validates format: ✓ Valid                                   │
│  • Creates payment method: ✓ pm_xxxxx                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  • Sends to Stripe API                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE API                                    │
│                                                                  │
│  • Attempts to charge card                                     │
│  • Card issuer declines                                        │
│  • Returns error: { code: "card_declined" }                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  • Catches Stripe error                                        │
│  • Translates to user-friendly message                         │
│  • Returns 400 error:                                          │
│    "Your card was declined. Please try a different card."      │
│  • Does NOT create transaction                                 │
│  • Does NOT update balance                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows error toast: ❌ "Your card was declined..."           │
│  • Modal stays open                                            │
│  • User can try again with different card                      │
│  • Balance unchanged                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Withdrawal Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Clicks $ icon on account (Balance: $1,250.00)              │
│  2. Selects "Withdrawal" + "Account"                            │
│  3. Enters amount: $200.00                                      │
│  4. Clicks "Withdraw Funds"                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  POST /api/admin/transactions                                   │
│  {                                                              │
│    accountId: 123,                                              │
│    type: "withdrawal",                                          │
│    amount: 200.00,                                              │
│    paymentMethod: "account"                                     │
│  }                                                              │
│                                                                  │
│  Server Actions:                                                │
│  1. ✓ Verify admin permissions                                 │
│  2. ✓ Get account details                                      │
│  3. ✓ Check balance: $1,250.00 >= $200.00 ✓                   │
│  4. ✓ Create transaction record                                │
│     - Reference: TXN1234567893                                  │
│     - Status: completed                                         │
│     - Type: withdrawal                                          │
│  5. ✓ Update account balance                                   │
│     - Old: $1,250.00                                           │
│     - New: $1,050.00                                           │
│  6. ✓ Return success response                                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows success message: "Withdrawal successful"              │
│  • Refreshes account data                                      │
│  • Updates balance display: $1,050.00                          │
│  • Adds transaction to history                                 │
│  • Closes modal                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Insufficient Funds Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN USER                               │
│                                                                  │
│  1. Account balance: $1,050.00                                  │
│  2. Attempts withdrawal: $2,000.00                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR SERVER                                   │
│                                                                  │
│  1. ✓ Verify admin permissions                                 │
│  2. ✓ Get account details                                      │
│  3. ✗ Check balance: $1,050.00 < $2,000.00 ✗                  │
│  4. ✗ Return 400 error: "Insufficient funds"                   │
│  5. ✗ No transaction created                                   │
│  6. ✗ Balance unchanged                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│                                                                  │
│  • Shows error toast: ❌ "Insufficient funds"                  │
│  • Modal stays open                                            │
│  • User can adjust amount                                      │
│  • Balance unchanged: $1,050.00                                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Summary

```
┌──────────────┐
│   Browser    │  User Interface
│  (React UI)  │  - AdminTransactionModal
└──────┬───────┘  - Stripe Elements
       │
       │ HTTPS
       ▼
┌──────────────┐
│   Server     │  API Endpoints
│ (Express.js) │  - /api/admin/transactions
└──────┬───────┘  - Authentication
       │          - Validation
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│  Stripe API  │  │   Database   │
│              │  │              │
│ - Validate   │  │ - Users      │
│ - Process    │  │ - Accounts   │
│ - Charge     │  │ - Transactions│
└──────────────┘  └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Authentication                                        │
│  ├─ Admin role verification                                    │
│  ├─ Session validation                                         │
│  └─ Permission checks                                          │
│                                                                  │
│  Layer 2: Input Validation                                     │
│  ├─ Amount validation (positive, numeric)                      │
│  ├─ Account existence check                                    │
│  ├─ Balance verification (withdrawals)                         │
│  └─ Payment method validation                                  │
│                                                                  │
│  Layer 3: Payment Processing                                   │
│  ├─ Stripe tokenization (cards never touch server)            │
│  ├─ PCI DSS compliance                                         │
│  ├─ Fraud detection (Stripe Radar)                            │
│  └─ 3D Secure support                                          │
│                                                                  │
│  Layer 4: Data Protection                                      │
│  ├─ HTTPS encryption                                           │
│  ├─ Environment variable secrets                               │
│  ├─ SQL injection prevention                                   │
│  └─ XSS protection                                             │
│                                                                  │
│  Layer 5: Audit Trail                                          │
│  ├─ Transaction logging                                        │
│  ├─ Reference number tracking                                  │
│  ├─ Status monitoring                                          │
│  └─ Admin action recording                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Note**: All flows shown are for the current implementation. In production, additional steps like webhooks, email notifications, and advanced fraud detection would be added.
