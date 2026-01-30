# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe for payment processing in your banking application.

## Why Stripe?

Stripe is the industry-leading payment processor with:
- **Excellent Card Validation**: Built-in fraud detection and card validation
- **Multiple Payment Methods**: Support for cards, bank accounts, and more
- **Security**: PCI DSS Level 1 compliant
- **Developer-Friendly**: Great documentation and testing tools
- **Global Support**: Accepts payments from 135+ currencies

## Setup Steps

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create your account
3. Complete the account verification process

### 2. Get Your API Keys

1. Log in to your Stripe Dashboard
2. Navigate to **Developers** → **API keys**
3. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
# Stripe Secret Key (Server-side only - NEVER expose to client)
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here

# Stripe Publishable Key (Client-side - safe to expose)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

**Important Security Notes:**
- ⚠️ NEVER commit your `.env` file to version control
- ⚠️ NEVER expose your secret key in client-side code
- ⚠️ Use test keys during development (they start with `_test_`)
- ⚠️ Switch to live keys only when ready for production

### 4. Test Card Numbers

Stripe provides test card numbers for development:

#### Successful Payments
- **Visa**: `4242 4242 4242 4242`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`

#### Failed Payments (for testing error handling)
- **Card Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`
- **Expired Card**: `4000 0000 0000 0069`
- **Incorrect CVC**: `4000 0000 0000 0127`

**For all test cards:**
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (4 digits for Amex)
- Use any valid ZIP code

### 5. Features Implemented

#### Admin Transaction Management
- ✅ Deposit funds to user accounts
- ✅ Withdraw funds from user accounts
- ✅ Multiple payment methods:
  - **Account**: Direct balance adjustment
  - **Bank**: Bank account details (name, account number, routing number)
  - **Card**: Credit/debit card via Stripe

#### Card Payment Features
- ✅ Real-time card validation
- ✅ Automatic error detection:
  - Invalid card numbers
  - Expired cards
  - Incorrect CVC
  - Insufficient funds
  - Card declined
- ✅ Secure payment processing via Stripe Elements
- ✅ PCI compliance (Stripe handles sensitive card data)

#### Bank Account Features
- ✅ Support for major US banks
- ✅ Account holder name validation
- ✅ Account number input
- ✅ Routing number validation (9-digit format)
- ✅ Bank selection from popular banks list

### 6. Testing the Integration

#### Test Card Deposits

1. Log in as an admin
2. Navigate to **Accounts** tab
3. Click the dollar sign icon on any account
4. Select **Deposit** and **Card** as payment method
5. Enter an amount (e.g., $100.00)
6. Use a test card number: `4242 4242 4242 4242`
7. Enter expiry: `12/25`, CVC: `123`
8. Click "Deposit"

#### Test Card Errors

Try these scenarios to test error handling:

1. **Declined Card**:
   - Use card: `4000 0000 0000 0002`
   - Should show: "Your card was declined"

2. **Expired Card**:
   - Use card: `4000 0000 0000 0069`
   - Should show: "Your card has expired"

3. **Incorrect CVC**:
   - Use card: `4000 0000 0000 0127`
   - Should show: "The card's security code (CVC) is incorrect"

#### Test Bank Deposits

1. Select **Deposit** and **Bank** as payment method
2. Choose a bank from the dropdown
3. Enter account holder name
4. Enter account number (any number for testing)
5. Enter routing number (must be 9 digits, e.g., `110000000`)
6. Click "Deposit Funds"

### 7. Production Checklist

Before going live:

- [ ] Switch from test keys to live keys
- [ ] Enable Stripe Radar for fraud detection
- [ ] Set up webhooks for payment notifications
- [ ] Configure proper error logging
- [ ] Test with real cards in test mode
- [ ] Review Stripe's compliance requirements
- [ ] Set up proper refund policies
- [ ] Configure email notifications for transactions
- [ ] Enable 3D Secure for additional security
- [ ] Set up proper monitoring and alerts

### 8. Security Best Practices

1. **Never log sensitive data**: Don't log full card numbers or CVCs
2. **Use HTTPS**: Always use SSL/TLS in production
3. **Validate on server**: Always validate transactions server-side
4. **Rate limiting**: Implement rate limiting on payment endpoints
5. **Monitor for fraud**: Use Stripe Radar and set up alerts
6. **Keep Stripe.js updated**: Always use the latest version
7. **Secure your API keys**: Use environment variables, never hardcode

### 9. Common Issues and Solutions

#### Issue: "Stripe is not defined"
**Solution**: Make sure you've added `VITE_STRIPE_PUBLISHABLE_KEY` to your `.env` file

#### Issue: "Invalid API Key"
**Solution**: Check that your secret key is correct and starts with `sk_test_` or `sk_live_`

#### Issue: "Card validation failed"
**Solution**: Ensure you're using valid test card numbers from Stripe's documentation

#### Issue: "CORS errors"
**Solution**: Stripe requests should work from any domain in test mode

### 10. Stripe Dashboard Features

Monitor your transactions in the Stripe Dashboard:

- **Payments**: View all successful payments
- **Customers**: Manage customer payment methods
- **Disputes**: Handle chargebacks
- **Radar**: View fraud detection alerts
- **Logs**: Debug API requests
- **Reports**: Generate financial reports

### 11. Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Testing Guide](https://stripe.com/docs/testing)
- [Security Best Practices](https://stripe.com/docs/security)
- [Stripe Elements](https://stripe.com/docs/stripe-js)

### 12. Support

If you encounter issues:
1. Check the browser console for errors
2. Review server logs for Stripe API errors
3. Visit [Stripe Support](https://support.stripe.com)
4. Check [Stripe Status](https://status.stripe.com) for service issues

---

## Quick Start Commands

```bash
# Install dependencies (already done)
npm install stripe @stripe/stripe-js @stripe/react-stripe-js

# Add environment variables to .env
echo "STRIPE_SECRET_KEY=sk_test_your_key" >> .env
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key" >> .env

# Start the development server
npm run dev
```

## Architecture Overview

```
Client (Browser)
    ↓
Stripe Elements (Card Input)
    ↓
Stripe.js (Creates Payment Method)
    ↓
Your Server (Validates & Processes)
    ↓
Stripe API (Charges Card)
    ↓
Database (Records Transaction)
```

This architecture ensures:
- Card data never touches your server
- PCI compliance is maintained
- Secure payment processing
- Proper error handling
