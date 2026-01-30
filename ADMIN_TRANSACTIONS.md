# Admin Transaction Management Guide

## Overview

The admin dashboard now includes comprehensive transaction management features that allow administrators to deposit and withdraw funds from user accounts using multiple payment methods.

## Features

### 1. Transaction Types

#### Deposits
- Add funds to user accounts
- Support for multiple payment sources
- Real-time balance updates
- Transaction history tracking

#### Withdrawals
- Remove funds from user accounts
- Balance validation (prevents overdrafts)
- Audit trail for compliance

### 2. Payment Methods

#### Account (Direct)
- **Use Case**: Manual balance adjustments, corrections, bonuses
- **Process**: Direct modification of account balance
- **Validation**: None required (admin action)
- **Speed**: Instant

#### Bank Transfer
- **Use Case**: ACH transfers, wire transfers
- **Required Information**:
  - Bank name (from dropdown of major US banks)
  - Account holder name
  - Account number
  - Routing number (9 digits)
- **Validation**: 
  - Routing number format check
  - Account holder name verification
- **Speed**: Typically 1-3 business days (simulated as instant in demo)

#### Card Payment (Deposits Only)
- **Use Case**: Credit/debit card deposits
- **Required Information**:
  - Card number
  - Expiry date
  - CVC/CVV
  - Billing ZIP code
- **Validation**: 
  - Real-time card validation via Stripe
  - Fraud detection
  - Card type verification
  - Expiry date check
  - CVC validation
- **Speed**: Instant
- **Security**: PCI DSS compliant via Stripe

### 3. Supported Banks

The system includes pre-configured support for major US banks:

1. Chase Bank
2. Bank of America
3. Wells Fargo
4. Citibank
5. US Bank
6. PNC Bank
7. Capital One
8. TD Bank
9. Truist Bank
10. Fifth Third Bank

## How to Use

### Accessing Transaction Management

1. Log in as an admin user
2. Navigate to the **Accounts** tab in the admin dashboard
3. Find the account you want to manage
4. Click the **dollar sign ($)** icon next to the account

### Making a Deposit

1. Click the **Deposit** button
2. Select your payment method:
   - **Account**: For direct deposits
   - **Bank**: For bank transfers
   - **Card**: For card payments
3. Enter the amount
4. Add a description (optional)
5. Complete payment method-specific fields:
   - **Bank**: Fill in bank details
   - **Card**: Enter card information
6. Click **Deposit Funds** or **Deposit $X.XX** (for cards)

### Making a Withdrawal

1. Click the **Withdrawal** button
2. Select your payment method:
   - **Account**: For direct withdrawals
   - **Bank**: For bank transfers
   - Note: Card withdrawals are not supported
3. Enter the amount (must not exceed account balance)
4. Add a description (optional)
5. Complete payment method-specific fields if using bank transfer
6. Click **Withdraw Funds**

## Card Validation

### Automatic Error Detection

The system automatically detects and reports:

1. **Invalid Card Number**
   - Incorrect format
   - Invalid Luhn checksum
   - Unknown card type

2. **Card Declined**
   - Insufficient funds
   - Card blocked by issuer
   - Fraud prevention

3. **Expired Card**
   - Card past expiry date
   - Invalid expiry date format

4. **Incorrect CVC**
   - Wrong security code
   - CVC doesn't match card

5. **Processing Errors**
   - Network issues
   - Stripe API errors
   - Temporary failures

### User-Friendly Error Messages

All errors are translated into clear, actionable messages:
- ❌ "Your card was declined. Please try a different card."
- ❌ "Your card has expired. Please use a different card."
- ❌ "The card's security code (CVC) is incorrect."
- ❌ "An error occurred while processing your card. Please try again."

## Security Features

### Card Payment Security

1. **PCI Compliance**: Card data never touches your server
2. **Stripe Elements**: Secure, pre-built card input fields
3. **Tokenization**: Card details are tokenized by Stripe
4. **Fraud Detection**: Stripe Radar analyzes transactions
5. **3D Secure**: Optional additional authentication

### Bank Transfer Security

1. **Routing Number Validation**: Ensures 9-digit format
2. **Account Holder Verification**: Name matching
3. **Audit Trail**: All transactions logged
4. **Admin-Only Access**: Requires admin privileges

### General Security

1. **Role-Based Access**: Only admins can manage transactions
2. **Balance Validation**: Prevents overdrafts
3. **Transaction Logging**: Complete audit trail
4. **Reference Numbers**: Unique identifier for each transaction
5. **Status Tracking**: Pending → Completed → Failed

## Transaction Flow

### Deposit Flow

