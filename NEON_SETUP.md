# Neon Database Setup Guide

This guide will help you set up a persistent PostgreSQL database using Neon for your CashPoint banking application.

## 🚀 Quick Setup

### Step 1: Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Choose a region close to your users

### Step 2: Get Database Connection String
1. In your Neon dashboard, go to your project
2. Click on "Connection Details"
3. Copy the connection string (it looks like: `postgresql://username:password@host/database`)

### Step 3: Configure Environment
1. Create or update your `.env` file:
```bash
DATABASE_URL=postgresql://your-connection-string-here
```

### Step 4: Run Database Setup
```bash
npm run db:setup
```

This will:
- ✅ Create all necessary database tables
- ✅ Set up database enums and constraints
- ✅ Create the admin user
- ✅ Verify the connection

## 🔧 Manual Setup (Alternative)

If the automatic setup doesn't work, you can set up manually:

### 1. Install Dependencies
```bash
npm install @neondatabase/serverless drizzle-orm
```

### 2. Create Tables Manually
Run this SQL in your Neon console:

```sql
-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE account_type AS ENUM ('checking', 'savings', 'investment');
CREATE TYPE account_status AS ENUM ('active', 'inactive', 'frozen');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth TEXT,
  occupation TEXT,
  sex TEXT,
  marital_status TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  alternative_phone TEXT,
  ssn TEXT,
  id_number TEXT,
  next_of_kin_name TEXT,
  next_of_kin_phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  kyc_status kyc_status DEFAULT 'pending',
  role user_role DEFAULT 'user'
);

-- Create accounts table
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  account_type account_type NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  balance DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status account_status DEFAULT 'active'
);

-- Create transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id),
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  status transaction_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  reference_number TEXT NOT NULL UNIQUE
);
```

### 3. Create Admin User
```bash
npm run setup:admin
```

## 🔍 Verification

### Check Database Status
Visit: `https://your-app.vercel.app/api/debug/admin`

You should see:
```json
{
  "databaseType": "Neon PostgreSQL",
  "databaseUrl": "Configured",
  "adminExists": true,
  "totalUsers": 1,
  "totalAccounts": 0,
  "totalTransactions": 0
}
```

### Test Admin Login
1. Go to: `https://your-app.vercel.app/admin`
2. Login with:
   - Email: `admin@cashpoint.com`
   - Password: `admin123`

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test connection
node -e "
import { Pool } from '@neondatabase/serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(r => console.log('✅ Connected:', r.rows[0])).catch(e => console.error('❌ Error:', e));
"
```

### Environment Variables
Make sure your `.env` file has:
```bash
DATABASE_URL=postgresql://username:password@host/database
```

### Vercel Deployment
Add the `DATABASE_URL` to your Vercel environment variables:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `DATABASE_URL` with your Neon connection string

## 📊 Database Schema

### Users Table
- Personal information and KYC data
- Role-based access control
- Password hashing with bcrypt

### Accounts Table
- Multiple account types per user
- Balance tracking
- Account status management

### Transactions Table
- Complete transaction history
- Reference numbers for tracking
- Status tracking (pending/completed/failed)

## 🔐 Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ SQL injection protection with parameterized queries
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Secure connection with SSL

## 🚀 Production Considerations

### Performance
- Connection pooling enabled
- Indexed queries for fast lookups
- Optimized for serverless environments

### Backup
- Neon provides automatic backups
- Point-in-time recovery available
- Export functionality in admin panel

### Scaling
- Neon handles connection scaling automatically
- Serverless architecture scales with demand
- Read replicas available for high traffic

## 📞 Support

If you encounter issues:
1. Check the [Neon documentation](https://neon.tech/docs)
2. Verify your connection string format
3. Ensure your IP is not blocked by firewall
4. Check Vercel function logs for errors

## 🎉 Success!

Once set up, your application will have:
- ✅ Persistent data storage
- ✅ Real customer accounts and transactions
- ✅ Admin panel with real data
- ✅ Scalable PostgreSQL database
- ✅ Automatic backups and recovery