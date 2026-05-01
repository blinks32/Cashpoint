import { Pool, neonConfig } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';
import ws from 'ws';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Configure Neon
neonConfig.webSocketConstructor = ws;

async function setupDatabase() {
  console.log('🚀 Setting up Neon database...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    console.log('Make sure you have run: npx vercel env pull .env.local');
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    console.log('✅ Connected to database');

    // Create tables
    console.log('📋 Creating tables...');
    
    // Create enums
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE account_type AS ENUM ('checking', 'savings', 'investment');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE account_status AS ENUM ('active', 'inactive', 'frozen');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'transfer', 'payment');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await pool.query(`
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
    await pool.query(`
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
    await pool.query(`
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

    console.log('✅ Tables created successfully');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminEmail = 'admin@cashpoint.com';
    const adminPassword = 'admin123';
    
    // Check if admin exists
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (existingAdmin.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await pool.query(`
        INSERT INTO users (email, password, first_name, last_name, phone, role, kyc_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [adminEmail, hashedPassword, 'Admin', 'User', '+1234567890', 'admin', 'approved']);

      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // Get stats
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const accountCount = await pool.query('SELECT COUNT(*) as count FROM accounts');
    const transactionCount = await pool.query('SELECT COUNT(*) as count FROM transactions');

    console.log('\n📊 Database Statistics:');
    console.log(`   Users: ${userCount.rows[0].count}`);
    console.log(`   Accounts: ${accountCount.rows[0].count}`);
    console.log(`   Transactions: ${transactionCount.rows[0].count}`);

    console.log('\n🔑 Admin Credentials:');
    console.log('   Email: admin@cashpoint.com');
    console.log('   Password: admin123');

    console.log('\n✅ Database setup complete!');

    await pool.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();