```
Admin initiates deposit
    ↓
Select payment method
    ↓
Enter amount & details
    ↓
[If Card] Validate with Stripe
    ↓
Create transaction record
    ↓
Update account balance
    ↓
Mark transaction complete
    ↓
Notify admin of success
```

### Withdrawal Flow

```
Admin initiates withdrawal
    ↓
Check account balance
    ↓
Select payment method
    ↓
Enter amount & details
    ↓
Create transaction record
    ↓
Update account balance
    ↓
Mark transaction complete
    ↓
Notify admin of success
```

## Transaction Records

Each transaction includes:

- **Reference Number**: Unique identifier (e.g., TXN1234567890)
- **Type**: deposit, withdrawal, transfer, payment
- **Amount**: Transaction amount in USD
- **Status**: pending, completed, failed
- **Payment Method**: account, bank, card
- **Payment Details**: JSON with method-specific information
- **Description**: Human-readable description
- **Timestamps**: Created and updated times
- **Account ID**: Associated account

## Best Practices

### For Deposits

1. ✅ Always add a clear description
2. ✅ Verify the account before depositing
3. ✅ Use card payments for immediate deposits
4. ✅ Use bank transfers for large amounts
5. ✅ Double-check the amount before confirming

### For Withdrawals

1. ✅ Verify sufficient balance
2. ✅ Confirm with the account holder
3. ✅ Document the reason for withdrawal
4. ✅ Use bank transfers for large withdrawals
5. ✅ Keep records for compliance

### For Card Payments

1. ✅ Use test cards in development
2. ✅ Never store raw card numbers
3. ✅ Always use Stripe for processing
4. ✅ Handle errors gracefully
5. ✅ Provide clear error messages

### For Bank Transfers

1. ✅ Verify routing numbers
2. ✅ Confirm account holder names
3. ✅ Keep bank details secure
4. ✅ Document transfer purposes
5. ✅ Follow ACH regulations

## Compliance & Regulations

### Financial Regulations

- **Bank Secrecy Act (BSA)**: Report large transactions
- **Anti-Money Laundering (AML)**: Monitor suspicious activity
- **Know Your Customer (KYC)**: Verify user identities
- **PCI DSS**: Secure card data handling

### Record Keeping

- Maintain transaction records for 7 years
- Log all admin actions
- Track payment method details
- Document transaction purposes

### Reporting

- Generate monthly transaction reports
- Monitor for unusual patterns
- Report suspicious activity
- Maintain audit trails

## Troubleshooting

### Common Issues

#### "Insufficient funds"
**Cause**: Withdrawal amount exceeds account balance
**Solution**: Reduce amount or deposit funds first

#### "Card payment failed"
**Cause**: Various card issues
**Solution**: Check error message and try different card

#### "Invalid routing number"
**Cause**: Routing number not 9 digits
**Solution**: Verify routing number format

#### "Transaction pending"
**Cause**: Processing delay
**Solution**: Wait or check transaction status

### Getting Help

1. Check transaction logs
2. Review error messages
3. Verify payment details
4. Contact Stripe support for card issues
5. Check bank details for transfer issues

## API Endpoints

### Create Admin Transaction

```http
POST /api/admin/transactions
Content-Type: application/json
X-User-Id: {admin_user_id}

{
  "accountId": 123,
  "type": "deposit",
  "amount": 100.00,
  "description": "Admin deposit",
  "paymentMethod": "card",
  "paymentDetails": "{...}"
}
```

### Response

```json
{
  "id": 456,
  "accountId": 123,
  "type": "deposit",
  "amount": "100.00",
  "status": "completed",
  "referenceNumber": "TXN1234567890",
  "paymentMethod": "card",
  "createdAt": "2025-01-18T12:00:00Z"
}
```

## Testing

### Test Scenarios

1. **Successful Deposit**
   - Use test card: 4242 4242 4242 4242
   - Amount: $100.00
   - Expected: Success message, balance updated

2. **Declined Card**
   - Use test card: 4000 0000 0000 0002
   - Expected: "Card declined" error

3. **Insufficient Funds Withdrawal**
   - Amount: More than balance
   - Expected: "Insufficient funds" error

4. **Bank Transfer**
   - Valid routing number: 110000000
   - Expected: Success message

## Future Enhancements

- [ ] Batch transaction processing
- [ ] Scheduled transactions
- [ ] Recurring deposits
- [ ] Multi-currency support
- [ ] Advanced fraud detection
- [ ] Transaction reversal
- [ ] Refund processing
- [ ] Export to accounting software
- [ ] Real-time notifications
- [ ] Transaction approval workflow

## Support

For technical support:
- Check the [Stripe Setup Guide](./STRIPE_SETUP.md)
- Review server logs for errors
- Contact your system administrator
- Refer to Stripe documentation

---

**Last Updated**: January 2025
**Version**: 1.0.0
