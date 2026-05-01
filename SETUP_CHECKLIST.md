# Setup Checklist ✓

Use this checklist to ensure everything is properly configured.

## Prerequisites

- [ ] Node.js installed (v16 or higher)
- [ ] npm installed
- [ ] Project dependencies installed (`npm install`)

## Stripe Configuration

- [ ] Created Stripe account at https://stripe.com
- [ ] Obtained test publishable key (starts with `pk_test_`)
- [ ] Obtained test secret key (starts with `sk_test_`)
- [ ] Added `STRIPE_SECRET_KEY` to `.env` file
- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY` to `.env` file
- [ ] Verified keys are correct (no typos)

## Database Setup (Optional)

If using PostgreSQL:
- [ ] Database is running
- [ ] Ran migration: `migrations/add_payment_tables.sql`
- [ ] Verified new tables exist: `bank_accounts`, `payment_methods`
- [ ] Verified `transactions` table has new columns

If using in-memory storage (default):
- [ ] No action needed - ready to go!

## Application Setup

- [ ] Started development server (`npm run dev`)
- [ ] Server is running on http://localhost:5000
- [ ] No errors in terminal
- [ ] Can access the application in browser

## Admin Access

- [ ] Have admin user credentials
- [ ] Can log in to admin dashboard
- [ ] Can see "Accounts" tab
- [ ] Can see dollar sign ($) icons on accounts

## Testing - Card Payments

- [ ] Opened transaction modal (clicked $ icon)
- [ ] Selected "Deposit" and "Card"
- [ ] Entered amount: $100.00
- [ ] Used test card: 4242 4242 4242 4242
- [ ] Entered expiry: 12/25
- [ ] Entered CVC: 123
- [ ] Clicked "Deposit"
- [ ] Saw success message
- [ ] Balance updated correctly

## Testing - Card Errors

- [ ] Tested declined card (4000 0000 0000 0002)
- [ ] Saw error message: "Your card was declined"
- [ ] Tested expired card (4000 0000 0000 0069)
- [ ] Saw error message: "Your card has expired"
- [ ] Error messages are clear and helpful

## Testing - Bank Transfers

- [ ] Selected "Deposit" and "Bank"
- [ ] Selected a bank from dropdown
- [ ] Entered account holder name
- [ ] Entered account number
- [ ] Entered routing number (9 digits)
- [ ] Clicked "Deposit Funds"
- [ ] Saw success message
- [ ] Balance updated correctly

## Testing - Account Adjustments

- [ ] Selected "Deposit" and "Account"
- [ ] Entered amount
- [ ] Clicked "Deposit Funds"
- [ ] Balance updated instantly
- [ ] Transaction appears in history

## Testing - Withdrawals

- [ ] Selected "Withdrawal" and "Account"
- [ ] Entered amount less than balance
- [ ] Clicked "Withdraw Funds"
- [ ] Balance decreased correctly
- [ ] Tried withdrawal exceeding balance
- [ ] Saw "Insufficient funds" error

## UI/UX Verification

- [ ] Modal opens smoothly
- [ ] All buttons are clickable
- [ ] Form fields are clearly labeled
- [ ] Payment method icons are visible
- [ ] Transaction type buttons work
- [ ] Modal closes properly
- [ ] Loading states show during processing
- [ ] Success messages appear
- [ ] Error messages are clear

## Security Verification

- [ ] `.env` file is in `.gitignore`
- [ ] Secret keys are not in code
- [ ] Only admins can access transaction modal
- [ ] Card data is handled by Stripe (not stored)
- [ ] HTTPS is used (in production)

## Documentation Review

- [ ] Read [QUICK_START.md](./QUICK_START.md)
- [ ] Read [STRIPE_SETUP.md](./STRIPE_SETUP.md)
- [ ] Read [ADMIN_TRANSACTIONS.md](./ADMIN_TRANSACTIONS.md)
- [ ] Understand test card numbers
- [ ] Know how to handle errors
- [ ] Familiar with payment methods

## Production Readiness (When Ready)

- [ ] Switched to live Stripe keys
- [ ] Removed test mode indicators
- [ ] Enabled Stripe Radar
- [ ] Set up webhooks
- [ ] Configured email notifications
- [ ] Tested with real cards (in test mode)
- [ ] Reviewed compliance requirements
- [ ] Set up monitoring
- [ ] Configured error logging
- [ ] Prepared support documentation

## Common Issues Resolved

- [ ] No "Stripe is not defined" errors
- [ ] No "Invalid API Key" errors
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Modal opens without issues
- [ ] Payments process successfully

## Final Verification

- [ ] All features working as expected
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Transaction history updates
- [ ] Balances calculate correctly
- [ ] Error handling works properly
- [ ] User experience is smooth

---

## Status

**Setup Complete**: _____ / _____ items checked

**Ready for Production**: Yes ☐ / No ☐

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

## Quick Reference

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Expired**: 4000 0000 0000 0069

### Environment Variables
```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Start Command
```bash
npm run dev
```

### Access
- **URL**: http://localhost:5000
- **Admin Dashboard**: /admin
- **Accounts Tab**: Click "Accounts" in sidebar

---

**Last Updated**: January 18, 2025
**Version**: 1.0.0
