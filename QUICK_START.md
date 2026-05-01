# Quick Start Guide - Admin Transaction Management

Get up and running with the new admin transaction features in 5 minutes!

## Step 1: Get Stripe Test Keys (2 minutes)

1. Go to https://dashboard.stripe.com/register
2. Sign up for a free account
3. Skip the onboarding (click "Skip for now")
4. Go to **Developers** → **API keys**
5. Copy your test keys:
   - **Publishable key**: Starts with `pk_test_`
   - **Secret key**: Starts with `sk_test_` (click "Reveal test key")

## Step 2: Configure Environment (1 minute)

Add these to your `.env` file (create it if it doesn't exist):

```env
STRIPE_SECRET_KEY=sk_test_paste_your_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_paste_your_publishable_key_here
```

**Important**: Replace the placeholder values with your actual Stripe test keys!

## Step 3: Start the Application (1 minute)

```bash
npm run dev
```

Wait for the server to start. You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5000/
```

## Step 4: Test the Features (1 minute)

### Access Admin Dashboard

1. Open http://localhost:5000
2. Log in as an admin user
3. Navigate to the **Accounts** tab

### Make a Test Deposit

1. Click the **$ (dollar sign)** icon on any account
2. Select **Deposit**
3. Choose **Card** as payment method
4. Enter amount: `100.00`
5. Enter test card: `4242 4242 4242 4242`
6. Expiry: `12/25`
7. CVC: `123`
8. Click **Deposit $100.00**

✅ You should see a success message and the balance updated!

### Test Error Handling

Try a declined card:
1. Click the $ icon again
2. Select **Deposit** → **Card**
3. Enter amount: `50.00`
4. Enter test card: `4000 0000 0000 0002` (this card will be declined)
5. Expiry: `12/25`, CVC: `123`
6. Click **Deposit**

❌ You should see: "Your card was declined. Please try a different card."

## That's It! 🎉

You now have a fully functional admin transaction system with:
- ✅ Card payments via Stripe
- ✅ Bank transfers
- ✅ Direct account adjustments
- ✅ Real-time validation
- ✅ Error handling

## What's Next?

### Test More Features

**Bank Transfer Deposit:**
1. Click $ icon → **Deposit** → **Bank**
2. Select a bank from dropdown
3. Enter account holder name
4. Account number: `123456789`
5. Routing number: `110000000` (must be 9 digits)
6. Click **Deposit Funds**

**Withdrawal:**
1. Click $ icon → **Withdrawal** → **Account**
2. Enter amount (less than balance)
3. Click **Withdraw Funds**

### More Test Cards

Try these for different scenarios:

| Card Number | Result |
|------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient funds |
| 4000 0000 0000 0069 | ❌ Expired card |
| 4000 0000 0000 0127 | ❌ Incorrect CVC |

### Read Full Documentation

- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Complete Stripe setup guide
- **[ADMIN_TRANSACTIONS.md](./ADMIN_TRANSACTIONS.md)** - Feature documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details

## Troubleshooting

### "Stripe is not defined"
**Fix**: Make sure you added `VITE_STRIPE_PUBLISHABLE_KEY` to `.env` and restarted the server

### "Invalid API Key"
**Fix**: Check that your secret key in `.env` starts with `sk_test_`

### "Card validation failed"
**Fix**: Make sure you're using a valid test card number from the table above

### Modal doesn't open
**Fix**: Make sure you're logged in as an admin user

## Need Help?

1. Check the browser console for errors (F12)
2. Check server logs in your terminal
3. Review the full documentation files
4. Verify your Stripe keys are correct

---

**Ready to go live?** See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for production checklist!
