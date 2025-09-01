#!/usr/bin/env node

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import ws from 'ws';
import bcrypt from 'bcrypt';
import { users, accounts, transactions } from '../shared/schema.js';

// Configure Neon
neonConfig.webSocketConstructor = ws;

async function setupNeonDatabase() {
  console.log('🚀 Setting up Neon PostgreSQL database...\n');

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('\n📋 To set up Neon database:');
    console.log('1. Go to https://neon.tech and create an account');
    console.log('2. Create a new project');
    console.log('3. Copy the connection string');
    console.log('4. Add to your .env file: DATABASE_URL=postgresql://...');
    console.log('5. Run this script again\n');
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });
    
    console.log('✅ Connected to Neon database');

    // Create tables using raw SQL (since we don't have migrations set up)
    console.log('📋 Creating database tables...');
    
    // Create enums first
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE account_type AS ENUM ('checking', 'savings', 'investment');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE account_status AS ENUM ('active', 'inactive', 'frozen');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
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
    `);

    // Create accounts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        account_type account_type NOT NULL,
        account_number TEXT NOT NULL UNIQUE,
        balance DECIMAL(15,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        status account_status DEFAULT 'active'
      );
    `);

    // Create transactions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transactions (
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
    `);

    console.log('✅ Database tables created successfully');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@cashpoint.com';
    const adminPassword = 'admin123';
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(sql`email = ${adminEmail}`);
    
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const adminUser = await db.insert(users).values({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        role: 'admin',
        kycStatus: 'approved'
      }).returning();

      console.log('✅ Admin user created:', adminUser[0].email);
    } else {
      // Update existing admin to ensure correct role
      await db.update(users)
        .set({ role: 'admin', kycStatus: 'approved' })
        .where(sql`email = ${adminEmail}`);
      console.log('✅ Admin user updated:', adminEmail);
    }

    // Get database statistics
    const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
    const accountCount = await db.execute(sql`SELECT COUNT(*) as count FROM accounts`);
    const transactionCount = await db.execute(sql`SELECT COUNT(*) as count FROM transactions`);

    console.log('\n📊 Database Statistics:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Accounts: ${accountCount.rows[0].count}`);
    console.log(`   Transactions: ${transactionCount.rows[0].count}`);

    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@cashpoint.com');
    console.log('   Password: admin123');

    console.log('\n✅ Neon database setup complete!');
    console.log('🚀 Your application is now using persistent PostgreSQL storage');

    // Close connection
    await pool.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupNeonDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupNeonDatabase };